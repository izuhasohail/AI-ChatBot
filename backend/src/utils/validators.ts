import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";


export const validate= (validations:ValidationChain[])=>{
    return async (req:Request, res:Response,next:NextFunction)=>{
        for (let validation of validations){
            const result= await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }

        const errors= validationResult(req)
        if(errors.isEmpty()){
            return next();
        }
           // unprocessable entity
        return res.status(422).json({
         error:errors.array()
        })
    }
}


export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password should contain atleast 6 characters")
      .matches(/[A-Z]/)
      .withMessage("Password should contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password should contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password should contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password should contain at least one special character"),
  ];
  


export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator
];
