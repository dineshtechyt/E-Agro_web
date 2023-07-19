import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const name = req.body.name;
    const myData = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(200).send({
      success: true,
      message: "successfully category created",
      // data: myData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in category creation",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = req.params.slug;
    const uData = await categoryModel.findOneAndUpdate(
      { slug: slug },
      {
        name: name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "success",
      uData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "failed to update",
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).send({
      success: true,
      message: "success get",
      data: categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in geting data",
    });
  }
};
export const getSingleCategoryController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await categoryModel.findOne({slug:slug});
    res.status(200).send({
      success: true,
      message: "success get",
      data: category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in geting data",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const categories = await categoryModel.findOneAndDelete({slug:slug});
    res.status(200).send({
      success: true,
      message: "success to delete",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in geting data",
    });
  }
};
