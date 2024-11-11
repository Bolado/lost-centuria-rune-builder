import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";
import session from "express-session";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR =
  process.env.STATIC_DIR || join(__dirname, "../frontend/build");

// Add validation for required env variables
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be defined in environment variables");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be defined in environment variables");
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Static files
app.use(express.static(STATIC_DIR));

// MongoDB connection
async function connectDB() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  return client.db("lostcenturia");
}

// Initialize routes
connectDB()
  .then(async (db) => {
    const { default: authRoutes } = await import("./routes/auth.js");
    const { default: buildRoutes } = await import("./routes/build.js");

    app.use("/api", authRoutes);
    app.use("/api/build", buildRoutes(db));

    // Fallback route for React
    app.get("*", (req, res) => {
      res.sendFile(join(STATIC_DIR, "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);
