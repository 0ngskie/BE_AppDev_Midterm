//Local Server with Port 4000
const express = require("express");

const app = express();

const port_number = 4000;

//Middleware Setup
app.use(express.json());

//Routes
const userRoute = require("./routes/userRoute");
const claimRoute = require("./routes/claimsRoute");

//Address
app.use("/users", userRoute);
app.use("/claims", claimRoute);

//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Running
app.listen(port_number, () => {
  console.log(`Server: http://localhost:${port_number}`);
});

//npm install
//Make a .env
//DB_HOST, DB_USER, DB_DATABASE

//npm install mysql
//node index.js (To Run)
