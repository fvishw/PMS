import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import userAuth from "./routes/userAuth.routes.ts";
import userDesignation from "./routes/userDesignation.routes.ts";
import type { ApiError } from "./utils/ApiError.ts";

app.use("/api/user/auth", userAuth);
app.use("/api/user/designation", userDesignation);

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
