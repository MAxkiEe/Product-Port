<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Visitor;
use App\Models\BlockedIp;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Order;

class DashboardController extends Controller
{
    public function stats()
    {
        $userCount = User::count();
        $roleCount = Role::count();
        $permissionCount = Permission::count();
        
        // Security Stats
        $visitorsTotal = Visitor::count();
        $visitorsToday = Visitor::whereDate('visited_at', today())->count();
        $blockedIpsCount = BlockedIp::count();

        // Financial Stats
        $totalRevenue = Order::whereIn('status', ['paid', 'completed', 'shipped'])->sum('total_amount');
        $ordersToday = Order::whereDate('created_at', today())->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        // Lists
        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']);
        $recentVisitors = Visitor::orderBy('visited_at', 'desc')->take(5)->get(['id', 'ip_address', 'visited_at', 'user_agent']);

        return response()->json([
            'users' => $userCount,
            'roles' => $roleCount,
            'permissions' => $permissionCount,
            'visitors_total' => $visitorsTotal,
            'visitors_today' => $visitorsToday,
            'blocked_ips' => $blockedIpsCount,
            'total_revenue' => $totalRevenue,
            'orders_today' => $ordersToday,
            'pending_orders' => $pendingOrders,
            'recent_users' => $recentUsers,
            'recent_visitors' => $recentVisitors
        ]);
    }
}
