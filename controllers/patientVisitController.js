import db from "../models/db.js";
const getPatientVisitTrend = async (req, res) => {
  const query = `select 
	year(appt.appt_date) as visit_year,
    month(appt.appt_date) as visit_month,
    dept.dept_name as dept_name,
    pat.gender as gender,
    CASE
        WHEN TIMESTAMPDIFF(YEAR, pat.birth_date, CURDATE()) < 18 THEN 'Child'
        WHEN TIMESTAMPDIFF(YEAR, pat.birth_date, CURDATE()) BETWEEN 18 AND 59 THEN 'Adult'
        ELSE 'Senior'
    END AS age_group,
    count(*) as total_visits
from department dept 
join doctor doc on dept.dept_id = doc.dept_id
join appointment appt on appt.doc_id = doc.doc_id
join patient pat on appt.patient_id = pat.patient_id
where appt.appt_date >= date_sub(curdate(),interval 3 year)
group by dept_name,visit_month,gender,age_group
order by visit_year desc;`;

  // const query= `SELECT NOW() AS current_time;`;
  try {
    const [rows] = await db.query(query);
    console.log("Fetched patient visit trend:", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching patient visit trend:", error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
};

export default getPatientVisitTrend;
