const blogRouter = require('express').Router()
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		id: 1,
	})

	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
	const body = request.body
	const user = await User.findOne({})

	const blog = new Blog({
		...body,
		user: user.id,
	})

	const newBlog = await blog.save()

	user.blogs = user.blogs.concat(newBlog._id)
	await user.save()

	response.status(201).json(newBlog)
})

blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const body = request.body
	const blogToUpdate = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	}
	const blogUpdated = await Blog.findByIdAndUpdate(id, blogToUpdate, {
		new: true,
	})

	response.json(blogUpdated)
})

module.exports = blogRouter
