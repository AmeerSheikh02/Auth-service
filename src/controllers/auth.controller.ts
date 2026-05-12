import { Request, Response } from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"

import prisma from "../config/prisma";

export const register = async (req: Request, res: Response)  =>{

    try{

        const { email, password} = req.body;

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
        const { email, password } = req.body;

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

        const token = jwt.sign(
            { userId : user.id , email : user.email },
            "secret_key",
            {expiresIn : "1d"},
        );

        res.json({
            message : "Login Successfull",
            token,
        });

        
    }
    catch(err){
        res.status(500).json({
            message : "Server Error",
        })
    }
}