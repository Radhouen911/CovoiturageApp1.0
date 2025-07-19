<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance mode via the "down" command we will
| require this file so that any middleware being attached to the application
| can be bypassed and the response quickly sent back to the developer's
| browser directly.
|
*/

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, auto-loading mechanism for applications
| that consists of a simple call to the Composer "autoload" file. We feel
| free to give them to a consumer for full freedom.
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application instance, we can handle the incoming request
| through the kernel's run method, which sends the response back to the
| client's browser and sends the response back to the client.
|
*/

/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
);

// --- START CORS HEADERS (Direct Injection for Debugging) ---
// WARNING: Using '*' is a security risk in production.
// For production, replace '*' with your specific frontend origin(s), e.g., 'http://localhost:3000'
$allowedOrigin = '*'; // Allows all origins for debugging purposes
$origin = $request->header('Origin');

if ($origin && ($allowedOrigin === '*' || in_array($origin, explode(',', $allowedOrigin)))) {
    $response->headers->set('Access-Control-Allow-Origin', $origin);
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-TOKEN, X-Requested-With, Accept, Origin');
    $response->headers->set('Access-Control-Allow-Credentials', 'true');
    $response->headers->set('Access-Control-Max-Age', '86400'); // Cache preflight requests for 24 hours

    // Handle preflight requests (OPTIONS method)
    if ($request->isMethod('OPTIONS')) {
        $response->setStatusCode(204); // No Content
        $response->setContent(''); // Empty content for OPTIONS
    }
}
// --- END CORS HEADERS ---

$response->send();

$kernel->terminate($request, $response);
