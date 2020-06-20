'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      email: DataTypes.STRING,
    },
    {},
  );
  Student.associate = function (models) {
    // associations can be defined here
    Student.belongsToMany(models.Teacher, {
      through: 'TeacherStudent',
      onDelete: 'CASCADE',
      foreignKey: 'studentId',
    });
  };
  return Student;
};
