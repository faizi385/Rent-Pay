<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'image_path',
        'sort_order',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
