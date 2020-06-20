import { getOrCreateTeacher, getTeacher } from '../services/teachers.service';
import {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  getRecipientEmails,
} from '../services/students.service';

const register = async (req, res) => {
  try {
    const teacherEmail = req.body.teacher;
    const studentEmails = req.body.students;

    const teacher = await getOrCreateTeacher(teacherEmail);
    if (teacher === null) {
      return res
        .status(500)
        .json({ message: 'some problem in creating teacher' });
    }
    const registrationSuccess = await registerStudents(teacher, studentEmails);
    return res
      .status(204)
      .json({ message: 'registration of students successful' });
  } catch (error) {
    console.log('register -> error', error);
    return res.status(500).json({ message: error.message });
  }
};

const commonStudents = async (req, res) => {
  try {
    let teacherEmails = req.query.teacher;
    if (typeof teacherEmails === 'string') {
      teacherEmails = [teacherEmails];
    }
    const students = await getCommonStudents(teacherEmails);
    return res.status(200).json({ students });
  } catch (error) {
    console.log('commonStudents -> error', error);
    return res.status(500).json({ message: error.message });
  }
};

const suspend = async (req, res) => {
  try {
    const studentEmail = req.body.student;
    const teacherEmail = req.body.teacher;
    const suspension = await suspendStudent(studentEmail, teacherEmail);
    return res
      .status(204)
      .json({ message: 'suspension of student successful' });
  } catch (error) {
    console.log('siddhardha: suspend -> error', error);
    return res.status(500).json({ message: error.message });
  }
};

const retrieveForNotifications = async (req, res) => {
  try {
    const teacherEmail = req.body.teacher;
    const notification = req.body.notification;

    let additionalEmails = [];
    notification.split(' ').forEach(word => {
      if (word[0] === '@') {
        let studentEmail = word.substr(1);
        additionalEmails.push(studentEmail);
      }
    });

    const teacher = await getTeacher(teacherEmail, true);
    if (!teacher) {
      throw Error('teacher not found');
    }
    const recipientEmails = getRecipientEmails(teacher, additionalEmails);
    return res.status(200).json({ recipients: recipientEmails });
  } catch (error) {
    console.log('getStudentsForSendingNotification -> error', error);
    return res.status(500).json({ message: error.message });
  }
};

export { register, commonStudents, suspend, retrieveForNotifications };
