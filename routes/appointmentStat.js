import express from 'express';
import  'dotenv/config';
import {getAppointmentList,getTotalPatients,getApptFullList,getAllPatients,getAllRecords,getCompletedAppt,getLastWeekLsit} from '../controllers/appointmentController.js';

const appointmentStatRouter = express.Router();
appointmentStatRouter.post('/appointmentDetails', getAppointmentList);
appointmentStatRouter.post('/appointmentFullList', getApptFullList);
appointmentStatRouter.post('/allPatients', getAllPatients);
appointmentStatRouter.post('/allRecords', getAllRecords);
appointmentStatRouter.get('/totalPatients', getTotalPatients);
appointmentStatRouter.get('/totalCompletedAppts', getCompletedAppt);
appointmentStatRouter.get('/lastWeekAppts', getLastWeekLsit);
export default appointmentStatRouter;
