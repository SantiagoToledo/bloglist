const testingRouter = require('express').Router()
const User = require('../models/userModel')
const Blog = require('../models/blogModel')

testingRouter.post('/reset', async (request, response) => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	response.status(204).end()
})

module.exports = testingRouter
