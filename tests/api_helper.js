const { JsonWebTokenError } = require('jsonwebtoken')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

const initialBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0,
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url:
			'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0,
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0,
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url:
			'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0,
	},
]
const initialUsers = [
	{
		username: 'root',
		name: 'Superuser',
		password: 'root',
	},
	{
		username: 'santi',
		name: 'Santiago',
		password: '0000',
	},
]

const blogsInDb = async () => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		id: 1,
	})
	return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map((b) => b.toJSON())
}

module.exports = {
	initialBlogs,
	blogsInDb,
	initialUsers,
	usersInDb,
}
