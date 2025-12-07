import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
  })
);

app.use(express.json());
app.use(cookieParser());

// importing routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth", authRouter);

export default app;
