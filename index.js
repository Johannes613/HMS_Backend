// repo: https://github.com/Johannes613/HMS_Backend.git
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = 3000;
const cors=require('cors');

app.use(cors());// Enable CORS for all routes

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hospital Management System Running');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
