import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
