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
describe('getting a blog', () => {
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
})

describe('addition of a new blog', () => {
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

	test('if like property is missing from request it defaults to 0', async () => {
		const newBlog = {
			title: 'Blog without likes',
			author: 'Someone dumb',
			url: 'somethingdotcom',
		}

		const savedBlog = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(savedBlog.body.likes).toBeDefined()
		expect(savedBlog.body.likes).toBe(0)
	})

	test('post blogs with missing title or ulr respond 404', async () => {
		const newBlog = {
			author: 'Someone very dumb',
			likes: 0,
		}

		await api.post('/api/blogs').send(newBlog).expect(400)
	})
})

describe('tests for deletion', () => {
	test('succeds with status 204 if its valid id', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

		const blogsAfter = await helper.blogsInDb()
		expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)
		expect(blogsAfter).not.toContain(blogToDelete)
	})
})

describe('tests for deletion', () => {
	test('success if blog is updated', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		blogToUpdate.likes = 999

		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(updatedBlog.body).toEqual(blogToUpdate)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
