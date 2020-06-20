import express from 'express';

import {
  register,
  commonStudents,
  suspend,
  retrieveForNotifications,
} from '../controllers/teachers.controller';

const router = express.Router();

router.post('/register', register);
router.get('/commonstudents', commonStudents);
router.post('/suspend', suspend);
router.post('/retrievefornotifications', retrieveForNotifications);

export default router;
