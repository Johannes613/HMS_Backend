import express from 'express';
import db from '../models/db.js';

const trendRouter = express.Router();
import getPatientVisitTrend from '../controllers/patientVisitController.js';

trendRouter.get('/patientVisitTrend', getPatientVisitTrend);

export default trendRouter;