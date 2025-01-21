import express from 'express'; 
import userController from '../controllers/userController.js';

const settingRouter = express.Router()

// GENERATE CANNY TOKEN 
settingRouter.post('/api/createCannyToken', userController.generateCannyToken)

export default settingRouter;