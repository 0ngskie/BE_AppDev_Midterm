//Local Server with Port 4000
const express = require('express');

const app = express();

const port_number = 4000;

//Middleware Setup
app.use(express.json());

//Routes
const userRoute = require('./routes/userRoute');
const plansRoute = require('./routes/plansRoute');

//Address
app.use('/users', userRoute);
app.use('/plans', plansRoute);


//Running
app.listen(port_number, () => {
    console.log(`Server: http://localhost:${port_number}`)
})

//npm install
//Make a .env
//DB_HOST, DB_USER, DB_DATABASE

//npm install mysql
//node index.js (To Run)

//March 31 2025 9:37pm Update details:
//1. Modified everything to accomodate the new database scheme


