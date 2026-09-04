import dotenv from "dotenv";
import "dotenv/config";

// Load environment variables before the rest of the backend starts.
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

// Start the Express server once all of the application setup has loaded.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// server.ts is the entry point for the backend.
// Most of the application setup lives in app.ts, including middleware,
// routes, rate limiting and other Express configuration.
//
// The general backend flow is:
//
// Client request
//      ↓
// Express app
//      ↓
// Routes
//      ↓
// Controllers / services
//      ↓
// Database or external services such as OpenAI
// Developed by Shane Hahesy