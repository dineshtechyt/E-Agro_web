import express from "express";
import mongoose from "mongoose";
import {
  deleteUserController,
  getSingleUserController,
  getUserController,
  loginController,
  registrationController,
  updateUserController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

export const arouter = express.Router();
arouter.post("/register", registrationController);
arouter.post("/login", loginController);
arouter.put("/updateuser/:id", requireSignIn, updateUserController);
arouter.get("/getallusers", requireSignIn, getUserController);
arouter.get("/getuser/:id", requireSignIn, getSingleUserController);
arouter.delete("/deleteuser/:id", requireSignIn, isAdmin, deleteUserController);
