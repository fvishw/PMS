import { login, signUp } from "../controllers/userAuth.controller.ts";
import { Router } from "express";

const userAuth = Router();

// Example route handlers
// userAuth.get("/");

userAuth.post("/", signUp);

userAuth.post("/login", login);

// userAuth.get("/:id");

// userAuth.put("/:id");

// userAuth.delete("/:id");

export default userAuth;
