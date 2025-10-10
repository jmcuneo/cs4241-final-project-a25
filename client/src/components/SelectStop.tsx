import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { API } from '../lib/api';
import { useEffect } from 'react';

export function SelectStop(props) {
  const {value, onChange, required} = props;
  const [open, setOpen] = React.useState(false)
  const [stops, setStops] = React.useState([])

  useEffect(() => {
    API.getStops().then((data) => {
        console.log(data.data)
        setStops(data.data.map((stop) => {
            return {
                value: stop.id,
                label: `${stop.id} (${stop.attributes.name})`
            };
        }));
    });
  }, [setStops])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full border rounded-lg px-3 py-2"
        >
          {value
            ? stops.find((stop) => stop.value === value)?.label
            : "Select stop..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search stops..." className="h-9" />
          <CommandList>
            <CommandEmpty>Loading stops...</CommandEmpty>
            <CommandGroup>
              {stops.map((stop) => (
                <CommandItem
                  key={stop.value}
                  value={stop.value}
                  keywords={[stop.label]}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {stop.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === stop.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}