import express from "express";
const router = express.Router();
import db from "../model/db.js";

// a route to fetch top 2 doctors by number of patients seen in the past year.
router.get("/top-doctors", async (req, res) => {
  let top = 2;
  const query = `
SELECT d.doc_name, COUNT(DISTINCT a.patient_id) AS patient_count
FROM doctor d
JOIN appointment a ON d.doc_id = a.doc_id
WHERE a.appt_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY d.doc_id, d.doc_name
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
  let limit = 1;
  let order = "DESC";
  const query = `
    SELECT s.supplier_name, AVG(DATEDIFF(i.expiration_date, m.supplied_date)) AS avg_duration_days
FROM Inventory i
JOIN Medication m ON i.drug_id = m.drug_id
JOIN Supplier s ON i.supp_id = s.supp_id
GROUP BY s.supp_id, s.supplier_name
ORDER BY avg_duration_days ${order}
LIMIT ${limit};
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

// now export the router
export default router;
