'use client';

import { useState, useEffect } from 'react';
import { eventApi, Event } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Plus, Calendar, MapPin, Clock, Users, Sparkles, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import CreateEventDialog from '@/components/CreateEventDialog';
import EventDetailsDialog from '@/components/EventDetailsDialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { AnimatedBackground } from '@/components/animated-background';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getEvents();
      if (response.success) {
        setEvents(response.data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = () => {
    setShowCreateDialog(false);
    fetchEvents();
  };

  const handleEventDeleted = () => {
    fetchEvents();
  };

  const handleAttendeeChanged = async () => {
    // Refresh events but keep the modal open by updating the selected event
    try {
      const response = await eventApi.getEvents();
      if (response.success) {
        setEvents(response.data);
        // Update the selected event with fresh data
        if (selectedEvent) {
          const updatedEvent = response.data.find(e => e.id === selectedEvent.id);
          if (updatedEvent) {
            setSelectedEvent(updatedEvent);
          }
        }
      }
    } catch (err) {
      // Error handling is done in fetchEvents
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500 relative">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header with Theme Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Events Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500 relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Manager</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 px-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse">
            <Sparkles className="h-4 w-4 animate-spin" />
            Event Management Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200 leading-tight">
            Manage Your Events
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400 leading-relaxed">
            Create, organize, and manage your events with our professional event management platform
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 delay-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 delay-400">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Attendees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.reduce((sum, event) => sum + (event.current_attendee_count || 0), 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 delay-600">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Capacity Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.length > 0 
                    ? Math.round((events.reduce((sum, event) => sum + (event.current_attendee_count || 0), 0) / 
                        events.reduce((sum, event) => sum + event.max_capacity, 0)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Events</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage and organize your upcoming events</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Create New Event
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <AlertDescription className="text-red-700 dark:text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}


        {events.length === 0 ? (
          <Card className="text-center py-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No events yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Get started by creating your first event and begin managing your schedule
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Event
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const capacityPercentage = Math.round(((event.current_attendee_count || 0) / event.max_capacity) * 100);
              const isFullyBooked = capacityPercentage >= 100;
              const isAlmostFull = capacityPercentage >= 80;
              
              return (
                <Card 
                  key={event.id} 
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:-translate-y-1 overflow-hidden"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        variant={isFullyBooked ? "destructive" : isAlmostFull ? "secondary" : "default"}
                        className="shadow-md"
                      >
                        {isFullyBooked ? "Sold Out" : `${event.current_attendee_count || 0}/${event.max_capacity}`}
                      </Badge>
                    </div>
                    
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" 
                         style={{ width: `${Math.min(capacityPercentage, 100)}%` }} />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 text-gray-900 dark:text-white">
                      {event.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format(new Date(event.start_time), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{event.current_attendee_count || 0} attendees</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <CreateEventDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onEventCreated={handleEventCreated}
        />

        {selectedEvent && (
          <EventDetailsDialog
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEventDeleted={handleEventDeleted}
            onAttendeeChanged={handleAttendeeChanged}
          />
        )}
      </div>
    </div>
  );
}
