// server/src/controllers/usersControllers.ts
import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    console.log(`Attempting to delete user with ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const deleteUser = await deleteUserById(id);
        if (!deleteUser) {
            console.log("User not found");
            return res.status(404).send('User not found');
        }
        return res.json(deleteUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).send('No update information provided');
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }

        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
