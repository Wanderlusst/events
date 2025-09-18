import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://events-kax8.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  description?: string;
  current_attendee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  id: number;
  event_id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  description?: string;
  timezone?: string;
}

export interface RegisterAttendeeData {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Event API
export const eventApi = {
  // Get all upcoming events
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get a specific event
  getEvent: async (id: number): Promise<ApiResponse<Event>> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create a new event
  createEvent: async (data: CreateEventData): Promise<ApiResponse<Event>> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  // Update an event
  updateEvent: async (id: number, data: Partial<CreateEventData>): Promise<ApiResponse<Event>> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Attendee API
export const attendeeApi = {
  // Register for an event
  register: async (eventId: number, data: RegisterAttendeeData): Promise<ApiResponse<Attendee>> => {
    try {
      const response = await api.post(`/events/${eventId}/register`, data);
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        
        // If we have a proper error response, throw it with the message
        if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          const message = (axiosError.response.data as { message: string }).message;
          const errorWithMessage = new Error(message);
          (errorWithMessage as Error & { response?: unknown }).response = axiosError.response;
          throw errorWithMessage;
        }
      }
      throw error;
    }
  },

  // Get attendees for an event
  getEventAttendees: async (eventId: number, page = 1, perPage = 15): Promise<ApiResponse<PaginatedResponse<Attendee>>> => {
    const response = await api.get(`/events/${eventId}/attendees`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  },

  // Get a specific attendee
  getAttendee: async (id: number): Promise<ApiResponse<Attendee>> => {
    const response = await api.get(`/attendees/${id}`);
    return response.data;
  },

  // Update an attendee
  updateAttendee: async (id: number, data: Partial<RegisterAttendeeData>): Promise<ApiResponse<Attendee>> => {
    const response = await api.put(`/attendees/${id}`, data);
    return response.data;
  },

  // Delete an attendee
  deleteAttendee: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/attendees/${id}`);
    return response.data;
  },
};

export default api;
