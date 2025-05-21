import express from "express";
const router = express.Router();
import db from "../models/db.js";

// a route to fetch top 2 doctors by number of patients seen in the past year.
router.get("/top-doctors", async (req, res) => {
  let top = 2;
  const query = `
SELECT d.doc_fname, COUNT(DISTINCT a.patient_id) AS patient_count
FROM doctor d
JOIN appointment a ON d.doc_id = a.doc_id
WHERE a.appt_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY d.doc_id, d.doc_fname
ORDER BY patient_count DESC
LIMIT ${top};
  `;
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No doctors found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching top doctors:", error);
    return res.status(500).send("Error fetching top doctors");
  }
});

//In what months are the highest number of surgeries conducted?
router.get("/surgery-months", async (req, res) => {
  let treatment_type = "surgery";
  const query = `SELECT MONTHNAME(date) AS surgery_month, COUNT(*) AS surgery_count
FROM treatment_procedure
WHERE description LIKE '%${treatment_type}%'
GROUP BY MONTH(date), MONTHNAME(date)
HAVING COUNT(*) = (
    SELECT MAX(surgery_count) FROM (
        SELECT COUNT(*) AS surgery_count
        FROM Treatment_Procedure
        WHERE description LIKE '%Surgery%'
        GROUP BY MONTH(date)
    ) AS monthly_counts
);`;
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No surgeries found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching surgery months:", error);
    res.status(500).send("Error fetching surgery months");
  }
});

// 6.	Identify the supplier whose items stayed in inventory the longest on average.
router.get("/longest-inventory", async (req, res) => {
  let limit = req.query.limit || 1;
  let order = req.query.order || "asc";
  const query = `
select m.drug_name,s.supplier_name,s.supp_id,i.supplied_date,round(TIMESTAMPDIFF(DAY, i.supplied_date, CURDATE())/30) as duration
from inventory as i join medication as m on i.drug_id=m.drug_id
join supplier as s on s.supp_id=i.supp_id
order by i.supplied_date ${order}
limit ${limit};
    `;

  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No suppliers found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching longest inventory:", error);
    res.status(500).send("Error fetching longest inventory");
  }
});

// fetch all doctors
router.get("/", async (req, res) => {
  const query = "SELECT * FROM doctor";

  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No doctors found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Error fetching doctors");
  }
});
// fetch all patients
router.get("/patients", async (req, res) => {
  let q;
  if (req.query.age == "all" && req.query.gender == "all") {
    q = "SELECT * FROM patient";
  } else if (req.query.age == "all" && req.query.gender == "male") {
    q = `SELECT * FROM patient where gender='male'`;
  } else if (req.query.age == "all" && req.query.gender == "female") {
    q = `SELECT * FROM patient where gender='female'`;
  } else if (req.query.age != "all" && req.query.gender == "all") {
    q = `SELECT * FROM patient where age >=${parseInt(req.query.age)}`;
  } else if (req.query.age != "all" && req.query.gender != "all") {
    q = `SELECT * FROM patient where age >=${parseInt(
      req.query.age
    )} and gender='${req.query.gender}'`;
  }

  try {
    const [result] = await db.query(q);

    if (result.length === 0) {
      return res.status(404).send("No patients found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send("Error fetching patients");
  }
});

//fetch patients by grouping by age
router.get("/patients/age", async (req, res) => {
  const query = `SELECT age,COUNT(*) AS count FROM patient GROUP BY age`;
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No patients found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching patients by age:", error);
    res.status(500).send("Error fetching patients by age");
  }
});

//fetch patients by grouping in gender
router.get("/patients/by-gender", async (req, res) => {
  const query = `SELECT gender,COUNT(*) AS count FROM patient GROUP BY gender`;
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No patients found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching patients");
  }
});
//select treatment procedures grouping by month name
router.get("/treatment-procedures", async (req, res) => {
  const year = req.query.year;
  console.log(req.query);
  const query = `select description, monthname(date) as Month_Name,Count(description) as count
from treatment_procedure where year(date)=${year} group by monthname(date),description
order by monthname(date);`;
  try {
    const [result] = await db.query(query);
    // if (result.length === 0) {
    //   return res.status(404).send("No treatment procedures found");
    // }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching treatment procedures:", error);
    res.status(500).send("Error fetching treatment procedures");
  }
});

// fetch all inventory along with medication and supplier
router.get("/inventory", async (req, res) => {
  const query = `select s.supplier_name,m.drug_name,i.supplied_date,i.expiration_date,i.quantity,i.invent_id
from inventory as i join medication as m on m.drug_id=i.drug_id
join supplier as s on s.supp_id=i.supp_id
order by supplied_date;`;
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).send("No inventory found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).send("Error fetching inventory");
  }
});
// fetch medication grouped by type, counting the number of medications in each type supplied per month
router.get("/supply-trend", async (req, res) => {
  const year = req.query.year;
  const query = `select monthname(i.supplied_date) as month,sum(i.quantity) as total_supply,m.drug_name as Drug_Name
from inventory as i join medication as m on m.drug_id=i.drug_id where year(i.supplied_date)=${year}
group by monthname(i.supplied_date),m.drug_name
order by month(i.supplied_date);`;

  try {
    const [result] = await db.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching supply trend:", error);
    res.status(500).send("Error fetching supply trend");
  }
});

//fetch drug name,supplier name, and patients who used the drug between two dates
router.get("/medication-used-between", async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const supplierName = req.query.supplierName;
  const query = `SELECT DISTINCT
  m.drug_id,
  m.drug_name,
  p.patient_fname,
  s.supplier_name,
  t.date
FROM medication AS m
JOIN inventory AS i ON i.drug_id = m.drug_id
JOIN supplier AS s ON i.supp_id = s.supp_id
JOIN treatment_procedure AS t ON t.drug_id = m.drug_id
JOIN patient AS p ON p.patient_id = t.patient_id
WHERE s.supplier_name = '${supplierName}'
AND t.date BETWEEN '${startDate}' AND '${endDate}';`;
  try {
    const [result] = await db.query(query);
    // if (result.length === 0) {
    //   return res.status(404).send("No medications found");
    // }
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error("Error fetching medication used between dates:", error);
    res.status(500).send("Error fetching medication used between dates");
  }
});
// register patient
router.post("/register-patient", async (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    gender,
    email,
    phone,
    birthDate,
    insuranceProvider,
    age,
  } = req.body;
  const query = `INSERT INTO patient (patient_fname, patient_lname,gender,age,phone_num,email,insurance,birth_date)

 VALUES ('${firstName}', '${lastName}','${gender}','${age}','${phone}','${email}','${insuranceProvider}','${birthDate}')`;

  try {
    const [result] = await db.query(query);
    if (result.affectedRows === 0) {
      return res.status(404).send("No patients found");
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send("Error fetching patients");
  }
});
// now export the router
// authenticate logged in user
router.post("/login", async (req, res) => {
  const { email,userType } = req.body;
  console.log(email,userType);

  let query;
  if (userType == "patient") {
    query = `SELECT * FROM patient WHERE email='${email}'`;
  } else if (userType == "doctor") {
    query = `SELECT * FROM doctor WHERE email='${email}'`;
  } else {
    console.log(" something went wrong");
  }

  try {
    const [result] = await db.query(query);
    console.log(result);
    if (result.length === 0) {
      return res.status(404).send("No user found");
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send("Error fetching patients");
  }
});
export default router;
