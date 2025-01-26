import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: "./.env" })

const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body
    
        const exsitingUser = await User.findOne({ email })
        if (exsitingUser) {
            return res.status(400).json({msg: '⚠️ User with the same email already exists!'})
        }

        const hashedPassword = await bcryptjs.hash(password, 8)
    
        let user = new User({
            username, 
            email,
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

        res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

const generateCannyToken = async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).json({msg: 'User ID is required'});
        }
        var userData = {
            avatarURL: "",
            email: req.body.email,
            id: req.body.id,
            name: req.body.name
          };
        var response = jwt.sign(userData, process.env.CANNY, {algorithm: 'HS256'});
        res.status(200).json({body: response })
    } catch (e) {
        res.status(500).json({error: e.message});
    } 
}

const getUser = async (req, res) => {
    const user = await User.findById(req.id);
    res.json({...user._doc, token: req.token}); 
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({msg: "User deleted Succesfully! ", ...user._doc, token: req.token}); 
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    signUp,
    signIn,
    tokenValidation,
    getUser, 
    generateCannyToken,
    deleteUser
};
