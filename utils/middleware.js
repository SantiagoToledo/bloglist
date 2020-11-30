// UNKNOWN ENDPOINT
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown emdpoint' })
}

// REQUEST LOGGER
const requestLogger = (request, response, next) => {
	console.log(
		'Method: ',
		request.method,
		' Path: ',
		request.path,
		' Body: ',
		request.body
	)
	next()
}

// ERROR HANDLER
const errorHandler = (error, request, response, next) => {
	//	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).json({ error: 'malformated request' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid token' })
	}

	next(error)
}

// TOKEN EXTRACTOR
const tokenExtractor = (request, response, next) => {
	const auth = request.get('Authorization')
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		request.token = auth.substring(7)
	}
	next()
}

module.exports = {
	unknownEndpoint,
	requestLogger,
	errorHandler,
	tokenExtractor,
}
