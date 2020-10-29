const blogRouter = require('express').Router()
const Blog = require('../models/blogModel')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
	try {
		const blog = new Blog(request.body)
		const newBlog = await blog.save()
		response.status(201).json(newBlog)
	} catch (exception) {
		response.status(400).send(exception)
	}
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
