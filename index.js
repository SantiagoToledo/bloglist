const config = require('./utils/config')
const logger = require('./utils/logger')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

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

app.get('/api/blogs', (request, response) => {
	Blog.find({}).then((blogs) => {
		response.json(blogs)
	})
})

app.post('/api/blogs', (request, response) => {
	const blog = new Blog(request.body)

	blog.save().then((result) => {
		response.status(201).json(result)
	})
})

const PORT = config.PORT
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`)
})
