<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Event Management API",
 *     version="1.0.0",
 *     description="API for managing events and attendees with timezone support"
 * )
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Development server"
 * )
 * @OA\Tag(
 *     name="Events",
 *     description="Event management endpoints"
 * )
 * @OA\Tag(
 *     name="Attendees",
 *     description="Attendee management endpoints"
 * )
 */
class SwaggerController extends Controller
{
    /**
     * @OA\Schema(
     *     schema="Event",
     *     type="object",
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="name", type="string", example="Tech Conference 2025"),
     *     @OA\Property(property="location", type="string", example="Convention Center, Mumbai"),
     *     @OA\Property(property="start_time", type="string", format="date-time", example="2025-12-15T03:30:00.000000Z"),
     *     @OA\Property(property="end_time", type="string", format="date-time", example="2025-12-15T11:30:00.000000Z"),
     *     @OA\Property(property="max_capacity", type="integer", example=100),
     *     @OA\Property(property="description", type="string", example="Annual technology conference"),
     *     @OA\Property(property="current_attendee_count", type="integer", example=25),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time")
     * )
     */
    public function eventSchema() {}

    /**
     * @OA\Schema(
     *     schema="Attendee",
     *     type="object",
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="event_id", type="integer", example=1),
     *     @OA\Property(property="name", type="string", example="John Doe"),
     *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time")
     * )
     */
    public function attendeeSchema() {}

    /**
     * @OA\Schema(
     *     schema="CreateEventRequest",
     *     type="object",
     *     required={"name", "location", "start_time", "end_time", "max_capacity"},
     *     @OA\Property(property="name", type="string", example="Tech Conference 2025"),
     *     @OA\Property(property="location", type="string", example="Convention Center, Mumbai"),
     *     @OA\Property(property="start_time", type="string", format="date-time", example="2025-12-15 09:00:00"),
     *     @OA\Property(property="end_time", type="string", format="date-time", example="2025-12-15 17:00:00"),
     *     @OA\Property(property="max_capacity", type="integer", example=100),
     *     @OA\Property(property="description", type="string", example="Annual technology conference"),
     *     @OA\Property(property="timezone", type="string", example="Asia/Kolkata")
     * )
     */
    public function createEventRequestSchema() {}

    /**
     * @OA\Schema(
     *     schema="RegisterAttendeeRequest",
     *     type="object",
     *     required={"name", "email"},
     *     @OA\Property(property="name", type="string", example="John Doe"),
     *     @OA\Property(property="email", type="string", format="email", example="john@example.com")
     * )
     */
    public function registerAttendeeRequestSchema() {}
}