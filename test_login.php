<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'admin@example.com')->first();
if ($user) {
    echo "User found: YES\n";
    echo "Password hash: " . $user->password . "\n";
    echo "Hash matches 'password': " . (Hash::check('password', $user->password) ? 'YES' : 'NO') . "\n";
} else {
    echo "User found: NO\n";
}
