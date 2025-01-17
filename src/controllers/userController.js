import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const signUp = async (req, res) => {
    try {
        const {name, email, password} = req.body
    
        const exsitingUser = await User.findOne({ email })
        if (exsitingUser) { // Equals to != NULL
            return res.status(400).json({msg: '⚠️ User with the same email already exists!'})
        }

        if (password.length < 6) {
            return res.status(400).json({msg: 'Please enter at least 6 length password'})
        }

        const hashedPassword = await bcryptjs.hash(password, 8)
    
        let user = new User({
            name, 
            email,
            // RESOLVED: hashedPassword made the validator for password doesn't work, because it's always > 6 length
            password : hashedPassword,
        })

        user = await user.save()
        res.json(user)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
};

const signIn = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({msg: 'User with this email doesn\'t exist!'})
        }

        // hashed password check
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({msg: 'Incorrect password'})
        }

        const token = jwt.sign({id: user._id}, "passwordKey")
        res.json({token, ...user._doc})
    } catch(e) {
        res.status(500).json({error: e.message})
    }
}

const tokenValidation = async (req, res) => {
    try {
        const token = req.header('x-auth-token'); 
        if (!token) return res.json(false);
        const isVerified = jwt.verify(token, 'passwordKey');
        if (!isVerified) return res.json(false);

        const user = await User.findById(isVerified.id);
        if (!user) return res.json(false);
        // if all valid
        res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

const getUser = async (req, res) => {
    const user = await User.findById(req.user); 
    res.json({...user._doc, token: req.token}); 
}

export default {
    signUp,
    signIn,
    tokenValidation,
    getUser
};
