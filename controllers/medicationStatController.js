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
    const query =`select 
	dept.dept_name as dept_name,
    dept.dept_id as dept_id,
    bill.total_cost as total_cost
	from department dept
    join billing bill 
    on dept.dept_id = bill.dept_id
    order by bill.total_cost desc
    limit 2;`

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
export {getMedicationStat, getTopStat};