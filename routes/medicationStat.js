import express from 'express';
import db from '../models/db.js';

const medicationStatRouter = express.Router();
import {getMedicationStat,getTopStat} from '../controllers/medicationStatController.js';

medicationStatRouter.get('/medicationDetails', getMedicationStat);
medicationStatRouter.get('/topDepartments', getTopStat);

export default medicationStatRouter;