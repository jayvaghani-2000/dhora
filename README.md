# Dhora

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js:** Version 18 or later. [Download Node.js](https://nodejs.org/)

- **pnpm:** Package manager for JavaScript/TypeScript projects. Install it globally using the following command:
  ```bash
  npm install -g yarn
  ```

## Setup

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone git@gitlab.zerosoftapps.com:dhora.app/dhora.app.git
   cd dhora.app
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

## Pre-commit Hook

To ensure code quality, a pre-commit hook is configured. This hook runs linting and formatting checks before each commit. Follow these steps to set up the pre-commit hook:

1. **Install Husky:**

   ```bash
   yarn prepare
   ```

2. **Verify and Format Code:**
   Before committing changes, Husky will automatically run linting and formatting. If any issues are detected, you need to address them before proceeding with the commit.

## Running the App

To run the application in development mode, use the following command:

```bash
yarn dev
```

The app will be available at http://localhost:3000.

## Drizzle ORM

To generate migrations

```bash
yarn migrate
```

To start Drizzle Studio

```bash
yarn studio
```

## To build Docker Image

```bash
yarn docker-build
```

To build app

```bash
yarn build
```

To run build app

```bash
yarn start
```
