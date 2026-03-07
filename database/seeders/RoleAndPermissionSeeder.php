<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = Role::create(['name' => 'Admin']);
        $userRole = Role::create(['name' => 'User']);

        $admin = User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'password' => bcrypt('password'),
        ]);
        if (! $admin->hasRole('Admin')) {
            $admin->assignRole($adminRole);
        }

        $user = User::firstOrCreate([
            'email' => 'user@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);
        if (! $user->hasRole('User')) {
            $user->assignRole($userRole);
        }
    }
}
