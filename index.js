// repo: https://github.com/Johannes613/HMS_Backend.git
import express from "express";
import "dotenv/config";
const app = express();
const PORT = 5000;
import cors from "cors";
import trendRouter from "./routes/patientVisitTrend.js";
import router from "./routes/fourSix.js";
import appointmentStatRouter from "./routes/appointmentStat.js";
import medicationRouter from "./routes/medicationStat.js";
import appRouter from "./routes/appointment.js";
import medicalRecordRouter from "./routes/medicalRecord.js";
import suppliersRouter from "./routes/suppliers.js";
app.use(cors()); // Enable CORS for all routes

app.use(express.json());
app.use("/trendData", trendRouter);
app.use("/medicationData", medicationRouter);
app.use("/four-six", router);
app.use("/appointmentStat", appointmentStatRouter);
app.use("/trendData", trendRouter);
app.use("/medicationData", medicationRouter);
app.use("/four-six", router);
// fetching appointment data for a specific patient
app.use("/appointment", appRouter);
// fetching medical record data for a specific patient
app.use("/medicalRecord", medicalRecordRouter);
// fetching suppliers data
app.use("/suppliers", suppliersRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


