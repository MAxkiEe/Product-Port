<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\BlockedIp;
use Illuminate\Support\Facades\Cache;

class BlockIpMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $visitorIp = $request->ip();

        // Check if the IP is blocked. Using cache to avoid hitting the DB on every single request.
        $isBlocked = Cache::remember("blocked_ip_{$visitorIp}", 3600, function () use ($visitorIp) {
            return BlockedIp::where('ip_address', $visitorIp)->exists();
        });

        if ($isBlocked) {
            abort(403, 'Your IP address has been blocked from accessing this system.');
        }

        return $next($request);
    }
}
