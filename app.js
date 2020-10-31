const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
require('express-async-errors')
const blogRouter = require('./controllers/blogController')
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const cors = require('cors')
const mongoose = require('mongoose')
const {
	errorHandler,
	unknownEndpoint,
	tokenExtractor,
} = require('./utils/middleware')

mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		logger.info('connected to DB')
	})
	.catch((error) => {
		logger.error('error in connection to DB: ', error.message)
	})

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

app.use(unknownEndpoint)

app.use(errorHandler)
module.exports = app
