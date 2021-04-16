const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
	const authHeader = req.header('Authorization');

	if (authHeader) {
		const authProtocol = authHeader.split(' ')[0];

		if (authProtocol === 'Bearer') {
			jwt.verify(
				authHeader.split(' ')[1] || '', // If there's no token we add '' so JWT library will handle the error
				process.env.JWT_SECRET,
				(error, decoded) => {
					if (error) {
						next(error);
					}

					if (decoded) {
						req.currentUser = decoded.id 
						next()
					}
				}
			)
		} else {
			next(createError(401));
		}

	} else {
		next(createError(401));
	}
}