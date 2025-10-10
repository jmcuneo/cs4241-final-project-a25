import React, { useState } from 'react';
import MiniCard from './MiniCard';
import { API } from '../lib/api';

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

//user pastes stop id + name they know
export default function StopSearch() {
  const [stopId, setStopId] = useState('');
  const [stopName, setStopName] = useState('');
  const [route, setRoute] = useState('');

  return (
    <MiniCard title="Add Favorite Stop">
      <form className="flex flex-col gap-2" onSubmit={async (e)=>{
        e.preventDefault();
        if (!stopId) return;
        await API.addFavorite({ stopId, stopName, route });
        setStopId(''); setStopName(''); setRoute('');
        location.reload();
      }}>
        <label className="text-sm">
          <span className="block mb-1">Stop ID</span>
          <SelectStop/>
          <input value={stopId} onChange={e=>setStopId(e.target.value)} required className="w-full border rounded-lg px-3 py-2"/>
        </label>
        <label className="text-sm">
          <span className="block mb-1">Stop Name (optional)</span>
          <input value={stopName} onChange={e=>setStopName(e.target.value)} className="w-full border rounded-lg px-3 py-2"/>
        </label>
        <label className="text-sm">
          <span className="block mb-1">Route (optional)</span>
          <input value={route} onChange={e=>setRoute(e.target.value)} className="w-full border rounded-lg px-3 py-2"/>
        </label>
        <button className="self-start px-4 py-2 rounded-xl bg-neutral-900 text-white">Save</button>
      </form>
      <p className="mt-2 text-xs text-neutral-500">
        Tip: you can find stop IDs on the MBTA site or dev docs.
      </p>
    </MiniCard>
  );
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function SelectStop() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
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