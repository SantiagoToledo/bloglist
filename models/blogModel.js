const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: String,
	url: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
})

blogSchema.set('toJSON', {
	transform: (document, returnedObecjt) => {
		returnedObecjt.id = returnedObecjt._id.toString()
		delete returnedObecjt._id
		delete returnedObecjt.__v
	},
})

module.exports = mongoose.model('Blog', blogSchema)
