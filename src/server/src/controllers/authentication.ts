// server/src/controllers/authentication.ts
import express from "express";
import { getUserByUsername, createUser } from "../db/users";
import { authentication, random } from "../utils/index";
import { verifySignUpCode } from "../utils/registerSignUpCode";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password, code, userType } = req.body;

        // Check for required fields
        if (!username || !password || !email || !code || !userType) {
            return res.status(400).send("Required fields are missing.");
        }

        // Check for existing user
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(409).send("User already exists.");
        }

        // Validate signup code
        if (!verifySignUpCode(code, userType)) {
            return res.status(400).send("Invalid signup code for the determined user type.");
        }

        // Generate password hash
        const salt = random();
        const hashedPassword = authentication(salt, password);

        // Assign role based on validated userType
        let role = userType === 'Staff' ? "charityWorker" : "publicUser";

        // Create new user
        const newUser = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: hashedPassword,
            },
            role,
        });

        res.status(201).json({
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByUsername(username).select("username email role authentication.salt authentication.password");

        if (!user) {
            return res.sendStatus(404);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("KANKH-AUTH", user.authentication.sessionToken, {
            domain: "localhost",
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure this is false in development if not using HTTPS
            sameSite: "strict" // Consider lax if facing issues with cookie being sent
        });

        return res.status(200).json({
            username: user.username,
            email: user.email,
            _id: user._id,  // Ensure this is included
            role: user.role,
            sessionToken: user.authentication.sessionToken  // This seems redundant with cookie
        }).end();

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

