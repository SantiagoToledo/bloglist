const userRouter = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
	const body = request.body

	const passwordHash = await bcrypt.hash(body.password, 10)
	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	})

	const savedUser = await user.save()

	response.json(savedUser)
})

userRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users)
})

module.exports = userRouter
