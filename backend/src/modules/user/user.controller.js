import jwt from "jsonwebtoken";

import { createUserService, loginUserService, getUserByIdService, } from "./user.service.js";

export const registerUserController = async (req, res, next) =>
{
    try {
        const { name, email, password, role, age, gender, } = req.body;
        const user = await createUserService({ name, email, password, role, age, gender, });
        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await loginUserService(email, password);
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );
        res.cookie("token", token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).status(200).json(
            {
                success: true,
                message: "Login successful",
                user,
            });
    } catch (error) {
        next(error);
    }
};

export const getUserController = async (req, res, next) =>
{
    try {
        const { id } = req.params;
        const currUser=req.user;
        const user = await getUserByIdService(id, currUser);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};