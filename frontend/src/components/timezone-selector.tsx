'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const timezones = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)', offset: '+05:30' },
  { value: 'UTC', label: 'UTC (GMT)', offset: '+00:00' },
  { value: 'America/New_York', label: 'America/New_York (EST)', offset: '-05:00' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)', offset: '-08:00' },
  { value: 'Europe/London', label: 'Europe/London (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)', offset: '+09:00' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)', offset: '+08:00' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)', offset: '+10:00' },
  { value: 'America/Chicago', label: 'America/Chicago (CST)', offset: '-06:00' },
  { value: 'America/Denver', label: 'America/Denver (MST)', offset: '-07:00' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET)', offset: '+01:00' },
];

interface TimezoneSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  placeholder = "Select timezone",
  disabled = false,
  className
}: TimezoneSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedTimezone = timezones.find((tz) => tz.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            {selectedTimezone ? selectedTimezone.label : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl">
        <Command>
          <CommandInput placeholder="Search timezone..." className="h-9" />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup>
              {timezones.map((timezone) => (
                <CommandItem
                  key={timezone.value}
                  value={timezone.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === timezone.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{timezone.label}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {timezone.offset}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
