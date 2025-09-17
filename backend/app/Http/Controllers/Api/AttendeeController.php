<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Attendee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AttendeeController extends Controller
{
    /**
     * Register a new attendee for an event.
     */
    public function register(Request $request, string $eventId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $event = Event::find($eventId);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        // Check if event is fully booked
        if ($event->isFullyBooked()) {
            return response()->json([
                'success' => false,
                'message' => 'Event is fully booked'
            ], 400);
        }

        // Check for duplicate email registration
        $existingAttendee = Attendee::where('event_id', $eventId)
            ->where('email', $request->email)
            ->first();

        if ($existingAttendee) {
            return response()->json([
                'success' => false,
                'message' => 'Email already registered for this event'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $attendee = Attendee::create([
                'event_id' => $eventId,
                'name' => $request->name,
                'email' => $request->email
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $attendee,
                'message' => 'Successfully registered for the event'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Get all attendees for a specific event with pagination.
     */
    public function getEventAttendees(Request $request, string $eventId): JsonResponse
    {
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $perPage = $request->input('per_page', 15);
        $attendees = Attendee::where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $attendees,
            'message' => 'Event attendees retrieved successfully'
        ]);
    }

    /**
     * Display the specified attendee.
     */
    public function show(string $id): JsonResponse
    {
        $attendee = Attendee::with('event')->find($id);

        if (!$attendee) {
            return response()->json([
                'success' => false,
                'message' => 'Attendee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attendee,
            'message' => 'Attendee retrieved successfully'
        ]);
    }

    /**
     * Update the specified attendee.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $attendee = Attendee::find($id);

        if (!$attendee) {
            return response()->json([
                'success' => false,
                'message' => 'Attendee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for duplicate email if email is being updated
        if ($request->has('email') && $request->email !== $attendee->email) {
            $existingAttendee = Attendee::where('event_id', $attendee->event_id)
                ->where('email', $request->email)
                ->where('id', '!=', $id)
                ->first();

            if ($existingAttendee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already registered for this event'
                ], 400);
            }
        }

        $attendee->update($request->only(['name', 'email']));

        return response()->json([
            'success' => true,
            'data' => $attendee,
            'message' => 'Attendee updated successfully'
        ]);
    }

    /**
     * Remove the specified attendee from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $attendee = Attendee::find($id);

        if (!$attendee) {
            return response()->json([
                'success' => false,
                'message' => 'Attendee not found'
            ], 404);
        }

        $attendee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attendee removed successfully'
        ]);
    }
}
