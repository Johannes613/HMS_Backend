import express from 'express';
import db from '../models/db.js';

const trendRouter = express.Router();
import {getPatientVisitTrend,getPatientInfo} from '../controllers/patientVisitController.js';

trendRouter.get('/patientVisitTrend', getPatientVisitTrend);
trendRouter.get('/patientInfo', getPatientInfo);

export default trendRouter;