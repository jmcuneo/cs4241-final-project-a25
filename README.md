# README
**Group 14:**
Kaylie Quach, Christine Ngo, Gianni Rosato

## Bad Pizza, Sad Pizza

Deployment: https://badpizza-sadpizza.onrender.com

(Recommended 75% zoomed out for best experience.)

This project is a parody of the game "Good Pizza, Great Pizza". Players log into the game using their GitHub profile and are redirected to an instructions page. The player can proceed to gameplay. On the gameplay screen, there are several components: 3 randomized orders at the top, a timer, a pizza-making board, an oven, and a "marketplace" where players can add toppings to their pizza as well as buy more special ingredients (any ingredient that isn't sauce or cheese). Players make a pizza by adding toppings that correspond to a generated order, baking it, then selling it. The goal of the game is to sell as many pizzas as you can in order to accrue the most revenue within a 2-minute time limit. Because buying more special toppings using in-game revenue allow the player to sell pizzas for a high price (more toppings = higher selling price), there is an aspect of strategy in the game.

Upon the timer running out, the player can see how many pizzas they sold and how much revenue they made, as well as accessing the leaderboard where each gameplay record has a GitHub username, # of pizzas sold, and revenue earned. The leaderboard is ranked by highest to lowest revenue.

## Technologies:

**Vite React**: Our frontend is entirely built using Vite and React with Javascript, allowing seamless switching between multiple pages as well as efficient handling of the many functionalities in our game.
**NES.css**: We used NES.css as our CSS framework for this application, creating a retro 8-bit vibe that we wanted for our pizza game. This matched well with the custom-made 8-bit sprites and pizza layers we made for the game.
**Express.js**: Our backend server is compiled using Express/Node.js. Our backend took care of middleware for our authentication and database APIs and routes to the connect the database to the leaderboard.
**MongoDB (Atlas)**: We stored data using Mongo Atlas. This stored the GitHub account associated with gameplay, number of pizzas sold, revenue earned, and other data associated with 1 gameplay so it can be displayed on the leaderboard.
**Passport.js**: We used Passport's GitHub strategy in order to allow users to log in using their GitHub account. 

## Challenges

We experienced a few challenges while trying to implement novel features for our application, especially things we haven't necessarily covered in class before. One of the biggest challenges was figuring out how to use useEffect and setInterval/clearInterval to implement the 2-minute timer feature, while also having that not break the oven progress bar, because they were using the same handlers. Configuring the custom Popup messages also took some time to make sure it didn't interrupt gameplay but could also handle user spamming. Figuring out how to reset all data (revenue, ingredient count, pizza, etc.) after a game session was also tricky. Overall, many of the challenges came from checking for edge cases and bugs in the application and making sure there's a quick solution or Popup for each case. 

On backend, we had a little bit of trouble connecting the database to our project; it was quickly resolved after realizing one of our members was running Mongo locally instead of on Atlas.

## Group Member Contributions

**Kaylie Quach**:
- Timer implementation, styling
- Random order generation, styling
- Ingredient purchase implementation, revenue depletion on handleBuy
- Layering toppings onto pizza
- Custom Popup alerts
- handleTimeUp implementation

**Christine Ngo**:
- Pixel art of sprites, pizza layers, and oven
- Session storage for ingredient amount during gameplay and game reset
- Bake/sell button functionality
- Trash button implementation
- Instructions page
- Baking functionality, animation, and progress bar
- Main styling for application

**Gianni Rosato**
- Express backend
- Authentication via passport.js GitHub strategy
- MongoDB database configuration
- Leaderboard page
