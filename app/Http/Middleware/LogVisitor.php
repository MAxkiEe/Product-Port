<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Visitor;
use Illuminate\Support\Facades\Cache;

class LogVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        
        // Only log once per day per IP to prevent spam
        $cacheKey = "visitor_logged_" . $ip . "_" . date('Y-m-d');
        
        if (!Cache::has($cacheKey)) {
            Visitor::create([
                'ip_address' => $ip,
                'user_agent' => $request->userAgent(),
                'visited_at' => now(),
            ]);
            
            // Cache until end of day
            Cache::put($cacheKey, true, now()->endOfDay());
        }

        return $next($request);
    }
}
