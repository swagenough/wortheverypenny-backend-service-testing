import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import MonthlyReport from '../models/monthlyReport.js'
import Subscription from '../models/subscription.js'
import mongoose from 'mongoose'
import { json } from 'express'

dotenv.config({ path: "./.env" })

const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body
    
        const existingUser = await User.findOne({ email })
        if (existingUser) {
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

        const user = await User.findOne({email}).populate('monthlyReport subscription')
        if (!user) {
            return res.status(400).json({msg: 'User with this email doesn\'t exist!'})
        }
        // hashed password check
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({msg: 'Incorrect password'})
        }

        if (!user.monthlyReport || user.monthlyReport.length === 0) { 
            const newReport = new MonthlyReport({
                user: user._id,
                totalIncome: 0,
                totalExpense: 0,
                spendingCategories: [],
                recommendations: [],
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            });
            await newReport.save();
            user.monthlyReport = [newReport._id];
            await user.save();
        }

        // set user plan to free if not set
        if (!user.subscription) {
            const subscription = new Subscription({
                user: user._id,
                plan: 'Basic', // Generate a new ObjectId for the plan
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            });
            await subscription.save();
            user.subscription = subscription._id;
            await user.save();
        }

        // JWT wraps the user id in a token
        const token = jwt.sign({id: user._id}, "passwordKey")
        res.status(200).json({token, ...user._doc})
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
        // the id is stored in the token checked if it exists
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
    const user = await User.findById(req.id).populate('monthlyReport subscription');
    console.log(user)
    res.status(200).json({...user._doc, token: req.token}); 
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

const updateSettings = async (req, res) => {
    console.log(req.params.id)
    try {
        const { displayName, profilePicture, paymentNumber  } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.displayName = displayName;
        user.profilePicture = profilePicture;
        user.paymentNumber = paymentNumber;
        await user.save();
        res.status(200).json({msg: "User updated Succesfully! "});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export default {
    signUp,
    signIn,
    tokenValidation,
    getUser, 
    generateCannyToken,
    deleteUser,
    updateSettings
};
