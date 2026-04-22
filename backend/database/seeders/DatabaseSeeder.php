<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@rentpay.com',
            'password' => Hash::make('password'),
            'phone' => '+92 300 1234567',
            'city' => 'Karachi',
            'bio' => 'System administrator for RentPay marketplace',
        ]);

        // Create test users
        User::factory()->create([
            'name' => 'Ahmed Khan',
            'email' => 'ahmed@example.com',
            'phone' => '+92 321 9876543',
            'city' => 'Lahore',
            'bio' => 'Photography enthusiast renting out camera equipment',
        ]);

        User::factory()->create([
            'name' => 'Fatima Ali',
            'email' => 'fatima@example.com',
            'phone' => '+92 333 4567890',
            'city' => 'Islamabad',
            'bio' => 'Fashion designer with traditional clothing collection',
        ]);
    }
}
