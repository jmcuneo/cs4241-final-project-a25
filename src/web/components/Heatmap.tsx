import {GeoJSON, MapContainer} from "react-leaflet"
import "leaflet/dist/leaflet.css";
import "./Heatmap.css"
import type {GeoJSON as GeoJSONType} from "geojson";
import axios from "axios";
import LoadCountriesTask from "../../tasks/LoadCountriesTask";

async function getUserEmail(accessToken: string | null): Promise<string> {
    try {
        const res = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return res.data.email;
    } catch (error: Error) {
        console.error("Failed to fetch Spotify user info:", error.response?.data || error.message);
        throw error;
    }
}


const access_token = localStorage.getItem('access_token');
const username = await getUserEmail(access_token);

const Heatmap = ({countries}: { countries: GeoJSONType }) => {

    const mapStyle = {
        fillColor: "#404040ff",
        weight: 1,
        color: "#898989",
        fillOpacity: 1
    };


    const onEachCountry = (country: { properties: { color: string; ADMIN: string; ISO_A3: string; }; }, layer: {
        options: { fillColor: string; };
        bindPopup: (arg0: string) => void;
    }) => {
        layer.options.fillColor = country.properties.color;
        const name = country.properties.ADMIN;
        const loadCountriesTask = new LoadCountriesTask();
        loadCountriesTask.getArtists(country.properties.ISO_A3, username).then(artists => {
            const artistList = artists.join("<br>");
            layer.bindPopup(`<b>${name}</b><br>${artistList}`);
        })
    };


    return (
        <MapContainer className="h-[calc(82vh)]" zoom={2} center={[30, 0]} minZoom={2}>
            <GeoJSON style={mapStyle} data={countries} onEachFeature={onEachCountry}/>
        </MapContainer>
    )
}

export default Heatmap