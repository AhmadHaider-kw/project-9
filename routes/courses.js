'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Courses, Users } = require('../models');
const router = express.Router();

// GET route that will return all courses including the User associated with each course
router.get(
	'/courses',
	asyncHandler(async (req, res) => {
		const course = await Courses.findAll();
		res.json(course);
	})
);

// GET route that will return the corresponding course including the User associated with that course
router.get(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		const course = await Courses.findByPk(req.params.id, {
			include: [
				{
					model: Users,
					as: 'Owner',
					attributes: {
						exclude: ['password', 'createdAt', 'updatedAt'],
					},
				},
			],
		});
		res.json(course);
	})
);

//POST route that will create a new course
router.post(
	'/courses',
	authenticateUser,
	asyncHandler(async (req, res) => {
		try {
			let newCourse = req.body;
			const createCourse = await Courses.create(newCourse);
			const { id } = createCourse;
			res.status(201).location(`/api/courses/${id}`).end();
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

// PUT route that will update the corresponding course
router.put(
	'/courses/:id',
	authenticateUser,
	asyncHandler(async (req, res) => {
		try {
			const course = await Courses.findByPk(req.params.id);
			if (req.currentUser.id === course.userId) {
				if (course) {
					console.log('UPDATING COURSE');
					await course.update(req.body);
					res.status(204).end();
				} else {
					res.status(404).end();
				}
			} else {
				res.status(403).json({
					message:
						'Update Failed. User does not have permissions for requested course',
				});
			}
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

//DELETE route that will delete the corresponding course
router.delete(
	'/courses/:id',
	authenticateUser,
	asyncHandler(async (req, res) => {
		const course = await Courses.findByPk(req.params.id);
		if (req.currentUser.id !== course.userId) {
			res
				.status(403)
				.json({
					message:
						'Course deletion failed. User does not have permissions for requested course',
				})
				.end();
		} else {
			await course.destroy();
			res.status(204).end();
		}
	})
);

module.exports = router;
