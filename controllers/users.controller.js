const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { create } = require('../../amahack-api/models/Product.model');
const User = require('../models/User.model');

module.exports.login = (req, res, next) => {
	const { username, password } = req.body

	User.findOne({ username: username })
		.then(user => {
			if (!user) {
			next(createError(404, { errors: { username: 'username or password are not valid'} }))
			} else {
			return user.checkPassword(password)
				.then(match => {
				if (!match) {
					next(createError(404, { errors: { username: 'username or password are not valid'} }))
				} else {
					res.json({
					access_token: jwt.sign(
						{ id: user._id },
						process.env.JWT_SECRET || 'JWT Secret - It should be changed',
						{
						expiresIn: '1d'
						}
					)
					})
				}
				})
			}
			})
		.catch(next)
}

module.exports.signup = (req, res, next) => {
	User.findOne({ username: req.body.username })
		.then(user => {
			if (user) {
				next(createError(400, { errors: { username: 'This username is already in use' } }))
			} else {
				return User.create(req.body)
					.then(user => res.status(201).json(user))
			}
		})
		.catch(next)
}

module.exports.upload = (req, res, next) => {

}

module.exports.edit = (req, res, next) => {

}

module.exports.logout = (req, res, next) => {
	
}

module.exports.loggedin = (req, res, next) => {
	User.findById(req.currentUser)
		.then(user => {
			if(!user) {
				next(createERROR(404, 'User not found'))
			} else {
				res.json(user)
			}
		})
}