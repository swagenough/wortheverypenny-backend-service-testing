import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config({ path: "./.env" })

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg: 'no auth token, access denied'}); // unauthorized
        
        try {
            const isVerified = jwt.verify(token, process.env.JWT);
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