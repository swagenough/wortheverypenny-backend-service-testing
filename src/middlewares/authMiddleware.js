import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg: 'no auth token, access denied'}); // unauthorized
        
        try {
            const isVerified = jwt.verify(token, "passwordKey");
            req.id = isVerified.id;
            req.token = token;
            console.log(req.id)
        } catch (e) {
            return res.status(401).json({msg: 'token verification failed'});
        }
        next();
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export default authMiddleware;