import { comparePassword, hashPassword } from "../authHelper/hashPassword.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registrationController = async (req, res) => {
  try {
    const { name, surname, email, password, role, answer } = req.body;

    if (!name || !surname || !email || !password || !answer) {
      return res.status(400).send({
        message: "enter full details",
        success: false,
        // error,
      });
    }

    const exisitingUser = await userModel.findOne({ email });
    // console.log(exisitingUser);
    if (exisitingUser) {
      return res.status(200).send({
        message: "already exist email",
        success: true,
      });
    }
    const hPassword = await hashPassword(password);

    const myData = new userModel({
      name,
      surname,
      email,
      password: hPassword,
      role,
      answer,
    });
    myData.save();
    res.status(200).send({
      success: true,
      message: "successfully register",
      // data: myData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something is went wrong in the registraion",
      success: false,
      error: error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validations
    if (!email || !password) {
      return res.status(200).send({
        success: true,
        message: "please enter valid details",
      });
    }
    const checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res.status(400).send({ message: "enter details again" });
    }
    const checkPassword = await comparePassword(password, checkEmail.password);
    if (!checkPassword) {
      return res.status(400).send({ message: "enter details again" });
    }
    const token = await jwt.sign(
      { _id: checkEmail._id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.status(200).send({
      message: "success to login done",
      success: true,
      user: checkEmail,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: true,
      message: "something is wrong in login",
      error: error,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { name, surname, password, answer } = req.body;
    const { id } = req.params;
    // console.log(id);
    const hPassword = password ? await hashPassword(password) : user.password;

    const myData = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        surname,
        password: hPassword,
        answer,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "update successfully",
      data: myData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something is went wrong in the update",
      success: false,
      error: error,
    });
  }
};
export const getUserController = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      success: true,
      message: "successfully get users",
      data: users,
    });
  } catch (error) {
    res.status(200).send({
      success: true,
      message: "something is wrong in getting user",
    });
  }
};

export const getSingleUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById({ _id: id });
    res.status(200).send({
      success: true,
      message: "successfully get",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in userGetting",
      success: false,
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    await userModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "delete successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "error in deleting",
    });
  }
};
