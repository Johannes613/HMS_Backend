import db from "../models/db.js";
const getPatientVisitTrend = async (req, res) => {
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

export default getPatientVisitTrend;
