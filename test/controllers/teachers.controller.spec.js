import {
  register,
  commonStudents,
  suspend,
  retrieveForNotifications,
} from '../../src/controllers/teachers.controller';

import * as TeachersService from '../../src/services/teachers.service';
import * as StudentsService from '../../src/services/students.service';

describe('#TeachersController', () => {
  describe('#register', () => {
    let req;
    let res;
    beforeEach(() => {
      res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      res.status = jest.fn().mockReturnValue({
        json: res.json,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should register successfully', async () => {
      req = {
        body: {
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
        },
      };
      const getOrCreateTeacherMock = jest.spyOn(
        TeachersService,
        'getOrCreateTeacher',
      );
      const registerStudentsMock = jest.spyOn(
        StudentsService,
        'registerStudents',
      );
      getOrCreateTeacherMock.mockResolvedValue({
        id: 1,
        email: 'teacherken@gmail.com',
        updatedAt: '2020-06-20T03:02:51.587Z',
        createdAt: '2020-06-20T03:02:51.587Z',
      });
      registerStudentsMock.mockResolvedValue(true);

      await register(req, res);
      expect(res.status).toBeCalledWith(204);
      expect(res.json).toBeCalledWith({
        message: 'registration of students successful',
      });
    });
  });

  describe('#commonStudents', () => {
    let req;
    let res;
    beforeEach(() => {
      res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      res.status = jest.fn().mockReturnValue({
        json: res.json,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should get common students', async () => {
      req = { query: { teacher: 'teacherken@gmail.com' } };
      const getCommonStudentsMock = jest.spyOn(
        StudentsService,
        'getCommonStudents',
      );

      getCommonStudentsMock.mockResolvedValue([
        'studentjon@gmail.com',
        'studenthon@gmail.com',
      ]);

      await commonStudents(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({
        students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      });
    });
  });

  describe('#suspend', () => {
    let req;
    let res;
    beforeEach(() => {
      res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      res.status = jest.fn().mockReturnValue({
        json: res.json,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should suspend successfully', async () => {
      req = {
        body: { teacher: 'teacherken@gmail.com', student: 'student@gmail.com' },
      };
      const suspendStudentMock = jest.spyOn(StudentsService, 'suspendStudent');

      suspendStudentMock.mockResolvedValue(true);

      await suspend(req, res);
      expect(res.status).toBeCalledWith(204);
      expect(res.json).toBeCalledWith({
        message: 'suspension of student successful',
      });
    });
  });

  describe('#retrieveForNotifications', () => {
    let req;
    let res;
    beforeEach(() => {
      res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      res.status = jest.fn().mockReturnValue({
        json: res.json,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should retrieve recipients', async () => {
      req = {
        body: {
          teacher: 'teacherken@gmail.com',
          notification:
            'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
        },
      };
      const getTeacherMock = jest.spyOn(TeachersService, 'getTeacher');

      getTeacherMock.mockResolvedValue({
        id: 1,
        email: 'teacherken1@gmail.com',
        createdAt: '2020-06-20T02:46:32.000Z',
        updatedAt: '2020-06-20T02:46:32.000Z',
        Students: [
          {
            email: 'studentjon1@gmail.com',
            TeacherStudent: {
              createdAt: '2020-06-20T02:46:32.000Z',
              updatedAt: '2020-06-20T02:46:32.000Z',
              studentId: 1,
              teacherId: 1,
            },
          },
        ],
      });

      await retrieveForNotifications(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({
        recipients: [
          'studentjon1@gmail.com',
          'studentagnes@gmail.com',
          'studentmiche@gmail.com',
        ],
      });
    });
  });
});
