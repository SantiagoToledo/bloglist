const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blogModel')
const helper = require('./api_helper')

beforeEach(async () => {
	await Blog.deleteMany({})

	const blogsObj = helper.initialBlogs.map((b) => new Blog(b))
	const promiseArray = blogsObj.map((blog) => blog.save())

	await Promise.all(promiseArray)
})

test('get all blogs in db', async () => {
	const blogsAtStart = await helper.blogsInDb()

	const blogs = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	expect(blogs.body).toHaveLength(blogsAtStart.length)

	const blogsAfterProcess = JSON.parse(JSON.stringify(blogsAtStart))

	expect(blogs.body).toEqual(blogsAfterProcess)
})

afterAll(() => {
	mongoose.connection.close()
})
