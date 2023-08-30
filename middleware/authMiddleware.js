import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'
export const requireSignIn = async (req, res, next) => {
  try {
    // console.log( req.headers.authorization)

    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    // console.log(token)
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "you are not register",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const id = req.user._id;
    const cUser = await userModel.findById(id);
    // console.log(cUser);
    if (cUser.role === false) {
    return  res.status(500).send({
        success: false,
        message: "sorry you are not admin",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error in middleware" });
  }
};
