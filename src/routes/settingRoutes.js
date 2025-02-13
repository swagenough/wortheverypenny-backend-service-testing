import express from 'express'; 
import userController from '../controllers/userController.js';

const settingRouter = express.Router()

// GENERATE CANNY TOKEN 
settingRouter.post('/api/createCannyToken', userController.generateCannyToken)

// UPDATE USER DATA
settingRouter.put('/updateSettings/:id', userController.updateSettings)

// UPDATE PROFILE PICTURE
settingRouter.put('/updateProfilePicture/:id', userController.updateProfilePicture)

export default settingRouter;