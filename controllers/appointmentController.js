import db from "../models/db.js";

const getAppointmentList = async (req, res) => {
  const doc_id = req.body.doc_id;

  const query = `
    SELECT 
      pat.patient_fname AS patient_fname,
      appt.time AS appt_time,
      appt.status AS appt_status
    FROM doctor doc
    JOIN appointment appt ON appt.doc_id = doc.doc_id
    JOIN patient pat ON pat.patient_id = appt.patient_id
    WHERE doc.doc_id = ? AND appt.appt_date >= DATE_SUB(CURDATE(), INTERVAL 500 DAY);
  `;

  try {
    const [rows] = await db.query(query, [doc_id]);
    console.log("Fetched appointment list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointment list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getTrendForVisits = async (req, res) => {
  const query = `
    SELECT 
      YEAR(appt.appt_date) AS Year,
      MONTHNAME(appt.appt_date) AS Month,
      MONTH(appt.appt_date) AS MonthNum,
      dept.dept_name AS Department,
      pat.gender AS Gender,
      CASE
          WHEN TIMESTAMPDIFF(YEAR, pat.birth_date, CURDATE()) < 18 THEN 'Child'
          WHEN TIMESTAMPDIFF(YEAR, pat.birth_date, CURDATE()) BETWEEN 18 AND 59 THEN 'Adult'
          ELSE 'Senior'
      END AS AgeGroup,
      COUNT(*) AS Visit_Count
    FROM department dept
    JOIN doctor doc ON dept.dept_id = doc.dept_id
    JOIN appointment appt ON appt.doc_id = doc.doc_id
    JOIN patient pat ON appt.patient_id = pat.patient_id
    WHERE appt.appt_date >= DATE_SUB(CURDATE(), INTERVAL 3 YEAR)
    GROUP BY Year, Month, MonthNum, Department, Gender, AgeGroup
    ORDER BY Year DESC, MonthNum ASC, Department, Gender, AgeGroup
    LIMIT 1000;
  `;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched aggregated visit data:", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching aggregated visit data:", error);
    res.status(500).json({ error: "Internal server error while fetching aggregated visits" });
  }
};

const getLastWeekLsit = async (req, res) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM doctor doc
    JOIN appointment appt ON appt.doc_id = doc.doc_id
    JOIN patient pat ON pat.patient_id = appt.patient_id
    WHERE appt.appt_date >= DATE_SUB(CURDATE(), INTERVAL 500 DAY);
  `;

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
  const query = `
    SELECT COUNT(*) AS count 
    FROM appointment 
    WHERE status = 'Completed';
  `;

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
  const query = `
    SELECT appt_date, reason 
    FROM appointment 
    WHERE status = 'Cancelled';
  `;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched canceled", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching canceled:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getUpcoming = async (req, res) => {
  const query = `
    SELECT COUNT(*) AS count 
    FROM appointment 
    WHERE status = 'Scheduled';
  `;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched upcoming", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching upcoming:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getFullMedicalRecords = async (req, res) => {
  const query = `
    SELECT COUNT(*) AS count 
    FROM medical_record;
  `;

  try {
    const [rows] = await db.query(query);
    console.log("Fetched medical record count", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching full medical records:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getApptFullList = async (req, res) => {
  const { appt_date, appt_status } = req.body;

  let query = `
    SELECT 
      pat.patient_fname AS patient_fname,
      appt.time AS appt_time,
      appt.appt_date AS appt_date,
      appt.appt_id AS appt_id,
      appt.status AS appt_status
    FROM doctor doc
    JOIN appointment appt ON appt.doc_id = doc.doc_id
    JOIN patient pat ON pat.patient_id = appt.patient_id
    WHERE appt.appt_date >= ?
  `;

  const params = [appt_date];

  if (appt_status && appt_status !== "all") {
    query += ` AND appt.status = ?`;
    params.push(appt_status);
  }

  try {
    const [rows] = await db.query(query, params);
    console.log("Fetched appointment full list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointment full list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};
const getApptPassed = async (req, res) => {

  let query = `
    SELECT 
      pat.patient_fname AS patient_fname,
      appt.time AS appt_time,
      appt.appt_date AS appt_date,
      appt.appt_id AS appt_id,
      appt.status AS appt_status
    FROM doctor doc
    JOIN appointment appt ON appt.doc_id = doc.doc_id
    JOIN patient pat ON pat.patient_id = appt.patient_id
    WHERE appt.appt_date <= '2025-07-12' limit 4
  `;


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

  let query = `
    SELECT 
      pat.patient_fname AS patient_fname,
      appt.time AS appt_time,
      appt.appt_date AS appt_date,
      appt.appt_id AS appt_id,
      appt.status AS appt_status
    FROM patient pat
    JOIN appointment appt ON appt.patient_id = pat.patient_id
    WHERE appt.appt_date >= ?
  `;

  const params = [appt_date];

  if (appt_status && appt_status !== "all") {
    query += ` AND appt.status = ?`;
    params.push(appt_status);
  }

  try {
    const [rows] = await db.query(query, params);
    console.log("Fetched admin appointment list", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching admin appointment list:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getAllPatients = async (req, res) => {
  const { age, gender } = req.body;

  let query = `SELECT * FROM patient`;
  const params = [];

  if (age && age !== 'all' && gender && gender !== 'all') {
    query += ` WHERE age >= ? AND gender = ?`;
    params.push(age, gender);
  } else if (age && age !== 'all') {
    query += ` WHERE age >= ?`;
    params.push(age);
  } else if (gender && gender !== 'all') {
    query += ` WHERE gender = ?`;
    params.push(gender);
  }

  try {
    const [rows] = await db.query(query, params);
    console.log("Fetched all patients", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching all patients:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

const getAllRecords = async (req, res) => {
  const { rec_id, patient_id, patient_fname } = req.body;

  // Whitelist of allowed sort columns
  const allowedColumns = {
    rec_id: 'med.record_id',
    patient_id: 'pat.patient_id',
    patient_fname: 'pat.patient_fname'
  };

  const parseSortParam = (param) => {
    if (!param) return null;
    
    const [column, direction] = param.split(' ');
    const allowedDirection = ['asc', 'desc'].includes(direction?.toLowerCase()) 
      ? direction.toLowerCase() 
      : 'asc';
    
    if (allowedColumns[column]) {
      return `${allowedColumns[column]} ${allowedDirection}`;
    }
    return null;
  };

  const orderFields = [
    parseSortParam(rec_id),
    parseSortParam(patient_id),
    parseSortParam(patient_fname)
  ].filter(Boolean);

  let query = `
    SELECT 
      med.record_id,
      med.diagnosis,
      pat.patient_id,
      pat.patient_fname,
      med.treatment_code
    FROM medical_record med
    JOIN doctor doc ON doc.doc_id = med.doc_id
    JOIN patient pat ON pat.patient_id = med.patient_id
  `;

  if (orderFields.length > 0) {
    query += ` ORDER BY ${orderFields.join(", ")}`;
  }

  try {
    const [rows] = await db.query(query);
    console.log("Fetched all records", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching records:", error);
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
  getFullMedicalRecords,
  getTrendForVisits,
  getApptPassed
};
