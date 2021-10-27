'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Courses extends Model {}
	Courses.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A Title is required',
					},
					notEmpty: {
						msg: 'Please provide a Title',
					},
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A Description is required',
					},
					notEmpty: {
						msg: 'Please provide a Description',
					},
				},
			},
			estimatedTime: DataTypes.STRING,
			materialsNeeded: DataTypes.STRING,
		},
		{ sequelize }
	);

	Courses.associate = (models) => {
		Courses.belongsTo(models.Users, {
			as: 'Owner',
			foreignKey: {
				fieldName: 'userId',
			},
		});
	};
	return Courses;
};
