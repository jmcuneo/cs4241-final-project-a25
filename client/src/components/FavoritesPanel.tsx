import React, { useEffect, useState } from 'react';
import MiniCard from './MiniCard';
import { API } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, UsersIcon, DollarSignIcon, ActivityIcon } from "lucide-react"
import CountdownTimer from '@/components/CountdownTimer';


export default function FavoritesPanel() {
  const [favs, setFavs] = useState<any[]>([]);
  const [preds, setPreds] = useState<Record<string, any>>({});

  async function load() {
    const { favorites } = await API.favorites();
    setFavs(favorites || []);
    favorites?.forEach(async (f:any) => {
      const p = await API.predictions(f.stopId);
      console.log(p)
      setPreds(s => ({ ...s, [f.stopId]: p }));
    });

  }
  
  let stopData = (f) => {
    let obj = (preds[f.stopId]?.data || []).reduce((accumulator, currentItem) => {
      const category = currentItem.relationships.route.data.id;
      if (!accumulator[category]) {
        accumulator[category] = []; // Initialize an empty array for the category if it doesn't exist
      }
      accumulator[category].push(currentItem); // Add the current item to its category's array
      return accumulator;
    }, {});

    return (
      Object.keys(obj).map((key) => {
        let route = obj[key];
        route = route.sort((p1:any, p2:any) => {
          const time1 = new Date(p1.attributes.arrival_time)
          const time2 = new Date(p2.attributes.arrival_time)
          return time1 - time2;
        });
        route = route.slice(0, 5)

        console.log(route)
        return (
          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Route: {key}</CardTitle>
            </CardHeader>
            <CardContent>
              <h1>Next arrival in <CountdownTimer targetDate={route[0].attributes.arrival_time} refreshPage={load} /></h1>
              <br />
              {route.map((p) => (
                <CountdownTimer key={p.id} targetDate={p.attributes.arrival_time} intervalSec={1} />
              ))}
            </CardContent>
          </Card>
        );
      })
    )
  } 

  useEffect(()=>{ load(); }, []);
  //return list of favs with next arrivals
  return (
    <MiniCard title="My Stops">
      <Button onClick={() => {load()}}><RefreshCw /> Refresh</Button>
      {!favs.length && <p className="text-sm text-neutral-500">No favorites yet.</p>}
      <ul className="space-y-3">
        {favs.map(f => (
          <li key={f.stopId} className="border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{f.stopName || f.stopId}</div>
                <div className="text-xs text-neutral-500">{f.route || ''}</div>
              </div>
              <button
                className="text-red-600 text-sm"
                onClick={async ()=>{
                  await API.delFavorite(f.stopId);
                  setFavs(prev => prev.filter(x=>x.stopId!==f.stopId));
                }}
                aria-label={`Remove ${f.stopName || f.stopId} from favorites`}>
                Remove
              </button>
            </div>
            <div className="w-full p-6 flex justify-center">
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
                {stopData(f)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MiniCard>
  );
}
