import express from "express";
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { CustomError } from "../utils/CustomError";
import routes from "../routes/index";
import path from "node:path";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", routes);

const clientPath = path.join(process.cwd(), "frontend/dist");
app.use(express.static(clientPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(err.statusCode).json({ error: { message: err.message } });
  next();
});

export default app;
