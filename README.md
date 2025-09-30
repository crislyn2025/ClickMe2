# TaskMate

Minimalist task management app built with React Native and Expo Router.  

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Features

- User authentication (signup, login, logout) using AsyncStorage
- Task management (create, read, update, delete)
- Persistent storage with AsyncStorage
- Pastel themed UI with centralized colors
- Demo access via **“Go to Tasks”** button on the homepage

## Project Layout
app/
├─ index.jsx # Homepage
├─ login.jsx # Login screen
├─ signup.jsx # Signup screen
├─ tasks/ # Task CRUD screens
│ ├─ index.jsx # List + delete + logout
│ ├─ create.jsx # Create new task
│ └─ [id].jsx # Edit/update task

