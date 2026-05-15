import { Request, Response } from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"

import prisma from "../config/prisma";

import { registerSchema, loginSchema } from "../validators/auth.validators";

import { generateAccessToken,  generateRefreshToken, } from "../utils/generateToken";


export const register = async (req: Request, res: Response)  =>{

    try{
        const validatedData = registerSchema.parse(req.body);

        const { email, password } = validatedData;

        // const { email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if(existingUser){
            return res.status(400).json({
                message: "User Already Exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                verified: user.verified,
                createdAt: user.createdAt,
            }
        })

    }
    catch (error){
        res.status(500).json({
            message : "Internal Server Error",
        });
    }
}


export const login = async (req : Request, res : Response) =>{

    try{
        const validatedData = loginSchema.parse(req.body);

        const { email, password } = validatedData;
        
        // const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where :{
                email,
            }
        });

        if(!user){
            return res.status(400).json({ message : "User not found"});
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ message : "Invalid credentials"});
        }

        //this is without refreshing token
        // const token = jwt.sign(
        //     { userId : user.id , email : user.email },
        //     process.env.JWT_SECRET as string,
        //     // "secret_key",
        //     {expiresIn : "1d"},
        // );

        //updated token handling
        const accesstoken = generateAccessToken(user);
        const refreshtoken = generateRefreshToken(user);

        //new for token update
        await prisma.user.update({
            where : {
                id : user.id,
            },
            data : {
                refreshToken : refreshtoken,
            },
        });

        res.json({
            message : "Login Successfull",
            // token, - old
            accesstoken,
            refreshtoken,
        });

        
    }
    catch(err){
        res.status(500).json({
            message : "Server Error",
        })
    }
}

export const refreshAccessToken = async (req : Request, res : Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string
    ) as any;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
    });

  } catch (err) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};
