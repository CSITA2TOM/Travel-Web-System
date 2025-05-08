// server/src/router/index.ts
import express from "express";
import authentication from './authentication';
import users from './users';
import { verifySignUpCode } from '../utils/registerSignUpCode';

interface VerifyCodeRequestBody {
    code: string;
    userType: string;
}

const router = express.Router();

router.post('/verify-code', (req, res) => {
    const { code, userType } = req.body;
    const isValid = verifySignUpCode(code, userType);
    res.json({ isValid });
});

export default (): express.Router => {
    authentication(router);
    users(router);

    return router;
}