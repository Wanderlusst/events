<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Attendee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;

class AttendeeTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_attendee(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 10
        ]);

        $attendeeData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Successfully registered for the event'
            ])
            ->assertJsonPath('data.name', $attendeeData['name'])
            ->assertJsonPath('data.email', $attendeeData['email'])
            ->assertJsonPath('data.event_id', (string) $event->id);

        $this->assertDatabaseHas('attendees', [
            'event_id' => $event->id,
            'name' => $attendeeData['name'],
            'email' => $attendeeData['email']
        ]);
    }

    public function test_cannot_register_duplicate_email(): void
    {
        $event = Event::factory()->create();
        
        // Create existing attendee
        Attendee::factory()->create([
            'event_id' => $event->id,
            'email' => 'john@example.com'
        ]);

        $attendeeData = [
            'name' => 'Jane Doe',
            'email' => 'john@example.com' // Same email
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Email already registered for this event'
            ]);
    }

    public function test_cannot_register_when_event_is_fully_booked(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 1
        ]);

        // Fill the event to capacity
        Attendee::factory()->create([
            'event_id' => $event->id
        ]);

        $attendeeData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Event is fully booked'
            ]);
    }

    public function test_cannot_register_for_nonexistent_event(): void
    {
        $attendeeData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson('/api/events/999/register', $attendeeData);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Event not found'
            ]);
    }

    public function test_validation_errors_for_invalid_data(): void
    {
        $event = Event::factory()->create();

        $response = $this->postJson("/api/events/{$event->id}/register", []);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation failed'
            ])
            ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_can_get_event_attendees(): void
    {
        $event = Event::factory()->create();
        
        // Create some attendees
        $attendees = Attendee::factory()->count(3)->create([
            'event_id' => $event->id
        ]);

        $response = $this->getJson("/api/events/{$event->id}/attendees");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event attendees retrieved successfully'
            ])
            ->assertJsonCount(3, 'data.data');

        $this->assertEquals(3, $response->json('data.total'));
    }

    public function test_attendees_pagination_works(): void
    {
        $event = Event::factory()->create();
        
        // Create 25 attendees
        Attendee::factory()->count(25)->create([
            'event_id' => $event->id
        ]);

        $response = $this->getJson("/api/events/{$event->id}/attendees?per_page=10&page=1");

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data.data')
            ->assertJsonPath('data.current_page', 1)
            ->assertJsonPath('data.per_page', 10)
            ->assertJsonPath('data.total', 25)
            ->assertJsonPath('data.last_page', 3);
    }

    public function test_can_get_specific_attendee(): void
    {
        $attendee = Attendee::factory()->create();

        $response = $this->getJson("/api/attendees/{$attendee->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Attendee retrieved successfully'
            ])
            ->assertJsonPath('data.id', $attendee->id)
            ->assertJsonPath('data.name', $attendee->name)
            ->assertJsonPath('data.email', $attendee->email);
    }

    public function test_can_update_attendee(): void
    {
        $attendee = Attendee::factory()->create();

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];

        $response = $this->putJson("/api/attendees/{$attendee->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Attendee updated successfully'
            ])
            ->assertJsonPath('data.name', $updateData['name'])
            ->assertJsonPath('data.email', $updateData['email']);

        $this->assertDatabaseHas('attendees', [
            'id' => $attendee->id,
            'name' => $updateData['name'],
            'email' => $updateData['email']
        ]);
    }

    public function test_cannot_update_attendee_with_duplicate_email(): void
    {
        $event = Event::factory()->create();
        
        $attendee1 = Attendee::factory()->create([
            'event_id' => $event->id,
            'email' => 'email1@example.com'
        ]);

        $attendee2 = Attendee::factory()->create([
            'event_id' => $event->id,
            'email' => 'email2@example.com'
        ]);

        $updateData = [
            'email' => 'email1@example.com' // Try to use attendee1's email
        ];

        $response = $this->putJson("/api/attendees/{$attendee2->id}", $updateData);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Email already registered for this event'
            ]);
    }

    public function test_can_delete_attendee(): void
    {
        $attendee = Attendee::factory()->create();

        $response = $this->deleteJson("/api/attendees/{$attendee->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Attendee removed successfully'
            ]);

        $this->assertDatabaseMissing('attendees', ['id' => $attendee->id]);
    }

    public function test_returns_404_for_nonexistent_attendee(): void
    {
        $response = $this->getJson('/api/attendees/999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Attendee not found'
            ]);
    }
}
