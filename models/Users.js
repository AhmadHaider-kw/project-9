'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Users extends Model {}
	Users.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A First name is required',
					},
					notEmpty: {
						msg: 'Please provide a First name',
					},
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A Last name is required',
					},
					notEmpty: {
						msg: 'Please provide a Last name',
					},
				},
			},
			emailAddress: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: 'Email Address Already exists, please provide a unique address',
				},
				validate: {
					isEmail: {
						msg: 'Valid Email Address must be provided',
					},
					notNull: {
						msg: 'A email address is required',
					},
					notEmpty: {
						msg: 'Please provide a email address',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A Password is required',
					},
					notEmpty: {
						msg: 'Please provide a password',
					},
				},
			},
		},
		{ sequelize }
	);

	Users.associations = (models) => {
		Users.hasMany(models.Courses, {
			as: 'Owner',
			foreignKey: {
				fieldName: 'userId',
				allowNull: false,
			},
		});
	};
	return Users;
};
