import {useState, useEffect, Suspense, lazy} from 'react'
import Legend from "./components/Legend.tsx"
import LoadCountriesTask from '../tasks/LoadCountriesTask.ts'
import legendItems from '../tasks/LegendItems.ts';
import NoUserNav from "./components/noUserNav.tsx";
import Loading from "./loading.tsx";
import axios from "axios";
import type Item from "../../lib/item.ts";
import type Artist from "../../lib/artist.ts";

const Heatmap = lazy(() => import('./components/Heatmap.tsx'));

const hasRun = { current: false };

type CountryGeoJSON = GeoJSON.FeatureCollection;

const Heat = () => {
    const [countries, setCountries] = useState<CountryGeoJSON[] | null>(null);
    const legendItemsInReverse = [...legendItems].reverse()
    const [loading, setLoading] = useState(true);

    // on component mount, store access token and load country data
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const tokenFromHash = params.get('access_token');
        if (tokenFromHash) {
            localStorage.setItem('access_token', tokenFromHash);
            window.history.replaceState(
                null,
                '',
                window.location.pathname + window.location.search
            );
        }
        const token = tokenFromHash ?? localStorage.getItem('access_token');

        // Guard to avoid double run (StrictMode) and require a token
        if (hasRun.current || !token) {
            if (!token) console.error('No access token found');
            return;
        }
        hasRun.current = true;

        const runRequests = async () => {
            try {
                // 1. Get user's email
                const res1 = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + token
                    },
                })
                const userEmail = res1.data.email;
                console.log("User Email:" + userEmail);

                // 2. Get user's recently played tracks
                const res2 = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + token
                    },
                });
                const artists = res2.data.items.flatMap(
                    (item: Item) => item.track.artists.map((artist: Artist) => artist.name)
                ).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

                // 3. Post to Gemini to get country data
                const res3 = await axios.post('/api/gemini', {
                    prompt: artists
                });
                const responseData = res3.data;

                // 4. Post to db to combine email and data and store
                await axios.post("api/load", {
                    userId: userEmail,
                    response: responseData
                });


            } catch (error) {
                console.error("Error: ", error);
            }
            const loadCountriesTask = new LoadCountriesTask();
            const finishedLoading = loadCountriesTask.load(setCountries);
            setLoading(finishedLoading);
        }
        runRequests();
    }, []);

    useEffect(() => {

    }, []);

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <NoUserNav />
                        <Heatmap countries={countries} />
                        <Legend legendItems={legendItemsInReverse} />
                    </>
                )}
            </Suspense>
        </div>
    );
}

export default Heat