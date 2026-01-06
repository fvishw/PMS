import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import type { ApiError } from "./utils/ApiError.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

import userAuth from "./routes/userAuth.routes.ts";
import userRouter from "./routes/user.route.ts";
import performanceRouter from "./routes/performance.route.ts";
import CheckInsRouter from "./routes/checkIns.routes.ts";

app.use("/api/user", userRouter);
app.use("/api/user/auth", userAuth);
app.use("/api/performance", performanceRouter);
app.use("/api/check-ins", CheckInsRouter);

app.use(
  (
    error: ApiError | Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = (error as ApiError).statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ message });
  }
);

export default app;
