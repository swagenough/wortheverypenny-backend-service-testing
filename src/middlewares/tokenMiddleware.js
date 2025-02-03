import BlacklistedToken from "../models/blacklistedToken.js";

const isTokenBlacklisted = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ error: 'Access denied' });
    }
    next();
}

export default isTokenBlacklisted;