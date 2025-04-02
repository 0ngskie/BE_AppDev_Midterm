const express = require('express');
const app = express();
const port_number = 4000;

// Middleware Setup
app.use(express.json());

// Routes
const userRoute = require('./routes/userRoute');
const paymentRoute = require('./routes/paymentRoute');

// Address
app.use('/users', userRoute);
app.use('/payments', paymentRoute);

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Running the server
app.listen(port_number, () => {
    console.log(`Server running at http://localhost:${port_number}`);
});


//npm install
//Make a .env
//DB_HOST, DB_USER, DB_DATABASE

//npm install mysql
//node index.js (To Run)
