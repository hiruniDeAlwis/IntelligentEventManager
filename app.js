const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const mysql = require("mysql");

const database = require("./databaseHandle/connectDatabase");

const db = require("./config/database");

database.connect();
const app = express(); // starting the express server

const users = require("./routes/users");
const port = 5000; // the port which running the server

//CORS middleware
app.use(cors());

//Set Static folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser miidleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/users", users);

//Index route
app.get("/", (req, res) => {
  res.send("invalid Endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Start server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
