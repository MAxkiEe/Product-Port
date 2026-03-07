<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'contact_phone' => 'required|string',
            'promo_code' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
            'shipping_cost' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Create Order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $request->total_amount,
                'discount_amount' => $request->discount_amount ?? 0,
                'shipping_cost' => $request->shipping_cost ?? 0,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'contact_phone' => $request->contact_phone,
                'promo_code' => $request->promo_code,
            ]);

            // 2. Create Order Items & Update Stock
            foreach ($request->items as $itemData) {
                $product = Product::findOrFail($itemData['id']);
                
                if ($product->stock < $itemData['quantity']) {
                    throw new \Exception("Product {$product->name} is out of stock.");
                }

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $itemData['quantity']);
            }

            return response()->json([
                'message' => 'Order created successfully',
                'order_id' => $order->id,
                'total' => $order->total_amount
            ]);
        });
    }

    public function getMyOrders(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    /**
     * Admin: List all orders
     */
    public function index()
    {
        $orders = Order::with(['user', 'items.product', 'payment'])
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    /**
     * Admin: Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,processing,shipped,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    /**
     * User: Cancel pending order and restore stock
     */
    public function cancelOrder(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        return DB::transaction(function () use ($order) {
            // Restore stock
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);

            return response()->json([
                'message' => 'Order cancelled and stock restored.',
                'status' => 'cancelled'
            ]);
        });
    }
}
