'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
    {
      email: DataTypes.STRING,
    },
    {},
  );
  Teacher.associate = function (models) {
    // associations can be defined here
    Teacher.belongsToMany(models.Student, {
      through: 'TeacherStudent',
      onDelete: 'CASCADE',
      foreignKey: 'teacherId',
    });
  };
  return Teacher;
};
