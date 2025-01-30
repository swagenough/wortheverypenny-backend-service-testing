import express from 'express'
import transactionController from '../controllers/transactionController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const transactionRouter = express.Router()

// ADD TRANSACTION
transactionRouter.post('/transaction/addNewTransaction', authMiddleware, transactionController.addTransaction)

export default transactionRouter;