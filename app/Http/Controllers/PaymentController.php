<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|string',
            'slip_image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order is already processed'], 400);
        }

        return DB::transaction(function () use ($order, $request) {
            $slipUrl = null;
            $status = 'successful'; // Default for mock

            if ($request->hasFile('slip_image')) {
                $path = $request->file('slip_image')->store('slips', 'public');
                $slipUrl = asset('storage/' . $path);
                $status = 'pending'; // Requires admin verification
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'amount' => $order->total_amount,
                'status' => $status,
                'transaction_id' => $request->transaction_id ?? 'TXN-' . strtoupper(uniqid()),
                'slip_url' => $slipUrl,
            ]);

            // If it's a slip, we keep order status as 'pending' or 'awaiting_verification'
            // For now, let's use 'processing' if paid, or 'pending' if just uploaded
            if ($status === 'successful') {
                $order->update(['status' => 'paid']);
            }

            return response()->json([
                'message' => $status === 'pending' ? 'Slip uploaded. Awaiting verification.' : 'Payment successful',
                'payment' => $payment,
                'status' => $order->status
            ]);
        });
    }
}
