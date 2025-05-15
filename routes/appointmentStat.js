import express from "express";
import "dotenv/config";
import {
  getAppointmentList,
  getTotalPatients,
  getApptFullList,
  getAllPatients,
  getAllRecords,
  getCompletedAppt,
  getLastWeekLsit,
  getCanceled,
  getAdminApptList,
  getUpcoming,
  getFullMedicalRecords
} from "../controllers/appointmentController.js";

const appointmentStatRouter = express.Router();
appointmentStatRouter.post("/appointmentDetails", getAppointmentList);
appointmentStatRouter.post("/appointmentFullList", getApptFullList);
appointmentStatRouter.post("/allPatients", getAllPatients);
appointmentStatRouter.post("/allRecords", getAllRecords);
appointmentStatRouter.get("/totalPatients", getTotalPatients);
appointmentStatRouter.get("/totalCompletedAppts", getCompletedAppt);
appointmentStatRouter.get("/totalCanceledAppts", getCanceled);
appointmentStatRouter.get("/totalUpcomingAppts", getUpcoming);
appointmentStatRouter.get("/fullMedicalRecord", getFullMedicalRecords);
appointmentStatRouter.get("/lastWeekAppts", getLastWeekLsit);
appointmentStatRouter.post("/adminApptList", getAdminApptList);
export default appointmentStatRouter;
