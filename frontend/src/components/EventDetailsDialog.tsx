'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, Attendee, attendeeApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Clock, UserPlus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EventDetailsDialogProps {
  event: Event;
  onClose: () => void;
  onEventDeleted: () => void;
  onAttendeeChanged?: () => void; // Add callback for attendee changes
}

export default function EventDetailsDialog({ event, onClose, onAttendeeChanged }: EventDetailsDialogProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '' });
  const [registering, setRegistering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttendees = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await attendeeApi.getEventAttendees(event.id, page, 10);
      if (response.success) {
        setAttendees(response.data.data);
        setTotalPages(response.data.last_page);
        setCurrentPage(response.data.current_page);
      } else {
        setError('Failed to fetch attendees');
      }
    } catch (err) {
      setError('Failed to fetch attendees');
    } finally {
      setLoading(false);
    }
  }, [event.id]);

  useEffect(() => {
    fetchAttendees();
  }, [event.id, fetchAttendees]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.email.trim()) {
      return;
    }

    try {
      setRegistering(true);
      setError(''); // Clear any previous errors
      const response = await attendeeApi.register(event.id, registerForm);
      if (response.success) {
        setRegisterForm({ name: '', email: '' });
        setShowRegisterForm(false);
        fetchAttendees(currentPage);
        // Notify parent component to refresh the events list with a small delay
        setTimeout(() => {
          onAttendeeChanged?.();
        }, 100);
      } else {
        setError('Failed to register attendee');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else if (axiosError.response?.data?.errors) {
          // Handle validation errors
          const errorMessages = Object.values(axiosError.response.data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Failed to register attendee');
        }
      } else {
        setError('Failed to register attendee');
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteAttendee = async (attendeeId: number) => {
    if (!confirm('Are you sure you want to remove this attendee?')) return;

    try {
      const response = await attendeeApi.deleteAttendee(attendeeId);
      if (response.success) {
        fetchAttendees(currentPage);
        // Notify parent component to refresh the events list with a small delay
        setTimeout(() => {
          onAttendeeChanged?.();
        }, 100);
      } else {
        setError('Failed to remove attendee');
      }
    } catch (err) {
      setError('Failed to remove attendee');
    }
  };

  const isFullyBooked = (event.current_attendee_count || 0) >= event.max_capacity;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.name}
          </DialogTitle>
          <DialogDescription>
            Event details and attendee management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                </div>
                <Badge variant={isFullyBooked ? "destructive" : "secondary"}>
                  {event.current_attendee_count || 0}/{event.max_capacity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {format(new Date(event.start_time), 'MMM dd, yyyy HH:mm')} - 
                  {format(new Date(event.end_time), 'HH:mm')}
                </span>
              </div>
              
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Attendee Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendees ({attendees.length})
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowRegisterForm(!showRegisterForm);
                    setError(''); // Clear errors when opening form
                  }}
                  disabled={isFullyBooked}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFullyBooked ? 'Fully Booked' : 'Add Attendee'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showRegisterForm && (
                <form onSubmit={handleRegister} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="Enter attendee name"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="Enter attendee email"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" disabled={registering} size="sm">
                      {registering ? 'Registering...' : 'Register'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRegisterForm(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading attendees...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No attendees registered yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell className="font-medium">{attendee.name}</TableCell>
                          <TableCell>{attendee.email}</TableCell>
                          <TableCell>
                            {format(new Date(attendee.created_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAttendee(attendee.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAttendees(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAttendees(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
