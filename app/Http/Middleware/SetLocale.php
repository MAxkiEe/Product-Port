<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->header('Accept-Language');

        // Check if the language is supplied and supported
        if ($lang && in_array($lang, ['en', 'th'])) {
            App::setLocale($lang);
        } else {
            // Default to Thai since that's what the frontend defaults to
            App::setLocale('th');
        }

        return $next($request);
    }
}
