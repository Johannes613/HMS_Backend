import express from 'express';

const medicationStatRouter = express.Router();
import {getMedicationStat,getTopStat,getTopDoc} from '../controllers/medicationStatController.js';

medicationStatRouter.get('/medicationDetails', getMedicationStat);
medicationStatRouter.get('/topDepartments', getTopStat);
medicationStatRouter.get('/topDocs', getTopDoc);

export default medicationStatRouter;