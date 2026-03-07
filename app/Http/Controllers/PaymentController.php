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
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order is already processed'], 400);
        }

        return DB::transaction(function () use ($order, $request) {
            // Mocking payment success
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'amount' => $order->total_amount,
                'status' => 'successful',
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            ]);

            $order->update(['status' => 'paid']);

            return response()->json([
                'message' => 'Payment successful',
                'payment' => $payment,
                'status' => 'paid'
            ]);
        });
    }
}
