<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price_per_day',
        'security_deposit',
        'city',
        'address',
        'is_available',
    ];

    protected $casts = [
        'price_per_day' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ListingImage::class)->orderBy('sort_order');
    }

    public function bookingRequests()
    {
        return $this->hasMany(BookingRequest::class);
    }
}
