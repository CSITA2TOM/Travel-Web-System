// server/src/router/authentication.ts
import express from 'express';
import { login, register } from '../controllers/authentication';

export default (router: express.Router) => {
    console.log(typeof router);
    router.post('/auth/register', register);
    router.post('/auth/login', login);
};
