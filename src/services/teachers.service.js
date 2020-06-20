import db from '../models';

const getOrCreateTeacher = async email => {
  let teacher = null;

  await db.Teacher.findOrCreate({
    where: { email },
  }).spread(teacherCreated => {
    teacher = teacherCreated;
  });

  return teacher;
};

const getTeacher = async (email, getStudents = false) => {
  let query = { where: { email } };
  if (getStudents) {
    query = {
      ...query,
      include: [
        {
          model: db.Student,
          attributes: ['email'],
        },
      ],
    };
  }
  return db.Teacher.findOne(query);
};

export { getOrCreateTeacher, getTeacher };
