<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visitor;
use App\Models\BlockedIp;
use Illuminate\Support\Facades\Cache;

class SecurityController extends Controller
{
    public function getVisitors()
    {
        $visitors = Visitor::orderBy('visited_at', 'desc')->take(100)->get();
        return response()->json($visitors);
    }

    public function getBlockedIps()
    {
        $blockedIps = BlockedIp::orderBy('created_at', 'desc')->get();
        return response()->json($blockedIps);
    }

    public function blockIp(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip|unique:blocked_ips,ip_address',
            'reason' => 'nullable|string|max:255'
        ], [
            'ip_address.unique' => 'IP นี้ถูกบล็อคไว้แล้ว'
        ]);

        $blockedIp = BlockedIp::create([
            'ip_address' => $request->ip_address,
            'reason' => $request->reason
        ]);

        Cache::forget("blocked_ip_{$request->ip_address}");

        return response()->json(['message' => 'เพิ่ม IP ลงในรายการบล็อคเรียบร้อยแล้ว', 'blocked_ip' => $blockedIp], 201);
    }

    public function unblockIp($id)
    {
        $blockedIp = BlockedIp::findOrFail($id);
        
        Cache::forget("blocked_ip_{$blockedIp->ip_address}");
        $blockedIp->delete();

        return response()->json(['message' => 'ปลดบล็อค IP เรียบร้อยแล้ว']);
    }
}
