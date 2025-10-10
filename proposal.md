# Group 14 Final Project - Proposal
**Group 14:**
Kaylie Quach, Christine Ngo, Gianni Rosato

## Bad Pizza, Sad Pizza
This project is a parody of the game "Good Pizza, Great Pizza". Users will be able to log in and play a simple pizza-making
game where each gameplay is within a limited time amount (we were thinking between 1-2 minutes each). 

### Gameplay
3 randomized orders populate the top of the screen at a time with varying prices/amount earned for completing the order, based on the
complexity of the order (ie. how many toppings, what kind of toppings). The goal is to complete as many orders as possible
within the time limit and maximize revenue. Ingredients that are not sauce or cheese are limited and users must use their 
earned revenue to purchase more throughout gameplay. The randomized orders have no time limit and does not have to be completed
in order.

We are also thinking about implementing a simple JS animation that "bakes" the pizza in a 5-second cooldown before the user
can sell the pizza to add a strategical-timing element to the game, though we don't know if that would be too much to implement
before the due date.

After gameplay, the player's login username (Github username), # of pizzas sold, and revenue count in dollars will be presented 
on a leaderboard page. This will be the persistent database storage.

### Technologies
**Frontend**: We will use React with Vite to build our front-end and JS for behavior handling and simple animations. We may
incorporate Web Audio API to play music during gameplay. Our CSS framework for now is TailwindCSS, but if time allows we might
explore NES.css to create a retro 8-bit styling for the game. 

**Backend**: Our server-side will be handled by Express.js and Node.js like previous assignments. Our persistent database
storage will be MongoDB. 

**Auth**: We will handle authentication using Github Auth0 via Passport.js.