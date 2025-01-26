import { body, validationResult } from 'express-validator';

const userValidation = () => {
    return [
        body('username', 'username is required').notEmpty(),
        body('email', 'Please enter a valid email address').isEmail(),
        body('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
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