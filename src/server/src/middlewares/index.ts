// server/src/middlewares/index.ts
import express from 'express';
import { get, identity, merge } from 'lodash';
import { getUserBySessionToken } from '../db/usersModel';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId.toString() != id) {
            return res.sendStatus(403);
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['KANKH-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const isAuthorized = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRole = get(req, 'identity.role');

    console.log('isAuthorized: User role from identity', userRole);

    if (userRole !== 'charityWorker') {
        console.log('isAuthorized: User role is not charityWorker, access denied');
        return res.sendStatus(403); // Forbidden: User does not have the right role
    }

    next(); // User is authorized
};