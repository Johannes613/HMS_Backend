import db from "../models/db.js";
const getAppointmentList = async (req, res) => {
  let doc_id = req.body.doc_id;
  const query = `select 
	pat.patient_name as patient_name,
    appt.time as appt_time,
    appt.status as appt_status
	from doctor doc 
    join appointment appt on appt.doc_id = doc.doc_id
    join patient pat on pat.patient_id = appt.patient_id
    where doc.doc_id = ${doc_id} and appt.appt_date >= date_sub(curdate(), interval 500 day);`;

    

  try {
    const [rows] = await db.query(query);
    console.log("Fetched appointment list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointmen list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getLastWeekLsit = async (req, res) => {
  const query = `select 
	count(*) as count
	from doctor doc 
    join appointment appt on appt.doc_id = doc.doc_id
    join patient pat on pat.patient_id = appt.patient_id
    where appt.appt_date >= date_sub(curdate(), interval 500 day);`;

    

  try {
    const [rows] = await db.query(query);
    console.log("Fetched last week list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching last week list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getTotalPatients = async (req, res) => {
  const query = `SELECT COUNT(*) AS total_patients FROM patient;`;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched patient stat", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching patient stat:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getCompletedAppt = async (req, res) => {
  const query = `select 
count(*) as count  from appointment appt where appt.status = "Completed";`;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched completed", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching completed:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getCanceled = async (req, res) => {
  const query = `select 
appt_date, reason from appointment appt where appt.status = "Canceled";`;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched completed", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching completed:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getUpcoming = async (req, res) => {
  const query = `select count(*) as count from appointment where status = "Scheduled";`;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched completed", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching completed:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getFullMedicalRecords = async (req, res) => {
  const query = `select count(*) as count from medical_record`;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched completed", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching completed:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getApptFullList = async (req, res) => {
  const { appt_date, appt_status } = req.body;

  let query = `select 
	pat.patient_name as patient_name,
    appt.time as appt_time,
    appt.appt_date as appt_date,
    appt.appt_id as appt_id,
    appt.status as appt_status
	from doctor doc 
    join appointment appt on appt.doc_id = doc.doc_id
    join patient pat on pat.patient_id = appt.patient_id
    where appt.appt_date >= '${appt_date}'`;

  if (appt_status && appt_status !== "all") {
    query += ` and appt.status = '${appt_status}'`;
  }

  try {
    const [rows] = await db.query(query);
    console.log("Fetched appointment full list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointment full list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getAdminApptList = async (req, res) => {
  const { appt_date, appt_status } = req.body;

  let query = `select 
	pat.patient_name as patient_name,
    appt.time as appt_time,
    appt.appt_date as appt_date,
    appt.appt_id as appt_id,
    appt.status as appt_status
	from patient pat
    join appointment appt on appt.patient_id = pat.patient_id
    where appt.appt_date >= '${appt_date}'`;

  if (appt_status && appt_status !== "all") {
    query += ` and appt.status = '${appt_status}'`;
  }

  try {
    const [rows] = await db.query(query);
    console.log("Fetched appointment full list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointment full list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getAllPatients = async (req, res) => {
  const { age, gender } = req.body;

  let query = `SELECT * FROM patient`;

  
  if(age && age !== 'all' && gender && gender !== 'all'){
    query +=` where age >= '${age}' and gender = '${gender}'`;
  }
  else if(age && age !== 'all'){
    query +=` where age >='${age}'`;
  }
  else if(gender && gender !== 'all'){
    query += ` where gender = '${gender}'`;
  }

  try {
    const [rows] = await db.query(query);
    console.log("Fetched all patients", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getAllRecords = async (req, res) => {
const { rec_id, patient_id, patient_name } = req.body;

let query = `
  SELECT 
    med.record_id,
    med.diagnosis,
    pat.patient_id,
    pat.patient_name,
    med.treatment_code
  FROM medical_record med
  JOIN doctor doc ON doc.doc_id = med.doc_id
  JOIN patient pat ON pat.patient_id = med.patient_id
`;

let orderFields = [];
if (rec_id) orderFields.push(rec_id);
if (patient_id) orderFields.push(patient_id);
if (patient_name) orderFields.push(patient_name);

if (orderFields.length > 0) {
  query += ` ORDER BY ${orderFields.join(', ')}`;
}

  try {
    const [rows] = await db.query(query);
    console.log("Fetched all records", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching records patients:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};


export {
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
};
