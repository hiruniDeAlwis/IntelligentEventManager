const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/jwt");
const database = require("../databaseHandle/connectDatabase");
const mysql = require("mysql");
const tableSchema = require("../databaseHandle/tableSchema");
const conDetails = require("../config/database");

const con = mysql.createConnection(conDetails.conDetails);
//Register
router.post("/register", (req, res, next) => {
  const newUser = [
    req.body.username,
    req.body.password,
    req.body.name,
    req.body.email
  ]; //// new object for hold user registration data
  database.addNewUser(newUser, function(err, user) {
    if (err) {
      res.json({ success: false, msg: "User name exist" });
    } else {
      res.json({ success: true, msg: "User registerd" });
    }
  });
});

router.post("/registercompany", (req, res, next) => {
  console.log("company");
  const newCompany = [
    req.body.name,
    req.body.address,
    req.body.email,
    req.body.phonenumber
  ]; //// new object for hold user registration data
  database.addNewCompany(newCompany, function(err, user) {
    if (err) {
      res.json({ success: false, msg: "company name exist" });
    } else {
      res.json({ success: true, msg: "company registerd" });
    }
  });
});

router.post("/registerparticipant", (req, res, next) => {
  console.log("participant");
  const newParticipant = [
    req.body.fname,
    req.body.lname,
    req.body.address,
    req.body.email,
    req.body.phonenumber,
    req.body.employeeid,
    req.body.company
  ]; //// new object for hold user registration data
  database.addNewParticipant(newParticipant, function(err, user) {
    if (err) {
      res.json({ success: false, msg: "User name exist" });
    } else {
      res.json({ success: true, msg: "User registerd" });
    }
  });
});

// Paticipant scan details

router.post("/scandetails", (req, res, next) => {
  const prticipentDetails = [req.body.id];
});

router.post("/registerevent", (req, res, next) => {
  console.log("events");
  const newEvent = [
    req.body.company,
    req.body.eventName,
    req.body.location,
    req.body.date,
    req.body.time
  ]; //// new object for hold user registration data
  database.addNewEvent(newEvent, function(err, user) {
    if (err) {
      res.json({ success: false, msg: "Event exist" });
    } else {
      res.json({ success: true, msg: "Event registerd" });
    }
  });
});

//Add compnay

//authenticate
router.post("/authenticate", (req, res, next) => {
  username = req.body.username;
  password = req.body.password;
  database.selectUser(username, function(err, user) {
    if (err) {
      throw err;
    } else {
      //console.log(user);
      //console.log(user.length);
      if (user.length === 0) {
        res.json({ success: false, msg: "User not Found" });
      } else {
        console.log(user[0].password);
        database.comparePassword(password, user[0].password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          /*
          if(password==user[0].password){
              isMatch=true;
          }
          else{
              isMatch=false;
          }*/
          console.log(isMatch);
          if (isMatch) {
            const token = jwt.sign(toObject(user), config.secret, {
              expiresIn: 604800 //1week
            });
            //console.log(token);
            console.log(user[0]);
            res.json({
              success: true,
              token: "JWT " + token,
              user:
                user[0] /*{
                        name: user[0].name,
                        username : user[0].username,
                        email:user[0].email
                    }*/,
              userName: user[0].userName,
              userType: user[0].userType
            });
          } else {
            res.json({ success: false, msg: "Wrong password" });
          }
        });
      }
    }
  });
});

//Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: true }),
  function(req, res, next) {
    res.json({ user: req.user });
  }
);

router.get("/companyDetails", (req, res) => {
  con.query("SELECT * from companyDetails", (err, rows, fields) => {
    if (!err) res.json(rows);
    else console.log(err);
  });
});

router.get("/eventDetails", (req, res) => {
  con.query("SELECT * from eventsDetails", (err, rows, fields) => {
    if (!err) res.json(rows);
    else console.log(err);
  });
});

router.post("/deleteUser", (req, res) => {
  con.query(
    "DELETE FROM userData WHERE userName = ?",
    [req.body.userName],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/deleteCompany", (req, res) => {
  con.query(
    "DELETE FROM companyDetails WHERE companyName = ?",
    [req.body.companyName],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/deleteEvent", (req, res) => {
  con.query(
    "DELETE FROM eventsDetails WHERE eventName = ?",
    [req.body.eventName],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/deleteParticipant", (req, res) => {
  con.query(
    "DELETE FROM participantsDetails WHERE employeeid = ?",
    [req.body.employeeId],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/changeUserType", (req, res) => {
  let user = req.body;
  var sql = `UPDATE userData SET userType =? WHERE userName =?`;
  con.query(sql, [user.userType, user.userName], (err, row, fields) => {
    if (!err) res.json(row);
    else console.log(err);
  });
});

router.post("/updateCompany", (req, res) => {
  let company = req.body;
  var sql =
    "UPDATE companyDetails SET companyAddress = ?, companyEmail = ?, phonenumber = ? WHERE companyName = ?";
  con.query(
    sql,
    [
      company.companyAddress,
      company.companyEmail,
      company.phonenumber,
      company.companyName
    ],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/updateEvent", (req, res) => {
  let event = req.body;
  var sql =
    "UPDATE eventsDetails SET company = ?, location = ? , date = ? , time = ? WHERE eventName = ?";
  con.query(
    sql,
    [event.company, event.location, event.date, event.time, event.eventName],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.post("/updateParticipant", (req, res) => {
  let participant = req.body;
  var sql =
    "UPDATE participantsDetails SET fname = ? , lname = ? , address = ? , email = ? , phonenumber = ?, company = ? WHERE employeeid = ?";

  con.query(
    sql,
    [
      participant.fname,
      participant.lname,
      participant.address,
      participant.email,
      participant.phonenumber,
      participant.company,
      participant.employeeId
    ],
    (err, row, fields) => {
      if (!err) res.json(row);
      else console.log(err);
    }
  );
});

router.get("/userInformations", (req, res) => {
  con.query(
    'SELECT name,userName,emai,userType FROM `userdata` WHERE userType != "admin" OR userType IS NULL',
    (err, rows, fields) => {
      if (!err) res.json(rows);
      else console.log(err);
    }
  );
});

router.get("/participantsDetails", (req, res) => {
  con.query("SELECT * from participantsDetails", (err, rows, fields) => {
    if (!err) res.json(rows);
    else console.log(err);
  });
});

module.exports = router;

function toObject(user) {
  return {
    name: user[0].name,
    username: user[0].userName,
    password: user[0].password,
    email: user[0].emai
  };
}

function toObject(company) {
  return {
    name: company[0].companyName,
    address: company[0].companyAddress,
    email: company[0].companyEmail
  };
}
