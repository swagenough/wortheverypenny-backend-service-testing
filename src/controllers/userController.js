import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: "./.env" })

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

const generateCannyToken = async (req, res) => {
    console.log(`YOUR CANNY ${process.env.CANNY}`)
    console.log(req.body.id)
    try {
        if (!req.body.id) {
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
    const user = await User.findById(req.user); 
    res.json({...user._doc, token: req.token}); 
}


// FEATURE
const deleteUser = async(req, res) => {
    res.status(200).json({msg: "user deleted!"})
}

export default {
    signUp,
    signIn,
    tokenValidation,
    getUser, 
    generateCannyToken
};
