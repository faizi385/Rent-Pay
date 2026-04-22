<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'renter_id',
        'start_date',
        'end_date',
        'message',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function renter()
    {
        return $this->belongsTo(User::class, 'renter_id');
    }
}
