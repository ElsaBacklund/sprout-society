import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "API körs" });
});

app.use("/api", routes);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servern körs på http://localhost:${PORT}`);
  });
}

start();