<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'price', 'original_price', 'category_key', 'rating', 'reviews',
        'description_key', 'stock', 'images', 'colors', 'specs_keys'
    ];

    protected $casts = [
        'images' => 'array',
        'colors' => 'array',
        'specs_keys' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];
}
