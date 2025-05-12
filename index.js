// repo: https://github.com/Johannes613/HMS_Backend.git
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = 3000;
const cors=require('cors');
const db =require('./models/db');
app.use(cors());// Enable CORS for all routes

app.use(express.json());


app.get('/dept', (req, res) => {
  const insert_table_query = `INSERT INTO Department(dept_id,dept_name) VALUES (1999,'Cardiology')`;
  db.query(insert_table_query, (err, res) => {
    if (err) {
      console.error('Error inserting into table:', err);
      return res.status(500).send('Error inserting into table');
    }
    console.log('Data inserted successfully');
    console.log(res);
  })
});
 
app.get('/patients', (req, res) => {
  const select_query = 'SELECT * FROM patient';
  db.query(select_query, (err, result) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).send('Error fetching patients');
    }
    console.log('Patients fetched successfully');
    console.log(result)
    res.json(result);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
