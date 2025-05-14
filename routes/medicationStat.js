import express from 'express';

const medicationStatRouter = express.Router();
import {getMedicationStat,getTopStat} from '../controllers/medicationStatController.js';

medicationStatRouter.get('/medicationDetails', getMedicationStat);
medicationStatRouter.get('/topDepartments', getTopStat);

export default medicationStatRouter;