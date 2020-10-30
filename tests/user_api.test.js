const helper = require('./api_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

describe('add new user', () => {
	beforeEach(async () => {
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
	})

	test('mising username is invalid request', async () => {
		const usersBefore = await helper.usersInDb()

		const newUser = {
			name: 'juan',
			password: '123456',
		}
		await api.post('/api/users').send(newUser).expect(400)

		const userAfter = await helper.usersInDb()

		expect(userAfter).toHaveLength(usersBefore.length)
		expect(userAfter).not.toContainEqual(newUser)
	})

	test('missing password is invalid request', async () => {
		const usersBefore = await helper.usersInDb()

		const newUser = {
			name: 'juan',
			username: 'juancito',
		}

		await api.post('/api/users').send(newUser).expect(400)

		const userAfter = await helper.usersInDb()

		expect(userAfter).toHaveLength(usersBefore.length)
		expect(userAfter).not.toContainEqual(newUser)
	})

	test('username < 3  is invalid request', async () => {
		const usersBefore = await helper.usersInDb()

		const newUser = {
			name: 'juan',
			username: 'ju',
			password: '654321',
		}

		await api.post('/api/users').send(newUser).expect(400)

		const userAfter = await helper.usersInDb()

		expect(userAfter).toHaveLength(usersBefore.length)
		expect(userAfter).not.toContainEqual(newUser)
	})

	test('password < 3  is invalid request', async () => {
		const usersBefore = await helper.usersInDb()

		const newUser = {
			name: 'juan',
			username: 'juancito',
			password: '65',
		}

		await api.post('/api/users').send(newUser).expect(400)

		const userAfter = await helper.usersInDb()

		expect(userAfter).toHaveLength(usersBefore.length)
		expect(userAfter).not.toContainEqual(newUser)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
