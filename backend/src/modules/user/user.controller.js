import jwt from "jsonwebtoken";

import { createUserService, loginUserService, getUserByIdService, } from "./user.service.js";

export const registerUserController = async (req, res, next) =>
{
    try {
        const { name, email, password, role, age, gender, } = req.body;
        const user = await createUserService({ name, email, password, role, age, gender, });
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

        // api testing
        console.log(token);
        res.status(201).json({
            success: true,
            message: "registeration successful",
            data: user,
        });

        // res.cookie("token", token,
        //     {
        //         httpOnly: true,
        //         secure: false,
        //         sameSite: "lax",
        //         maxAge: 7 * 24 * 60 * 60 * 1000,
        //     }).status(201).json({
        //     success: true,
        //     message: "registeration successful"
        //     data: user,
        // });
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

        // api testing
        console.log(token);
        res.status(201).json({
            success: true,
            message: "login successful",
            data: user,
        });

        // res.cookie("token", token,
        //     {
        //         httpOnly: true,
        //         secure: false,
        //         sameSite: "lax",
        //         maxAge: 7 * 24 * 60 * 60 * 1000,
        //     }).status(200).json(
        //     {
        //         success: true,
        //         message: "login successful",
        //         user,
        //     });
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

export const logoutUserController = async (req, res, next) =>
{
    try {
        res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
        }).status(200).json({
            success: true,
            message: "signed out successful",
            });
    } catch (error) {
        next(error);
    }
}