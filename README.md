# CS 4485 - Computer Science Project (Harmonic Links)

This repository contains our team's code for CS 4485, our Capstone project.

## Overview

This project is a web application that allows users to find links between different artists and albums through their collaborations. It was built as a discovery tool for music lovers, allowing them to explore the connections between their favorite artists and albums.

You can try it out [here](https://harmonic-link.vercel.app/).

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js, TypeScript, Express
- **Deployment**: Vercel, Supabase

## Repository Setup (VSCode)

1. `Ctrl+Shift+P` ➜ `Git: Clone` ➜ `adibarra/harmonic-link`
2. Run `pnpm install` in the terminal to install dependencies.
3. Thats it!

[Note: We use `pnpm` as our package manager. Make sure you have it installed. If not, you can install it by running `npm install -g pnpm`.]

## Run Project

Make sure you are in the repo's root directory before running these commands.

```bash
  # # # # # # # # # # # # # # # # # # # # # # # #
  # Start the development environment           #
  # Access the app here: http://localhost:3333  #
  # # # # # # # # # # # # # # # # # # # # # # # #
  $ pnpm dev

  # --- OR ---

  # # # # # # # # # # # # # # # # # # # # # # # #
  # Build and run for production (preview mode) #
  # Access the app here: http://localhost:3000  #
  # # # # # # # # # # # # # # # # # # # # # # # #
  $ pnpm build && pnpm start
```

## Project Scripts

| Scripts        | Description                                        |
| -------------- | -------------------------------------------------- |
| pnpm install   | installs dependencies for entire project           |
| pnpm dev       | runs development environment                       |
| pnpm clean     | removes build artifacts and dependencies           |
| pnpm build     | builds the app for production                      |
| pnpm start     | runs the full built app                            |

## License

All rights reserved.
