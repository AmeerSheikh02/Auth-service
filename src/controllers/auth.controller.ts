import { Request, Response } from "express";
import bcrypt from "bcrypt";

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