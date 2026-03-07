<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Based on ProductsData.js
        for ($i = 0; $i < 6; $i++) {
            Product::create([
                'name' => "Product Name " . ($i + 1),
                'price' => 9990,
                'original_price' => 12990,
                'category_key' => $i % 3 === 0 ? 'products_section.category_smartphone' : ($i % 3 === 1 ? 'products_section.category_laptop' : 'products_section.category_accessories'),
                'rating' => 4.5,
                'reviews' => rand(20, 120),
                'description_key' => 'products_section.short_desc',
                'stock' => rand(10, 60),
                'images' => ['main', '1', '2', '3'],
                'colors' => ['white', 'gray-200', 'gray-400', 'gray-600'],
                'specs_keys' => [
                    'products_section.spec_screen',
                    'products_section.spec_battery',
                    'products_section.spec_os',
                    'products_section.spec_camera'
                ]
            ]);
        }
    }
}
