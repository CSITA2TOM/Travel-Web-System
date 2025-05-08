//TCS refers to The Carine Shelter
// server/src/helpers/registerSignUpCode.ts
const workerSignUpCode = "ADMIN";
const publicSignUpCode = "PUBLIC";

export const verifySignUpCode = (code: string, userType: string): boolean => {
    if (!code) {
        return false; // Return false if no code is provided
    }
    if (userType === 'Staff') {
        return code === workerSignUpCode;
    } else if (userType === 'Public') {
        return code === publicSignUpCode;
    }
    return false;
}