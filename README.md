# MBTA Tracking App  

**Team Members:** Ashley Fontaine, Yi Hong Jiang, Brendan Leu, Utku Yakar

**Group 17 Final Project**

https://gr17-finalproject.brleu.com/

```
The README for your second pull request doesn’t need to be a formal report, but it should contain the following:

    A brief description of what you created, and a link to the project itself (two paragraphs of text)
    Any additional instructions that might be needed to fully use your project (login information, etc.)
    An outline of the technologies you used and how you used them.
    What challenges you faced in completing the project.
    What each group member was responsible for designing / developing.
    What accessibility features you included in your project.
```
## Project Description
This app is a utility for folks who live within the Boston subway. With this app, users can see **live arrival times** for various stops in the area, save the stops that they frequently use, see a map of the subway system with indicators of various trains in the system, see line availability alerts, and access other useful information regarding their travel in Boston.  

Logged in users may set favorite stops for themselves, allowing them to see departure times of trains and busses that visit that stop. These times update regularly, giving the user active information about how long until the next transit. To make the experience more dynamic, we are have included a **real-time animation** of the subway system that updates with MBTA data. Users will be able to visually track trains as they move along their routes on the map, instead of just reading arrival times. We’ve used WebSockets so that updates feel immediate rather than just periodic refreshes.

## Instructions
### Using the Application
The landing page shows a map of all stations and displays the local train routes in Boston, while colored dots along those lines indicate the locations of various trains. You may click the Log In button to log in with Github. Once logged in, you can go to the Dashboard menu, located at the top of the page. Here, you can search for station IDs or names to save the station as one of your favorites. When done, the dashboard page will include how long until various bus lines and train lines arrive at that stop. The Settings page is also tied to you account. Here you can select a theme and choose to delete your data.

### Dev Installation and Usage
If pnpm is not installed, install it with npm:
```shell
npm install -g pnpm@9.11.0
```

Then edit the permissions of the install & run script
```shell
chmod +x ./scripts/dev-all.sh
```

Then run the install & run script
```shell
./scripts/dev-all.sh
```

#### Adding shadcn components
```shell
npx shadcn@latest add -c client <component>
```

#### Example `.env` file
```shell
# --- Server ---
NODE_ENV=development
PORT=8080
SESSION_SECRET=replace-me
MONGODB_URI=mongodb://localhost:27017/mbta_live
GITHUB_CLIENT_ID=your-app-id
GITHUB_CLIENT_SECRET=your-app-secret
GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback
MBTA_API_KEY=your-mbta-key
```
```shell
# --- Client ---
VITE_API_BASE=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

## Technologies  

This project uses **React with Vite** for the front-end application, utilizing **PassportJS** for authentication (GitHub SSO), **tailwind** for styles, and **shadcn** for UI components. The frontend and the API are being served using **ExpressJS** running on **NodeJS**. The backend API makes calls to the **MongoDB database** using **Mongoose**, as well as pulls live transit data from the **MBTA API**. Automatic build checks for pull requests was implemented using **GitHub actions**.

## Challenges

There was some difficulty understanding the way the MBTA API encoded the shape data of the various routes. It took a bit to decode and and differentiate routes before they could be placed on map. Related, it took a little bit to figure out how to apply the coordinate data of elements to the map application. The map application was also having issues in some of our builds where it would only show fragments of the map and not display the coordinate data on top of that. While we've used it in past assignments, implementation of OAuth on a central server that we could all connect to was a challenge, where in several of us would get 404 errors when trying to login Github accounts and others would get through just fine. We unfortunately also ran into some lag with the dashboarded stops for each user, wherein the times until next arrival do not update repeatedly on their own, due to how the data is stored in the API. We've combatted this by including an update button on that page.

## Group Member Contributions
Ashley Fontaine:
- Dark Mode
- README Review

Yi Hong Jiang:
- Subway Line Indicators
- Stop Indicators

Brendan Leu:
- Added shadcn & upgraded tailwind
- Stop Search
- Saved Stop Countdown
- GitHub CI
- Deployed with Docker

Utku Yakar:
- Project Setup
- User Authentication
- Saved Stops
- Live Train Map w/ Websockets

## Accessibility Features

Certain elements of some forms have been given a class of focus-visible, making them easy to access by use of the keyboard rather than using a mouse pointer. Important issues or deletion buttons and links have been color coordinated, making them stand out from the rest of the page, increasing their visibility and understanding of what they may do. The alerts available on the landing page have been designated as "aria-live", indicating to screen readers that they can be actively updated and are important alert information, that may need to be read before the rest of the page is finished. The map on the middle of the landing page has been designated as an application and has been described with a label, helpful for screen readers.
