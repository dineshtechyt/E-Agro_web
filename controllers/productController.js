import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
dotenv.config();
///payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, category, price, quantity } = req.fields;
    console.log(name, description, category, price, quantity)

    const { photo } = req.files;

    const productData = await new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      productData.photo.data = fs.readFileSync(photo.path);
      productData.photo.contentType = photo.type;
    }
    await productData.save();
    res.status(200).send({
      success: true,
      message: "successfully save",
      data: productData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in create product",
      success: false,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, discription, category, price, qauntity } = req.fields;
    const { photo } = req.files;

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
      },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    res.status(200).send({
      success: true,
      message: "successfully updated",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "something is wrong in updating",
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "successfully get data",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "something went wrong in getting product",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "successfull",
      data: product,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "error in geting" });
  }
};
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "delete successfull",
      // data: product,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "error in geting" });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    // console.log(products)

    res.status(200).send({
      success: true,
      message: "successfull get",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "something is wrong",
    });
  }
};

export const productFilterController = async (req, res) => {
  try {
    const arg = {};
    const { checked, radio } = req.body;
    // console.log("hello="+radio)
    if (checked.length > 0) arg.category = checked;
    if (radio.length) arg.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(arg);
    res.status(200).send({
      message: "success",
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(404).send({
      message: "error",
      success: false,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send({ error });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const productCountController = async (req, res) => {
  try {
    const products = await productModel.find({}).countDocuments();
    res.status(200).send({
      success: true,
      message: "get",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "dont get anything",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params.page;
    // console.log(page);
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    // console.log(products);
    res.status(200).send({
      message: "success",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "success",
      success: false,
    });
  }
};
