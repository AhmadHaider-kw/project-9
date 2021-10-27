'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { Users } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();

// GET route that will return all properties and values for the currently authenticated User
router.get(
	'/users',
	authenticateUser,
	asyncHandler(async (req, res) => {
		const user = req.currentUser;
		res.json({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			emailAddress: user.emailAddress,
		});
	})
);

// POST route that will create a new user
router.post(
	'/users',
	asyncHandler(async (req, res) => {
		try {
			const user = req.body;
			let password = user.password;
			if (password) {
				user.password = bcrypt.hashSync(user.password, 10);
			}

			await Users.create(user);
			res.status(201).location('/').end();
		} catch (error) {
			if (
				error.name === 'SequelizeValidationError' ||
				error.name === 'SequelizeUniqueConstraintError'
			) {
				const errors = error.errors.map((err) => err.message);
				res.status(400).json({ errors });
			} else {
				throw error;
			}
		}
	})
);

module.exports = router;
