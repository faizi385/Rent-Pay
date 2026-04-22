<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Cameras, laptops, phones, and other electronic devices',
                'slug' => 'electronics',
                'icon' => 'laptop',
            ],
            [
                'name' => 'Clothing',
                'description' => 'Traditional outfits, formal wear, casual clothing',
                'slug' => 'clothing',
                'icon' => 'shirt',
            ],
            [
                'name' => 'Vehicles',
                'description' => 'Cars, motorcycles, bicycles for rent',
                'slug' => 'vehicles',
                'icon' => 'car',
            ],
            [
                'name' => 'Furniture',
                'description' => 'Home furniture, office furniture, decorations',
                'slug' => 'furniture',
                'icon' => 'sofa',
            ],
            [
                'name' => 'Tools',
                'description' => 'Power tools, hand tools, gardening equipment',
                'slug' => 'tools',
                'icon' => 'wrench',
            ],
            [
                'name' => 'Sports Equipment',
                'description' => 'Cricket gear, fitness equipment, outdoor gear',
                'slug' => 'sports-equipment',
                'icon' => 'cricket',
            ],
            [
                'name' => 'Books & Media',
                'description' => 'Books, textbooks, movies, music instruments',
                'slug' => 'books-media',
                'icon' => 'book',
            ],
            [
                'name' => 'Event Supplies',
                'description' => 'Party supplies, decorations, tents, chairs',
                'slug' => 'event-supplies',
                'icon' => 'party',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
