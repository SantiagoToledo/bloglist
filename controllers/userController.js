const userRouter = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response, next) => {
	try {
		const body = request.body

		if (!body.password || body.password.length < 3) {
			throw {
				name: 'ValidationError',
				message: 'password is shorter than minimunm allowed: 3',
			}
		}

		const passwordHash = await bcrypt.hash(body.password, 10)

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash,
		})

		const savedUser = await user.save()

		response.json(savedUser)
	} catch (error) {
		next(error)
	}
})

userRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {
		title: 1,
		author: 1,
		url: 1,
	})
	response.json(users)
})

module.exports = userRouter
