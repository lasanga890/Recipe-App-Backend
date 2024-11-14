import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { hashPassword } from "../middlewares/authMiddleware.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        password: user.password,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, conformPassword } =
      req.body;

    if (!firstName) {
      return res.send({ message: "First name is Required" });
    }
    if (!lastName) {
      return res.send({ message: "Last name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!conformPassword) {
      return res.send({ message: "Conform Password is Required" });
    }

    const exisitingUser = await userModel.findOne({ email });

    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};
