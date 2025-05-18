import db from '../models/db.js';

const getMedicationStat = async (req, res) => {
    let startDate = '2020-10-03';
    let endDate = '2023-10-05';
    const query =`select 
	supp.supplier_name as supplier_name,
    med.drug_name as drug_name
	from 
    medication med
    join inventory invt on med.drug_id = invt.drug_id
    join supplier supp on supp.supp_id = invt.supp_id
    where  supp.supplier_name = 'Gulf Pharma'and med.supplied_date between date(${startDate}) and date(${endDate});`

    try{
        const [rows] = await db.query(query);
        console.log("Fetched medication stat:", rows);
        res.status(200).json(rows);
    }
    catch(error){
        console.error("Error fetching medication stat:", error);
        res.status(500).json({ error: "Internal server error while fetching" });
    }   
}

const getTopStat = async (req, res) => {
    const query = `
    SELECT 
        dept.dept_name AS dept_name,
        dept.dept_id AS dept_id,
        bill.total_cost AS total_cost
    FROM department dept
    JOIN billing bill ON dept.dept_id = bill.dept_id
    ORDER BY bill.total_cost DESC
    LIMIT 2;
  `;
  try {
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching department billing stats", err);
    res.status(500).json({ error: "Internal server error" });
  }  
}
const getTopDoc = async (req, res) => {
    const query = `
    SELECT
  doc.doc_id AS doc_id,
  doc.doc_fname AS doc_fname,
  COUNT(DISTINCT appt.patient_id) AS patient_count
FROM appointment appt
JOIN doctor doc ON appt.doc_id = doc.doc_id
WHERE appt.appt_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY doc.doc_id, doc.doc_fname
ORDER BY patient_count DESC
LIMIT 2;`;
  try {
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching doc top stats", err);
    res.status(500).json({ error: "Internal server error" });
  }  
}
export {getMedicationStat, getTopStat, getTopDoc};