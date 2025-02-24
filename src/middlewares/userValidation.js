import { body, validationResult } from 'express-validator';
import User from '../models/user.js';

const userValidation = () => {
    return [
        body('username', 'username is required').notEmpty(),
        body('email', 'Please enter a valid email address').isEmail(),
        body('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character').matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
        body('username', '⚠️ User with the same username already exists!').custom(async (username) => {
            try {
                const existingUser = User.findOne({ username })
                if (existingUser) {
                    throw new Error()
                }
            } catch (e) {
                throw new Error()
            }
        }),
        body('email', '⚠️ User with the same email already exists!').custom(async (email) => {
            try {
                const existingEmail = await User.findOne({ email })
                if (existingEmail) {
                    throw new Error()
                }
            } catch (e) {
                throw new Error()
            }
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ]
}

export { userValidation };