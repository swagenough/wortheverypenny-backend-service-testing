import express from 'express'
import bankController from '../controllers/bankController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const bankRouter = express.Router()

// ADD BANK
bankRouter.post('/bank/addBankAccount', authMiddleware, bankController.addNewBankAccount)

export default bankRouter;