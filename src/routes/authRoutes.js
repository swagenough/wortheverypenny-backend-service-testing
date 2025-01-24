import express from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const authRouter = express.Router()

// SIGN UP ROUTE
authRouter.post('/api/signup', userController.signUp)

// SIGN IN ROUTE
authRouter.post('/api/signin', userController.signIn)

// TOKEN VALIDATOR
authRouter.post('/tokenIsValid', userController.tokenValidation)

// GET USER DATA
authRouter.get('/', authMiddleware, userController.getUser)

// DELETE USER DATA
authRouter.delete('/', authMiddleware, userController.deleteUser )

export default authRouter;