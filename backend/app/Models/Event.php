<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'start_time',
        'end_time',
        'max_capacity',
        'description'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the attendees for the event.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class);
    }

    /**
     * Get the current number of registered attendees.
     */
    public function getCurrentAttendeeCountAttribute(): int
    {
        return $this->attendees()->count();
    }

    /**
     * Check if the event is fully booked.
     */
    public function isFullyBooked(): bool
    {
        return $this->current_attendee_count >= $this->max_capacity;
    }

    /**
     * Check if the event is upcoming.
     */
    public function isUpcoming(): bool
    {
        return $this->start_time > Carbon::now();
    }

    /**
     * Scope to get only upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', Carbon::now());
    }
}
