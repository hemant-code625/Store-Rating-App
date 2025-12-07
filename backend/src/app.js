import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [...JSON.parse(process.env.ALLOWED_ORIGIN)],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// importing routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth", authRouter);

export default app;
