# MBTA Tracking App  

**Team Members:** Ashley Fontaine, Yi Hong Jiang, Brendan Leu, Utku Yakar
**Group 17 Final Project**
[[URL HERE]]

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

To make the experience more dynamic, we are planning a **real-time animation** of the subway system that updates with MBTA data. Users will be able to visually track trains as they move along their routes on the map, instead of just reading arrival times. We’re considering using WebSockets or similar technology here so that updates feel immediate rather than just periodic refreshes. This should give the project a more interactive, live feel that goes beyond static pages. 

## Instructions
### Using the Application
Click the Log In button to log in with Github.

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

The frontend should be at http://localhost:5173 and the backend should be at http://localhost:8080

## Technologies  

This project uses **React with Vite** for the front-end application, utilizing **PassportJS** for authentication (GitHub SSO), **tailwind** for styles, and **shadcn** for UI components. The frontend and the API are being served using **ExpressJS** running on **NodeJS**. The backend API makes calls to the **MongoDB database** using **Mongoose**, as well as pulls live transit data from the **MBTA API**. Automatic build checks for pull requests was implemented using **GitHub actions**.

## Challenges

## Group Member Contributions
Ashley Fontaine:

Yi Hong Jiang:

Brendan Leu:
- Stop Search
- GitHub CI

Utku Yakar:
- Project Setup
- User Authentication
- Saved Stops
- Live Train Map w/ Websockets

## Accessability Features