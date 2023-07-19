import express from "express";
import formidable from "express-formidable";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
// import { Router } from "express";

export const prouter = express.Router();

prouter.post(
  "/createproduct",
  formidable(),
  requireSignIn,

  createProductController
);
prouter.put(
  "/updateproduct/:id",
  formidable(),
  requireSignIn,
  isAdmin,
  updateProductController
);
prouter.get("/getallproducts", getAllProductController);
prouter.get(
  "/getsingleproduct/:slug",
  requireSignIn,
  getSingleProductController
);
prouter.delete(
  "/deleteproduct/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);
prouter.get("/product-photo/:pid", productPhotoController);

prouter.get("/product-category/:slug", productCategoryController);
prouter.post("/productfilter", productFilterController);
prouter.get("/braintree/token", braintreeTokenController);
prouter.post("/braintree/payment", requireSignIn, braintreePaymentController);
// prouter.post("//brain")
prouter.get("/getproductcount", productCountController);
prouter.get("/product-list/:page", productListController);
