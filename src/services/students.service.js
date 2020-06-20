import db from '../models';
import { getTeacher } from './teachers.service';

const getOrCreateStudent = async email => {
  let student = null;
  await db.Student.findOrCreate({
    where: { email },
  }).spread(studentCreated => {
    student = studentCreated;
  });
  return student;
};

const registerStudents = async (teacher, studentEmails) => {
  await Promise.all(
    studentEmails.map(async studentEmail => {
      const student = await getOrCreateStudent(studentEmail);
      if (student) {
        student.addTeacher(teacher);
      } else {
        throw Error('issue in creating student');
      }
    }),
  );
  console.log('registerStudents success');
  return true;
};

const suspendStudent = async (studentEmail, teacherEmail) => {
  const student = await db.Student.findOne({ where: { email: studentEmail } });
  if (!student) {
    throw Error('student not found');
  }
  const teacher = await getTeacher(teacherEmail);
  if (!teacher) {
    throw Error('teacher not found');
  }
  student.removeTeacher(teacher);
  return true;
};

const getStudentsForTeacher = teacher => {
  if (!teacher) throw Error(`no teacher found`);
  let studentsForThisTeacher = [];
  if (teacher.Students) {
    studentsForThisTeacher = teacher.Students.map(student => student.email);
  }
  return studentsForThisTeacher;
};

const getRecipientEmails = (teacher, additionalEmails) => {
  const students = getStudentsForTeacher(teacher);
  return Array.from(new Set(students.concat(additionalEmails)));
};

const getCommonStudents = async teacherEmails => {
  const students = await Promise.all(
    teacherEmails.map(async teacherEmail => {
      const teacher = await getTeacher(teacherEmail, true);
      return getStudentsForTeacher(teacher);
    }),
  );

  if (students.length === 0) return [];
  if (students.length === 1) return students[0];

  let commonStudents = [];
  commonStudents = students.reduce((t1, t2) =>
    t1.filter(email => t2.includes(email)),
  );

  return [...commonStudents];
};

export {
  registerStudents,
  suspendStudent,
  getRecipientEmails,
  getCommonStudents,
};
