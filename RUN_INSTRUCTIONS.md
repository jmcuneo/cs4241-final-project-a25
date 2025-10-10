# How to run the project
I configured this project to use pnpm as the package manager. The scripts should work for both npm and pnpm, but no promises. It's probably a good idea to just install pnpm and use it instead since it's wayyyy faster.

1. run `pnpm install` (or `npm install`) in the root directory
2. run `pnpm dev` (or `npm run dev`) in the root directory to start the development server
3. run `pnpm dev:server` (or `npm run dev:server`) in the root directory to start the backend server using nodemon. This will automatically restart the server if it detects a file change.

