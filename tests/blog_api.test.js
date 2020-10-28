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

test('verifies blogs have property id', async () => {
	const blogs = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	expect(blogs.body[0].id).toBeDefined()
})

test('verfies post creates blog', async () => {
	const newBlog = {
		title: 'Testing for blog post',
		author: 'Santiago Tester',
		url: 'fullstackIsCool.com',
		likes: 999,
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAfter = await await helper.blogsInDb()
	const blogsTitle = blogsAfter.map((b) => b.title)

	expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)
	expect(blogsTitle).toContainEqual(newBlog.title)
})

afterAll(() => {
	mongoose.connection.close()
})
