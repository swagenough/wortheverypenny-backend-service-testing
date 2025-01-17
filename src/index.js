import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import authRouter from './routes/authRoutes.js'

dotenv.config({ path: "./.env" })

const PORT = process.env.PORT
const DB = process.env.DB
const app = express()

app.use(express.json())
// LOGGING
app.use(morgan('combined'))
// AUTH
app.use(authRouter);

// CONNECTIONS
mongoose.connect(DB).then(() => {
    console.log("Connection Successful")
}).catch((e) => {
    console.log(e)
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at PORT ${PORT}`)
})

export default app