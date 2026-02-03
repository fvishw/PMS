import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import type { ApiError } from "./utils/ApiError.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

import userAuth from "./routes/userAuth.routes.js";
import userRouter from "./routes/user.route.js";
import performanceRouter from "./routes/performance.route.js";
import CheckInsRouter from "./routes/checkIns.routes.js";
import GoalRouter from "./routes/goal.router.js";
import cardsRouter from "./routes/cards.route.js";
import settingsRouter from "./routes/settings.route.js";
import reportRouter from "./routes/report.route.js";

app.use("/api/user", userRouter);
app.use("/api/user/auth", userAuth);
app.use("/api/performance", performanceRouter);
app.use("/api/check-ins", CheckInsRouter);
app.use("/api/goals", GoalRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/reports", reportRouter);

app.use(
  (
    error: ApiError | Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const statusCode = (error as ApiError).statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ message });
  },
);

export default app;
