const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const helper = require('./api_helper')
const jwt = require('jsonwebtoken')

const usersLoggedIn = []

beforeAll(async () => {
	await User.deleteMany({})

	const users = await Promise.all(
		helper.initialUsers.map(async (u) => {
			return {
				username: u.username,
				name: u.name,
				passwordHash: await bcrypt.hash(u.password, 10),
			}
		})
	)
	const promiseArray = users.map((u) => new User(u)).map((u) => u.save())
	await Promise.all(promiseArray)

	const usersToLogin = helper.initialUsers.map((u) => {
		return ({ username, password } = u)
	})

	usersToLogin.map(async (u) => {
		const result = await api.post('/api/login').send(u)
		usersLoggedIn.push(result.body)
	})
})

beforeEach(async () => {
	await Blog.deleteMany({})
	const user = await User.findOne({})

	const blogsObj = helper.initialBlogs.map(
		(b) =>
			new Blog({
				...b,
				user: user.id,
			})
	)
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
	test('verifies post creates blog', async () => {
		const newBlog = {
			title: 'Testing for blog post',
			author: 'Santiago Tester',
			url: 'fullstackIsCool.com',
			likes: 999,
		}
		const user = usersLoggedIn[0]

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${user.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAfter = await helper.blogsInDb()
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

		const user = usersLoggedIn[0]

		const savedBlog = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${user.token}`)
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

		const user = usersLoggedIn[0]

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${user.token}`)
			.send(newBlog)
			.expect(400)
	})

	test('if invalid token return 401', async () => {
		const newBlog = {
			title: 'Testing for blog post',
			author: 'Santiago Tester',
			url: 'fullstackIsCool.com',
			likes: 999,
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer `)
			.send(newBlog)
			.expect(401)

		const blogsAfter = await helper.blogsInDb()
		expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
	})
})

describe('tests for deletion', () => {
	test('succeds with status 204 if its valid id', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		const user = usersLoggedIn.find(
			(u) => u.username === blogToDelete.user.username
		)

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${user.token}`)
			.expect(204)

		const blogsAfter = await helper.blogsInDb()
		expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)
		expect(blogsAfter).not.toContain(blogToDelete)
	})

	test('fails delete if not creator user', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		//find for a token from other user
		const user = usersLoggedIn.find(
			(u) => u.username !== blogToDelete.user.username
		)

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${user.token}`)
			.expect(401)

		const blogsAfter = await helper.blogsInDb()
		expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
		expect(blogsAfter).toContainEqual(blogToDelete)
	})
})

describe('tests for update', () => {
	test('success if blog is updated', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		blogToUpdate.likes = 999

		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(updatedBlog.body).toEqual(JSON.parse(JSON.stringify(blogToUpdate)))
	})
})

afterAll(() => {
	mongoose.connection.close()
})
