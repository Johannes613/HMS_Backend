// repo: https://github.com/Johannes613/HMS_Backend.git
import express from 'express';
import 'dotenv/config';
const app = express();
const PORT = 3000;
import cors from 'cors';
import db from './models/db.js';
import trendRouter from './routes/patientVisitTrend.js';
import medicationRouter from './routes/medicationStat.js';
app.use(cors());// Enable CORS for all routes


app.use(express.json());
app.use('/trendData', trendRouter);
app.use('/medicationData', medicationRouter);


 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
