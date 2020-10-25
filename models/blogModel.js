const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number,
})

blogSchema.set('toJSON', {
	transform: (document, returnedObecjt) => {
		returnedObecjt.id = returnedObecjt._id.toString()
		delete returnedObecjt._id
		delete returnedObecjt.__v
	},
})

module.exports = mongoose.model('Blog', blogSchema)
