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

module.exports = {
	dummy,
	totalLikes,
}
