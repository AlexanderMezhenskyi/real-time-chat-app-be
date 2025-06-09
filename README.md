# 📘 Backend Server (Express + Socket.IO + TypeScript)

A real-time WebSocket server for a multi-room chat app using JSON‑RPC over Socket.IO, built with Express and TypeScript.

---

## 💻 Frontend Repository

The frontend client (React, Vite, TailwindCSS, etc.) is available here:  
👉 [real-time-chat-app](https://github.com/AlexanderMezhenskyi/real-time-chat-app)

---

## 🚀 Features

- Real-time communication over WebSocket using JSON‑RPC protocol
- Support for multiple chat rooms with dynamic user switching
- Automatic user list updates on room join/leave events
- Room-based message broadcasting and typing isolation
- Robust request validation and error handling with JSON‑RPC

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Server**: Express 4
- **WebSocket**: Socket.IO 4
- **Language**: TypeScript
- **Dev Tools**: ts-node, nodemon

---

## 🔧 Getting Started

To run the backend server locally, follow these steps:

1. **Install Dependencies**  
   Run the following command in the root directory to install all libraries defined in `package.json`:

   ```bash
   yarn install
   ```

2. **Start Development Server**  
   Launch the development server with hot-reloading:

   ```bash
   yarn dev
   ```

   The backend will start on ([http://localhost:3000](http://localhost:3000)) by default.


3. **Build the Project**  
   Transpile TypeScript code into JavaScript::

   ```bash
   yarn build
   ```

   The build output will be located in the `dist` directory.


4. **Start Production Server**  
   Run the compiled server:

   ```bash
   yarn start
   ```

---

## 📜 Available Scripts

The `package.json` file includes several useful scripts. Run them using:

```bash
yarn <script_name>
```

| Script         | Description                                              |
|----------------|----------------------------------------------------------|
| `dev`          | Starts the server with live reloading via nodemon.       |
| `build`        | Compiles TypeScript to JavaScript into the `dist` folder |
| `start`        | Runs the compiled server from `dist/index.js`.           |
