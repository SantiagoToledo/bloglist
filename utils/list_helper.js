const countBy = require('lodash/countBy')

const dummy = () => {
	return 1
}

const totalLikes = (blogs) => {
	if (Array.isArray(blogs)) {
		return blogs.reduce((sum, blog) => (sum = sum + blog.likes), 0)
	} else {
		return blogs.likes
	}
}

const favoriteBlog = (blogs) => {
	let max = -1
	let favBlog = undefined
	if (Array.isArray(blogs)) {
		blogs.forEach((b) => {
			if (b.likes >= max) {
				max = b.likes
				favBlog = b
			}
		})
	} else {
		favBlog = blogs
	}
	if (favBlog) {
		delete favBlog._id
		delete favBlog.__v
		delete favBlog.url
	}
	return favBlog
}

const mostBlogs = (blogs) => {
	const blogPerAuthor = countBy(blogs, 'author')
	console.log(blogPerAuthor)
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
}
