import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from "../controllers/categoryControllers.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

export const crouter = express.Router();

crouter.post("/createcategory", requireSignIn, createCategoryController);
crouter.put(
  "/updatecategory/:slug",
  requireSignIn,
  updateCategoryController
);
crouter.get("/getcategories", requireSignIn, getCategoryController);
crouter.get(
  "/getcategory/:slug",
 requireSignIn,
  getSingleCategoryController
);
crouter.delete(
  "/deletecategory/:slug",
requireSignIn,
  deleteCategoryController
);
