<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'], // Allow all HTTP methods
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-CSRF-TOKEN',
        'X-Requested-With', // Common header for AJAX requests
        'Accept',
        'Origin',
    ], // Explicitly allow necessary headers
    'exposed_headers' => [],
    'max_age' => 60 * 60 * 24, // Cache preflight requests for 24 hours (optional, but good practice)
    'supports_credentials' => true, // Crucial for sending cookies (like CSRF token)
];
