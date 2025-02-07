import express from 'express'
import transactionController from '../controllers/transactionController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const transactionRouter = express.Router()

// ADD TRANSACTION
transactionRouter.post('/transaction/addNewTransaction', authMiddleware, transactionController.addTransaction)

// GET CATEGORIZED TRANSACTIONS
transactionRouter.get('/transaction/getCategorizedTransactions', authMiddleware, transactionController.getCategorizedTransactions)

// GET ALL TRANSACTIONS
transactionRouter.get('/transaction/getDailyAmountTransactions', authMiddleware, transactionController.getDailyAmountTransactions)

export default transactionRouter;