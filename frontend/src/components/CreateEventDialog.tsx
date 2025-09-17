'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { eventApi, CreateEventData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, MapPin, Clock, Users, Globe, Sparkles, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DateTimePicker } from '@/components/date-time-picker';
import { TimezoneSelector } from '@/components/timezone-selector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255, 'Event name is too long'),
  location: z.string().min(1, 'Location is required').max(255, 'Location is too long'),
  start_time: z.date().min(new Date(), 'Start time must be in the future'),
  end_time: z.date().min(new Date(), 'End time must be in the future'),
  max_capacity: z.number().min(1, 'Capacity must be at least 1'),
  description: z.string().optional(),
  timezone: z.string().optional(),
}).refine((data) => {
  return data.end_time > data.start_time;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: () => void;
}

export default function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      timezone: 'Asia/Kolkata',
    },
  });

  const watchedTimezone = watch('timezone');

  const onSubmit = async (data: EventFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Convert Date objects to ISO strings for API
      const eventData: CreateEventData = {
        name: data.name,
        location: data.location,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        max_capacity: data.max_capacity,
        description: data.description,
        timezone: data.timezone || 'Asia/Kolkata',
      };

      const response = await eventApi.createEvent(eventData);
      
      if (response.success) {
        reset();
        onEventCreated();
      } else {
        setError('Failed to create event');
      }
    } catch (err: unknown) {
      console.error('Error creating event:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError('Failed to create event. Please try again.');
        }
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-2xl">
        <TooltipProvider>
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              Create New Event
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
              Fill in the details below to create your event. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-700 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Event Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter event name"
                className={`h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Location *
              </Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Enter event location"
                className={`h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.location && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter event description (optional)"
              rows={4}
              className="resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Start Date & Time *
              </Label>
              <DateTimePicker
                value={watch('start_time')}
                onChange={(date) => setValue('start_time', date || new Date())}
                placeholder="Select start date and time"
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                End Date & Time *
              </Label>
              <DateTimePicker
                value={watch('end_time')}
                onChange={(date) => setValue('end_time', date || new Date())}
                placeholder="Select end date and time"
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="max_capacity" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Maximum Capacity *
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Maximum number of attendees allowed for this event</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="max_capacity"
                type="number"
                min="1"
                {...register('max_capacity', { valueAsNumber: true })}
                placeholder="Enter maximum capacity"
                className={`h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${errors.max_capacity ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.max_capacity && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  {errors.max_capacity.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Timezone
              </Label>
              <TimezoneSelector
                value={watchedTimezone}
                onValueChange={(value) => setValue('timezone', value)}
                placeholder="Select timezone"
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:w-auto h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Event...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create Event
                  </div>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
