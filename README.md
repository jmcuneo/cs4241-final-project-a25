# Heatify
## Group 16: Dillon Bresnahan, Cameron Norris, Akaash Walker

### Brief Description
Heatify is a project where you can view where Spotify artists are from. Connect your Spotify account, and explore the world. Tell how many artists are from the country based off of its color. Click on countries and see which artists are from there.

Render deployed [here](https://heatifyapp.onrender.com/)
Video Demo found [here](https://www.youtube.com/watch?v=a6IjSg5uVKY) on YouTube


All the artist data is gotten from your Spotify account. Unfortunately, Spotify does not store where artists are from. To circumvent this, a query is sent to Google Gemini that will inform the program where all the artist are from. This is then stored in a MongoDB database. After storage, all the data, including artists and number of artists per country, is shown in a world map developed by [Leaflet](https://leafletjs.com/).

### Additional Instructions (READ FULLY!)
Users will need a Spotify account to use our program. We have created a dummy Google account for users to log into Spotify with. The login information is as follows:

`Email: heatifyapp@gmail.com`

`Password: WebWareA25!`

We recommend using a private/incognito window to log in with this account, as it may interfere with your personal Spotify account if you are already logged in. When logging in, make sure to use the "_Log in with Google_" option as this dummy account is a Google account. We had to do this because we can disable 2FA on Google accounts, unlike regular Spotify accounts.

**IMPORTANT NOTE:** The created dummy account is not currently added to the whitelist at the time of writing this README (10/10/25, ~8PM). Spotify only allows for a max of 5 new users to be added to the whitelist every day, which we have exceeded. I plan to add the dummy account to the whitelist on 10/11/25. Also, if you are a TA or professor who would like to add their personal account to the whitelist, feel free to reach out to me using my WPI email.

### Technologies Used
We  used Typescript for our main programming language, Node for the server React for our front-end, Tailwind for styling, Spotify API and Gemini API to get information, mongoDB to store data, Leaflet to create the heatmap, and Axios for server queries.

### Challenges Faced
1. A challenge we faced was getting the Google Gemini API to work. We had to make sure that the queries were formatted correctly and that Gemini did not stray from its task. 
2. Importing the data from mongoDB and allowing it to populate the heatmap. We would sometimes have issues where the map was fetching the data before it was fully imported, leading to errors.
3. Spotify API limitations: During development, Spotify limits the number of authorized users with a max of 25 whitelisted users. If we wanted to make this application available to anyone visiting the website, we would have to apply for Spotify's [extended quota mode](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), which requires us to be a registered company, 250K monthly active users, and more. This of course is way beyond the scope of our abilities, and hence why we created a dummy account for users to log in with. As mentioned before, if you are a TA or professor who would like to add their personal account to the whitelist, please contact us.

### Responsibilities
**Akaash** - Wrote API calls to Spotify and Gemini, worked on the front end with React, and helped with styling
**Cameron** - Created and managed the MongoDB database, worked on the front end with React, and helped with styling
**Dillon** - Created the heatmap with Leaflet, worked on the front end with React, and helped with styling

### Accessibility Features
We made sure the color design was clean so that people with sight issues could see properly. Along with this, there are no text entire necessary for easy use for everyone

