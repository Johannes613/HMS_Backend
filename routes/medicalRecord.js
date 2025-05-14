import express from "express";

const medicalRecordRouter = express.Router();

import db from "../models/db.js"; // Assuming you have a db.js file for database connection

// fetching medical record data for a specific patient
medicalRecordRouter.get("/:id", async (req, res) => {
  const patientId = req.params.id;
  console.log(patientId);
  const query = `
    select p.patient_name,d.doc_name,t.date,t.description,
m.diagnosis
from medical_record as m join patient as p on p.patient_id=m.patient_id
join treatment_procedure as t on t.treatment_code=m.treatment_code
join doctor as d on d.doc_id=m.doc_id
where p.patient_id=2;
    `;
  try {
    const [rows] = await db.query(query);
    res.json(rows);
    console.log(rows);
  } catch (error) {
    console.error("Error fetching medical record data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Fetching medical record data for patient ID:", patientId);
});

export default medicalRecordRouter;
