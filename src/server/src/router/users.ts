// server/src/router/users.ts
import express from 'express';
import { getAllUsers, deleteUser, updateUser } from '../controllers/usersController';

export default (router: express.Router) => {
    router.get('/users', getAllUsers);
    router.delete('/users/:id', deleteUser);
    router.put('/users/:id', updateUser);
};