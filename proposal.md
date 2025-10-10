# Group 16 Final Project Proposal - Heatify

### Summary

Our project will be a website that shows a heatmap of the countries where users’ recently listened to artists come from. The map would be intereactive, allowing users to click on a country to see a more detailed view of the artists that come from there.

### Technologies
- MongoDB - for user data storage
- React - for frontend component development
- Express - to manage routes and endpoints
- Node.js - for client-server communication
#### Additional technologies
- Tailwind CSS along with a component library (undecided) for simple and quick UI development
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) for getting a user's recently listened to data
- Auth0 for securely retrieving user data from Spotify
- [Leaflet](https://leafletjs.com/) for an interactive and dynamic heatmap

### Program flow

First, users will connect their Spotify account to our application. This will create a new document in our database which will be used to store and retrieve user information. Next, our application will use the Spotify Web API to return a list of the users' most recently listened to songs. We can map over this list to generate a list of the artists, removing any duplicates if needed. We can then perform a search to find the origin of each artist. MongoDB would have a unique document for each user, and each document would contain a list of objects that have both an artist and their place of origin. Using this list, along with Leaflet, we would then generate a heatmap of artists' locations. Clicking on a country would show which artists are from that country. 

### Why use MongoDB at all?

This is a great question that fixes a shortcoming of the Spotify Web API. Spotify's API only allows us to record the last 50 listened to songs, meaning our heatmap would have a limit of 50 datapoints at any given time. By making an API call and storing the information in MongoDB, it allows us to continually gather information from the user over time.
