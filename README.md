# SportsBet - NBA Simulated Sports Betting Web App

SportsBet is a full stack web app that simulates sports betting using virtual currency. Users can register for accounts, 
receive starting balances of virtual coins, and place bets on real NBA games with live odds from FanDuel. 
The platform includes user authentication, real time balance tracking, betting history, and a competitive leaderboard system.

The application uses modern web development with a React frontend, Node.js/Express backend, and MongoDB database. 
It is a realistic sports betting experience without losing real money, making it perfect for learning 
betting strategies and having fun in a safe environment.

## Setup and Usage

To run this project locally, follow these steps:

1. Clone the repository and navigate to the project directory
2. Backend Setup:
    - Run `cd backend`
    - Run `npm install`
    - Create a `.env` file with MongoDB connection string and JWT secret
    - Run `npm start` to start the backend server on port 5000

3. Frontend Setup:
    - Run `cd frontend`
    - Run `npm install`
    - Run `npm start` to start the React development server on port 3000

4. Access the application at `http://localhost:3000`
5. Register a new account to receive 1000 virtual coins
6. Start placing bets on NBA games with real odds data

## Technologies Used

**Frontend:** React with functional components (including a useContext hook) and hooks for state management, 
React Router for navigation, Tailwind CSS for responsive styling, Axios for API communication

**Backend:** Node.js with Express.js framework, JWT for authentication, bcrypt for password hashing, Mongoose 
for MongoDB object modeling, CORS for cross-origin requests

**Database:** MongoDB for storing user accounts, bets, and balances with proper data relationships and indexing

**External APIs:** Integrated with The Odds API to fetch real time sports betting odds from FanDuel 

## Technical Challenges

One major challenge was integrating with third party sports betting APIs, which required data transformation 
to normalize odds from multiple bookmakers into a consistent format for the frontend. The authentication system with JWT 
tokens and protected routes needed state management across React components, which was super tricky.

The leaderboard was also challenging, since it needed to work efficiently with our database.

Our group had some difficulties with Github as well.

## Team Responsibilities

**Joe** - Betting page backend work, login with dcrypt functionality, Login styling

**Mike** - Leaderboard page styling and backend work, About page styling and backend work

**Riley** - Dashboard styling and backend work, betting page styling, Navbar backend work and styling

## Accessibility Features

The application includes comprehensive accessibility features following WCAG guidelines. 
All interactive elements are keyboard navigable with proper focus indicators. Form inputs include 
associated labels, and error messages are announced to screen readers. Color contrast ratios meet AA standards, 
and the interface is fully responsive across mobile and desktop devices. Semantic HTML structure ensures proper screen 
reader interpretation too.