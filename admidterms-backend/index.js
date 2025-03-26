const express = require("express");

const app = express();
const port_number = 4000;

// Middleware Setup
app.use(express.json());

//Routes
const userRoute = require("./routes/userRoute");
const claimRoute = require("./routes/claimsRoute");

// Address
app.use("/users", userRoute);
app.use('/payments', paymentRoute);  
app.use("/claims", claimRoute);

// Running
app.listen(port_number, () => {
  console.log(`Server: http://localhost:${port_number}`);;
});;


//npm install

//Make a .env
//DB_HOST, DB_USER, DB_DATABASE

//node index.js (To Run)    
