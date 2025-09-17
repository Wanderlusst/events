<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Attendee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_upcoming_events(): void
    {
        // Create past event
        Event::factory()->create([
            'start_time' => Carbon::now()->subDays(1),
            'end_time' => Carbon::now()->subHours(1),
        ]);

        // Create upcoming event
        $upcomingEvent = Event::factory()->create([
            'start_time' => Carbon::now()->addDays(1),
            'end_time' => Carbon::now()->addDays(1)->addHours(2),
        ]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Upcoming events retrieved successfully'
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $upcomingEvent->id);
    }

    public function test_can_create_event(): void
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->addDays(1)->format('Y-m-d H:i:s'),
            'end_time' => Carbon::now()->addDays(1)->addHours(2)->format('Y-m-d H:i:s'),
            'max_capacity' => 100,
            'description' => 'Test Description',
            'timezone' => 'Asia/Kolkata'
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Event created successfully'
            ])
            ->assertJsonPath('data.name', $eventData['name'])
            ->assertJsonPath('data.location', $eventData['location'])
            ->assertJsonPath('data.max_capacity', $eventData['max_capacity']);

        $this->assertDatabaseHas('events', [
            'name' => $eventData['name'],
            'location' => $eventData['location'],
            'max_capacity' => $eventData['max_capacity']
        ]);
    }

    public function test_cannot_create_event_with_past_start_time(): void
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->subDays(1)->format('Y-m-d H:i:s'),
            'end_time' => Carbon::now()->addDays(1)->format('Y-m-d H:i:s'),
            'max_capacity' => 100,
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation failed'
            ])
            ->assertJsonValidationErrors(['start_time']);
    }

    public function test_cannot_create_event_with_end_time_before_start_time(): void
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->addDays(2)->format('Y-m-d H:i:s'),
            'end_time' => Carbon::now()->addDays(1)->format('Y-m-d H:i:s'),
            'max_capacity' => 100,
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation failed'
            ])
            ->assertJsonValidationErrors(['end_time']);
    }

    public function test_can_get_specific_event(): void
    {
        $event = Event::factory()->create();

        $response = $this->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event retrieved successfully'
            ])
            ->assertJsonPath('data.id', $event->id)
            ->assertJsonPath('data.name', $event->name);
    }

    public function test_returns_404_for_nonexistent_event(): void
    {
        $response = $this->getJson('/api/events/999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Event not found'
            ]);
    }

    public function test_can_update_event(): void
    {
        $event = Event::factory()->create();

        $updateData = [
            'name' => 'Updated Event Name',
            'max_capacity' => 200,
        ];

        $response = $this->putJson("/api/events/{$event->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event updated successfully'
            ])
            ->assertJsonPath('data.name', $updateData['name'])
            ->assertJsonPath('data.max_capacity', $updateData['max_capacity']);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'name' => $updateData['name'],
            'max_capacity' => $updateData['max_capacity']
        ]);
    }

    public function test_can_delete_event(): void
    {
        $event = Event::factory()->create();

        $response = $this->deleteJson("/api/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    public function test_timezone_conversion_works_correctly(): void
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => '2025-12-15 09:00:00',
            'end_time' => '2025-12-15 17:00:00',
            'max_capacity' => 100,
            'timezone' => 'Asia/Kolkata'
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(201);

        $event = Event::first();
        
        // IST is UTC+5:30, so 09:00 IST should be 03:30 UTC
        $this->assertEquals('03:30:00', $event->start_time->format('H:i:s'));
        $this->assertEquals('11:30:00', $event->end_time->format('H:i:s'));
    }
}
