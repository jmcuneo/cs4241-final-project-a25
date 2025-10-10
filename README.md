# Studi
Deployment: https://studi-u46a.onrender.com 
Demo: https://youtu.be/nFq_eLr4a38 

## Team Members (Group 5):
- Amanda Chavarria Pleitez
- Arianna Xie
- Brandon Yeu
- Charles Anton Sibal

## Project Description:
Studi is a study buddy matching app that matches students looking for a study buddy based on classes, subjects, schedules, study habits, and other preferences. When users create an account, they record some static info (contact info, personal info, etc.). When they “look for a study buddy,” they can fill out a form that records their course info, schedule, and study preferences. In the backend, there is logic that vectorizes the user's form information to find weighted euclidean distance to determine best fits for the user to partner with. The application then shows the top 6 best matches, their contact information, and their form selections for the student. Some information used for the preference form are listed below:

### Basic Info:
- Name
- Email
- Major / year
- Language

### Study Habits / Preferences:
#### Personality:
- Personality: extroverted/introverted/flexible

#### Study Goals
- Course Priority: just want to pass the class / get highest grades
- Assignment Type: Exam / Project / Homework

#### Study Environment
- Communication style: likes to yap / strictly locks in on academics / either is fine
- Noise level: silent/background music/chatter okay(talking)
- Preferred location: online(zoom/discord) / on campus

#### Study Rhythm
- Preferred study time: Morning / afternoon / night
- Study pace: fast (cover lost quickly) / steady / slow & detailed
- Break style: short frequent breaks / long breaks / few breaks

## Key Technologies:
- React: For the front-end state management and routing of the application
- MongoDB Atlas: For data persistence between users and sessions
- Next.js: For server-side rendering of the application
- MaterialUI: We used MaterialUI for components in the preference form (like the progress stepper, cards for the option cards, select for the course dropdown, and buttons). We also used it to make/style the match card component and home page.
- JavaScript
- NextAuth: For user signup/login and session authentication
- bcryptjs: For hashing passwords
- Render: For deployment

## Challenges
- Getting the users' forms and corresponding matches from the MongoDB and feeding it to our home page
- Building an algorithm to find the top six most suitable matches
- Figuring out how to build the MultiStepForm using MUI components
- Figuring out how to structure and query the database so that it has all the necessary information we need for the match cards
- How to structure the matchbatch collection in the database to easily get the info needed for the match cards / homepage
- Encountered a small issue with logging in due to database confusions
- Authentication methods caused errors in


## Group Member Responsibilities
### Amanda Chavarria Pleitez
I designed and developed the front-end for the login, signup, and homepage of the application.
I implemented the mapFormToVector function, which prepares user form data for use in the Euclidean distance algorithm for matching study buddies.
Additionally, I contributed to writing the README and conducted accessibility testing using Google Lighthouse, 
providing an analysis of the results and recommendations for improvements.

### Arianna Xie
I created the initial Figma design idea for the application and developed the front-end of the preference form. 
I also developed the front-end of the match cards and created the back-end GET route for the form and
updated the home page to render the forms (sorted by course) the user created on the home page.
I also updated the back-end API and home page to render the match cards of the best matches when a form is selected. 
Additionally, using the lighthouse accessibility score, I improved the accessibility of our project by making changes, 
like adding aria labels to links, to maximize the accessibility scores. I contributed to writing the project description, 
key technologies, and challenges in the README.

### Brandon Yeu
I contributed to the Figma design, layout, and user flow of our application. 
I set up the project with our initial specifications. I implemented authentication using NextAuth,
which handles user and account information both client-side and server-side.
This user information is used throughout the app, to make sure that users are on 
correct pages that they have access to and is key to the functionality of the app.
I connected the form, login, signup, and profile pages to the backend by writing API calls for all of them. 
I created initial login and signup pages for testing which were developed into our final pages.
I created the profile page to allow our development team to see if user information was being passed to and from the database correctly.
I handled merge conflicts to output our final product, and handled deployment.
I contributed to the project description, key technologies, and challenges in the README.

### Charles Anton Sibal
I contributed to the Figma ideation for the application. I set up the structure of the project, such as the directory structure, database, and environment/dependency setup.
I implemented data persistence through the use of MongoDB Atlas. I implemented form API post route, which handles the form data and updates the database.
I implemented the form matching algorithm in the matches post route, which uses Euclidean distance to find the best matches.
I implemented the get match get route, which queries the database for the user's form data and returns the best matches.
I contributed to the project description, key technologies, and challenges in the README.


### Accessibility Features

Google Lighthouse Accessibility Scores Per Page
- Signup: 98 
- Login: 98
- Dashboard: 100
- Preference Form: 100
- Profile: 100

Accessibility features:
- Color Contrast: All text and UI elements meet sufficient contrast ratios for readability.
- Touchable Areas: Buttons and interactive elements are large enough for easy tapping.
- Clear Language: Text is written simply and clearly, avoiding jargon or confusing phrasing.
- Consistent Layout: Predictable and consistent layout helps users orient themselves.
- Feedback: Clear and descriptive error/success messages guide users when input is incorrect/correct. Adding loading signs to keep users informed on page state.
- Accessible Forms: Forms have labels, clear instructions, and proper focus order.

