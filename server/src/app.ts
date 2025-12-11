import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import type { ApiError } from "./utils/ApiError.ts";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import userAuth from "./routes/userAuth.routes.ts";
import userDesignation from "./routes/userDesignation.routes.ts";
import userRouter from "./routes/user.route.ts";
import kpiRouter from "./routes/kpi.route.ts";

app.use("/api/user", userRouter);
app.use("/api/user/auth", userAuth);
app.use("/api/user/designation", userDesignation);
app.use("/api/kpis", kpiRouter);

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
