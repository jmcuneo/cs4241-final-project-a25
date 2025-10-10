# Octurdle - Final Project

- Team Members: Jack, Olivia, Owen, Rohit, Ethan

- GitHub Repository: https://github.com/o-wel/cs4241-final-project-group-6

- Deployed Application: https://octurdle.onrender.com

- Project Description

We created Octurdle, a wordle like game using eight-letter words instead of five. Players have 5 guesses to figure out the daily word. The game includes an account system for authentication purposes.

The backend uses a seeded random number generator based on the current date to ensure all players get the same word each day. When a user makes a guess, the server returns feedback for correct position (green), wrong position (yellow), and not in word (gray).

## How to Use

To play Octurdle, create a new account by entering a username and password in the registration form. Once logged in, you can start guessing the daily word. Type letters using your keyboard or click the on screen keyboard buttons. Press Enter to submit your guess and Backspace to delete letters.

Your game statistics and settings are automatically saved and will persist across sessions. You can only play once per day and the word resets at midnight. Use the accessibility settings button in the top right corner to customize the visual appearance and controls to your preferences.

## Technologies Used

- Express: Server framework for handling API endpoints
- MongoDB: Database for storing user accounts and game statistics  
- Svelte: Frontend framework for the game interface
- JWT: Token-based authentication for user sessions
- bcryptjs: Password hashing
- Vite: Build tool and dev server
- seedrandom: Deterministic random number generation for daily words

## Challenges

Getting the user data persistence working correctly was challenging, particularly the streak calculation logic. We needed to accurately determine if a user had broken their streak by calculating days between plays and handling date comparisons properly.

Making the keyboard input work properly required preventing key events from being captured when users were typing in login and register fields. We had to check if an input element was focused before processing game keyboard shortcuts.

We also had a persisent bug where the feedback previous color of the previous guess would change when a new guess was made

## Team Responsibilities

- Jack: Frontend game board, guess input system, keyboard interface
- Olivia: Backend word selection, daily word seeding using seedrandom, guess validation endpoint
- Owen: User authentication system, storing user data, account endpoints
- Rohit: Login/register component, auth UI, JWT implementation
- Ethan: Accessibility features including theme switching, colorblind modes, keyboard navigation, ARIA labels, and screen reader support

## Accessibility Features

- Multiple themes: Dark, light, and high-contrast modes
- Colorblind modes: Protanopia, deuteranopia, and tritanopia support with alternative colors
- Font size options: Small, medium, large, and extra large
- Spacing controls: Narrow, normal, and wide spacing
- Full keyboard navigation: All game functions accessible without mouse
- Screen reader support: ARIA labels, semantic HTML
- Visual indicators: Symbols supplement colors in colorblind modes
- Local storage settings: All accessibility preferences saved to local Storage

All settings are accessible through a floating button in the top right corner.
