import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(200).json({
      message: "OK",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("entered here");
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "User already exists!" });
    }

    console.log("name , email, pass", name);

    const hashedPasword = await hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPasword,
    });
    await user.save();

    res.clearCookie(COOKIE_NAME,{
        httpOnly: true,
        domain:"localhost",
        signed:true,
        path:'/'
    })

    //token creation
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires= new Date();
    expires.setDate(expires.getDate()+7)
    //setting cookie
    res.cookie(COOKIE_NAME, token,{
        path:'/',
        domain:"localhost",
        expires,
        httpOnly:true,
        signed:true
    });


    return res.status(201).json({
      message: "Ok",
      id: user._id.toString(),
    });
  } catch (error) {
    console.log("Error");
    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("entered here");
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }

    res.clearCookie(COOKIE_NAME,{
        httpOnly: true,
        domain:"localhost",
        signed:true,
        path:'/'
    })

    //token creation
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires= new Date();
    expires.setDate(expires.getDate()+7)
    //setting cookie
    res.cookie(COOKIE_NAME, token,{
        path:'/',
        domain:"localhost",
        expires,
        httpOnly:true,
        signed:true
    });

    return res.status(200).json({
      message: "Ok",
      id: user._id.toString(),
    });
  } catch (error) {
    console.log("Error");
    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};
