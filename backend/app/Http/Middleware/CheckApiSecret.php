<?php

namespace App\Http\Middleware;

use App\Models\SecretKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiSecret
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $apiSecretKey = $request->header('ApiSecretKey');

        if (!$apiSecretKey) {
            return response()->json(['message' => 'API Secret Key is required'], 400);
        }

        $storedKey = SecretKey::value('key'); // more efficient than `first()`

        if ($apiSecretKey !== $storedKey) {
            return response()->json(['message' => 'Unauthorized access'], 401);
        }

        return $next($request);
    }
}
