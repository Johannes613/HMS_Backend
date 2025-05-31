import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "../models/db.js"; // Assuming you have a db.js file for database connection

const appRouter = express.Router();

appRouter.get("/:id", async (req, res) => {
  const patientId = req.params.id;
  console.log(patientId);
  console.log(req.params);
  const query = `select a.appt_date,a.appt_id,d.doc_fname,a.status,p.patient_fname
from appointment as a
join doctor as d on a.doc_id=d.doc_id
join patient p on p.patient_id=a.patient_id
where p.patient_id=${patientId};`;
  try {
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete specific appointment
appRouter.delete("/:id", async (Request, res) => {
  const appointmentId = Request.params.id;
  console.log(appointmentId);
  const query = `delete from appointment where appt_id=${appointmentId};`;
  try {
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error deleting appointment data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update specific appointment
appRouter.put("/:id", async (Request, res) => {
  const appointmentId = Request.params.id;
  const { date, time } = Request.body;
  console.log(date, time);
  console.log(appointmentId);
  const query = `update appointment set appt_date='${date}',time='${time}' where appt_id=${appointmentId};`;
  try {
    const [rows] = await db.query(query);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // If the appointment was updated successfully, return the updated data
    console.log("updated appointment data:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Error updating appointment data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//create new appointment
appRouter.post("/create_new_appointment", async (req, res) => {
  const { date, time, reason, status, patientId, docId } = req.body;

  const [month, day, year] = date.split("/");
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const formattedTime = convertTo24Hour(time); // convert "03:00 PM" → "15:00:00"

  const query = `
    INSERT INTO appointment (appt_date, time, reason, status, doc_id, patient_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [rows] = await db.query(query, [
      formattedDate,
      formattedTime,
      reason,
      status,
      docId,
      patientId,
    ]);
    console.log("new appointment data:", rows);
    res.status(201).json(rows);
  } catch (error) {
    console.error("Error creating appointment data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function convertTo24Hour(time12h) {
  time12h = time12h.trim(); // Remove leading/trailing spaces
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

export default appRouter;
