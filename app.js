const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogController')
const cors = require('cors')
const mongoose = require('mongoose')

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

app.use('/api/blogs', blogRouter)

module.exports = app
