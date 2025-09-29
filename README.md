# Proposal for Group 11
---

Our project is going to be an application that allows users to play the game Snake through their browser. We will implement features such as logging in with Auth0, keeping high scores of different users, and allowing users to create and play on custom maps. The game will work by letting the user control a “snake” with the arrow keys, where the goal is to eat fruits that spawn around the map to make your snake grow as large as possible. The user will acquire points through surviving for longer periods of time and eating more fruits. 

There will be 4 tabs that can be visited by the user: The login page, a page that renders the game on their selected map, a map builder tab, and a community tab with all created maps. The pages that render the game and the community tab will be available to use without logging in, but the map builder will not be accessible to users who have not logged in. Maps will be made by making a layout in a JSON file, where different integer values correspond to different environment variables (0 for traversable ground, 1 for walls, etc). 

The stack will be developed using the tools shown in class, using MongoDB for the database, Express.js and Node.js for the server, and JavaScript for the server behavior. We will use the Canvas API to develop the animations required for the game, and the Web Audio API to add music and other sound effects to the game. We will also use Tailwind to add styling to our website. Finally, we will use Render to host our site. 

The primary users and stakeholders for this application will be gamers and game designers. The intended impact is to make a fun and engaging web application with community bonding features.  
