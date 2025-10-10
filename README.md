# # MBTA Tracking App  

**Team Members:** Ashley Fontaine, Yi Hong Jiang, Brendan Leu, Utku Yakar  
**Group 17 Final Project**  

### Installation and usage
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

# --- Client ---
VITE_API_BASE=http://localhost:8080
```

### Technologies  

This project uses **React with Vite** for the front-end application, utilizing **PassportJS** for authentication (including GitHub SSO) and **tailwind** for UI components. Serving the frontend and the API will be **ExpressJS** running with **NodeJS**. The backend API will make calls to the **MongoDB database** using **Mongoose**, as well as pulling live transit data from the **MBTA API**.  