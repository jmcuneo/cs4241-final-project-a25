## CS4241 Final Project Proposal - Group 6

### Names:
- Owen Hart
- Jack Richard
- Olivia Olsen
- Ethan Knorring
- Rohit Tallapragada

### Proposal
Our project idea is to create a wordle-like game, but instead of five-letter words we’ll use eight-letter 
ones. The user has more guesses to account for the increased difficulty of a higher word length. We will 
implement an account system to keep sessions separate between users and store each player’s 
guesses/successes. We’ll include GitHub Oauth if we have time, otherwise the accounts will just be local 
in a mongodb database.

We’ll be implementing a few key technologies to achieve this. First, we’ll be using Express to set up 
our server. Additionally, we’ll be using mongoDB to store high scores, user guesses, and potentially 
account info depending on which way we decide to go with that. We’ll likely use passport.js to implement 
the account system. As for the graphic interface for the game itself, we’ll likely use canvas.js and Svelte.

### Key Technologies/Libraries:
- Express
- mongoDB
- passport.js
- canvas.js
- Svelte
