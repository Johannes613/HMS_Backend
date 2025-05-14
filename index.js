// repo: https://github.com/Johannes613/HMS_Backend.git
import express from 'express';
import 'dotenv/config';
const app = express();
const PORT = 5000;
import cors from 'cors';
import trendRouter from './routes/patientVisitTrend.js';
import medicationRouter from './routes/medicationStat.js';
import router from './routes/fourSix.js';
import appointmentStatRouter from './routes/appointmentStat.js';
app.use(cors());// Enable CORS for all routes


app.use(express.json());
app.use('/trendData', trendRouter);
app.use('/medicationData', medicationRouter);
app.use("/four-six",router);
app.use('/appointmentStat', appointmentStatRouter);

 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
