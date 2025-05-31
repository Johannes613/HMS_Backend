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
  getFullMedicalRecords,
  getApptPassed,
} from "../controllers/appointmentController.js";
import db from "../models/db.js";

const appointmentStatRouter = express.Router();
appointmentStatRouter.post("/appointmentDetails", getAppointmentList);
appointmentStatRouter.post("/appointmentFullList", getApptFullList);
appointmentStatRouter.get("/appointmentpassed", getApptPassed);
appointmentStatRouter.post("/allPatients", getAllPatients);
appointmentStatRouter.post("/allRecords", getAllRecords);
appointmentStatRouter.get("/totalPatients", getTotalPatients);
appointmentStatRouter.get("/totalCompletedAppts", getCompletedAppt);
appointmentStatRouter.get("/totalCanceledAppts", getCanceled);
appointmentStatRouter.get("/totalUpcomingAppts", getUpcoming);
appointmentStatRouter.get("/fullMedicalRecord", getFullMedicalRecords);
appointmentStatRouter.get("/lastWeekAppts", getLastWeekLsit);
appointmentStatRouter.post("/adminApptList", getAdminApptList);
appointmentStatRouter.post("/addDoctor", async (req, res) => {
  try {
    const { doc_fname, doc_lname, phone_num, email, age, dept_id } = req.body;

    if (!doc_fname || !doc_lname || !phone_num || !email || !age || !dept_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `
      INSERT INTO doctor 
        (doc_fname, doc_lname, phone_num, email, age, dept_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [doc_fname, doc_lname, phone_num, email, age, dept_id];

    const [result] = await db.execute(query, values);

    res.status(201).json({
      message: "Doctor added successfully",
      doctorId: result.insertId,
    });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

appointmentStatRouter.post("/addPatient", async (req, res) => {
  const {
    patient_fname,
    patient_lname,
    gender,
    age,
    phone_num,
    email,
    birth_date,
    insurance_id,
  } = req.body;

  const sql = `
    INSERT INTO patient (
      patient_fname,
      patient_lname,
      gender,
      age,
      phone_num,
      email,
      birth_date,
      insurance_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [rows] = await db.query(sql, [
      patient_fname,
      patient_lname,
      gender,
      age,
      phone_num,
      email,
      birth_date,
      insurance_id
    ]);
    res
      .status(201)
      .json(rows);
  } catch (error) {
   console.log(error)
  }
});

appointmentStatRouter.put("/updatePatient/:id", async (req, res) => {
  const patientId = req.params.id;

  const {
    patient_fname,
    patient_lname,
    email,
    phone_num,
    age,
    birth_date,
    gender,
    insurance_id,
  } = req.body;

  const query = `
  UPDATE patient
  SET patient_fname = ?, patient_lname = ?, email = ?, phone_num = ?,
      age = ?, birth_date = ?, gender = ?, insurance_id = ?
  WHERE patient_id = ?
`;

  try {
    const [rows] = await db.query(query, [
      patient_fname,
      patient_lname,
      email,
      phone_num,
      age,
      birth_date,
      gender,
      insurance_id,
      patientId,
    ]);

    res.status(201).json(rows);
  } catch (error) {
    // console.error("Insert error:", err);
    return res.status(500).json({ message: "Insert failed" });
  }
});

export default appointmentStatRouter;
