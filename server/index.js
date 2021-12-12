
// deps
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import env from 'dotenv'

// routers

import authRouter from './router/index.js'
import productRouter from './router/productRouter.js'

// middlewares
import errorMiddleware from './middleware/errorMiddleware.js'


env.config()

const PORT = process.env.PORT || 5001

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.use('/api', authRouter)
app.use('/api', productRouter)

app.use(errorMiddleware)


const start = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => console.log('Server startted on port ' + PORT))
  }
  catch (e) { console.log(e) }
}

start()