<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
class EventController extends Controller
{
    /**
     * Display a listing of upcoming events.
     */
    public function index(): JsonResponse
    {
        $events = Event::upcoming()
            ->withCount('attendees')
            ->orderBy('start_time')
            ->get()
            ->map(function ($event) {
                $event->current_attendee_count = $event->attendees_count;
                return $event;
            });

        return response()->json([
            'success' => true,
            'data' => $events,
            'message' => 'Upcoming events retrieved successfully'
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'max_capacity' => 'required|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Convert times to IST if timezone is provided
        $timezone = $request->input('timezone', 'Asia/Kolkata');
        
        $eventData = $request->only([
            'name', 'location', 'max_capacity', 'description'
        ]);

        // Handle timezone conversion
        $startTime = Carbon::parse($request->start_time, $timezone)->utc();
        $endTime = Carbon::parse($request->end_time, $timezone)->utc();

        $eventData['start_time'] = $startTime;
        $eventData['end_time'] = $endTime;

        $event = Event::create($eventData);

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event created successfully'
        ], 201);
    }

    /**
     * Display the specified event.
     */
    public function show(string $id): JsonResponse
    {
        $event = Event::with('attendees')->withCount('attendees')->find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $event->current_attendee_count = $event->attendees_count;

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event retrieved successfully'
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'max_capacity' => 'sometimes|required|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'name', 'location', 'max_capacity', 'description'
        ]);

        // Handle timezone conversion for time fields
        if ($request->has('start_time')) {
            $timezone = $request->input('timezone', 'Asia/Kolkata');
            $updateData['start_time'] = Carbon::parse($request->start_time, $timezone)->utc();
        }

        if ($request->has('end_time')) {
            $timezone = $request->input('timezone', 'Asia/Kolkata');
            $updateData['end_time'] = Carbon::parse($request->end_time, $timezone)->utc();
        }

        $event->update($updateData);

        return response()->json([
            'success' => true,
            'data' => $event,
            'message' => 'Event updated successfully'
        ]);
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully'
        ]);
    }
}
