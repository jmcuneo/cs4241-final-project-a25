The README for your second pull request doesn’t need to be a formal report, but it should contain the following:
Website: https://cs4241-final-project-a25-6ld5.onrender.com/

1.

For this project we made a playable online game of war. It allows you to login using github authentication, allows you to choose the card style you would like to use, and allows you to play against a random opponent using a queuing system. You can also read the instructions for the game of war. 

Website: https://cs4241-final-project-a25-6ld5.onrender.com/

2. Any additional instructions that might be needed to fully use your project (login information, etc.)

You will need a github account to log in, but you are also able to play without logging in, as a guest. You will need to open the website on two pages, in order to find a match (unless someone else is already in queue - unlikely.)

3. An outline of the technologies you used and how you used them.

We used next-auth for github authentication, and ws websockets to connect users. We also used Node for our websocket server, and next.js to make our app.
For css, we used tailwind, which allowed us to do styling in component headers, and typescript instead of javascript. We deployed on render, with our server running on wss/... and our normal website on a normal browser protocol.

4. What challenges you faced in completing the project.

We struggled to meet together as a team and collaborate effectively. It was also difficult to get in touch with each other to communicate.
Additionally, there were great challenges in getting websockets to work with nextauth authentication - the websockets wanted to go through an /api route, but due to how authentication was set up, the websocket kept getting an authentication response rather than a websocket init response. This was very hard to figure out and realize what was going on.


5. What each group member was responsible for designing / developing.

Alexander: Deployment, Websockets server communication, Login and authentication, frontend design, debugging

Conor: Front end design, playing card components

Rohan: 

Han:

Marie: Front end desgn. round behavior, video recording.


6. What accessibility features you included in your project.

The cards are easy to read and distinguish. Colors are easy to distinguish with high contrast.
