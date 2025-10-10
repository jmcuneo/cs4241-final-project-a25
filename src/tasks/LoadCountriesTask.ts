import countries  from "../const/countries.json"
import legendItems from "./LegendItems";
import axios from "axios";

class LoadCountriesTask{

    dataurl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/refs/heads/web-data/data/cases_country.csv"

    setState = null;
    features = countries.features as any[];


    load = (setState): boolean=>{
        this.setState = setState;
        this.#processData();
        return false;
    }

    #processData = () => {

        const access_token = localStorage.getItem('access_token');
        getUserEmail(access_token).then(username => {



       axios.post('/api/get', { userId: username })
    .then(response => {
        const countryCount: Record<string, number> = {}
        for (const data of response.data){
            if(data.country != "NO_COUNTRY"){
            if (!countryCount[data.country])
                countryCount[data.country] = 1
            else
                countryCount[data.country]++
        }
        }
        for (let i = 0; i < this.features.length; i++)
            this.#setCountryColor(this.features[i], 0) 
        for (const [iso, count] of Object.entries(countryCount)) {
            const dataCountry = this.features.find(
            feature => feature.properties.ISO_A3 === iso);
            this.#setCountryColor(dataCountry, count) 
    }
        this.setState(this.features);
    })
        .catch(error => console.error(error));
}
        )}

    #setCountryColor = (country: { properties: { color: string; }; }, count: number) =>{
        const legendItem = legendItems.find((item)=> item.isFor(count))

        if(legendItem != null) {
            country.properties.color = legendItem.color;
        }
    }

   formatNumberWithCommas = function (number: number)  {
   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 };


getArtists(ISO_A3: any, username: string): Promise<string[]> {
    return axios.post('/api/get', { userId: username })
      .then(response => {
        const artists: string[] = [];
        for (const data of response.data) {
          if (data.country === ISO_A3) {
            artists.push(data.name);
          }
        }
        return artists; // return inside the promise
      });
}

}


async function getUserEmail(accessToken: string | null): Promise<string> {
  try {
    const res = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return res.data.email;

  } catch (error: any) {
    console.error("Failed to fetch Spotify user info:", error.response?.data || error.message);
    throw error;
  }
}


export default LoadCountriesTask;