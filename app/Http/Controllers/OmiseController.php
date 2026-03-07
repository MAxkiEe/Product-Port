<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OmiseCharge;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class OmiseController extends Controller
{
    public function __construct()
    {
        if (!defined('OMISE_PUBLIC_KEY')) {
            define('OMISE_PUBLIC_KEY', env('OMISE_PUBLIC_KEY'));
        }
        if (!defined('OMISE_SECRET_KEY')) {
            define('OMISE_SECRET_KEY', env('OMISE_SECRET_KEY'));
        }
        if (!defined('OMISE_API_VERSION')) {
            define('OMISE_API_VERSION', '2019-05-29');
        }
    }

    public function createCharge(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'token' => 'required_without:source',
            'source' => 'required_without:token',
            'amount' => 'required|numeric'
        ]);

        try {
            $order = Order::findOrFail($request->order_id);
            
            $chargeData = [
                'amount' => $request->amount * 100, // Omise uses cents/satang
                'currency' => 'thb',
                'description' => "Order #{$order->id} at Product Port",
                'metadata' => [
                    'order_id' => $order->id,
                    'user_id' => auth()->id()
                ]
            ];

            if ($request->token) {
                $chargeData['card'] = $request->token;
            } else {
                $chargeData['source'] = $request->source;
                $chargeData['return_uri'] = url("/payment/complete?order_id={$order->id}");
            }

            $charge = OmiseCharge::create($chargeData);

            if ($charge['status'] === 'successful' || $charge['status'] === 'pending') {
                // Link payment to order
                $payment = Payment::updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'payment_method' => $request->token ? 'credit_card' : 'promptpay_omise',
                        'amount' => $request->amount,
                        'status' => $charge['status'] === 'successful' ? 'paid' : 'pending',
                        'transaction_id' => $charge['id']
                    ]
                );

                if ($charge['status'] === 'successful') {
                    $order->update(['status' => 'paid']);
                }

                return response()->json([
                    'status' => $charge['status'],
                    'authorize_uri' => $charge['authorize_uri'] ?? null,
                    'charge_id' => $charge['id']
                ]);
            }

            return response()->json(['error' => 'Charge failed', 'details' => $charge], 400);

        } catch (\Exception $e) {
            Log::error("Omise Charge Error: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        if ($payload['key'] === 'charge.complete') {
            $charge = $payload['data'];
            $orderId = $charge['metadata']['order_id'] ?? null;

            if ($orderId) {
                $order = Order::find($orderId);
                if ($order && $charge['status'] === 'successful') {
                    $order->update(['status' => 'paid']);
                    
                    Payment::where('order_id', $orderId)->update([
                        'status' => 'paid'
                    ]);
                    
                    Log::info("Order #{$orderId} marked as paid via Webhook.");
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
