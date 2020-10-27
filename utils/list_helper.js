const _ = require('lodash')

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
	let mostBlogs = undefined

	if (_.isArray(blogs)) {
		const blogsCount = _.toPairs(_.countBy(blogs, 'author'))

		const countPerAuthor = blogsCount.map(([name, count]) => {
			return { author: name, n: count }
		})
		mostBlogs = _.maxBy(countPerAuthor, 'n')
	} else if (_.isObject(blogs)) {
		mostBlogs = { author: blogs.author, n: 1 }
	}
	return mostBlogs
}

const mostLikes = (blogs) => {
	let mostLikes = undefined

	if (_.isArray(blogs)) {
		mostLikes = blogs.reduce((res, blog) => {
			let key = _.find(res, { author: blog.author })

			if (key === undefined) {
				res.push({ author: blog.author, likes: blog.likes })
			} else {
				key.likes += blog.likes
			}
			return res
		}, [])

		mostLikes = _.maxBy(mostLikes, 'likes')
	} else if (_.isObject(blogs)) {
		mostLikes = { author: blogs.author, likes: blogs.likes }
	}

	return mostLikes
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}
