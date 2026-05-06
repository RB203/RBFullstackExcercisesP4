require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { info, error } = require('./utils/logger')
const { MONGODB_URI,PORT } = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {unknownEndpoint} = require('./utils/middleware')
const {tokenExtractor} = require('./utils/tokenMiddleware')
const mongoose = require('mongoose')

//The url for the database, it is saved in an environment variable
const url = MONGODB_URI

mongoose.set('strictQuery', false)

info('connecting to mongoDB url')

mongoose.connect(url).then(result => {
    info('connected to MongoDB')
}).catch(errorName => {
    error('error connecting to MongoDB:', errorName.message)
})

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(unknownEndpoint)


module.exports = app