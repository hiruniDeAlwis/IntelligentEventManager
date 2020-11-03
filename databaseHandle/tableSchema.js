const tables = {
  userData: {
    createUserTable:
      "CREATE TABLE userData(userName varchar(10),password varchar(100),name varchar(50), emai varchar(20), userType varchar(10), CONSTRAINT pk_userData PRIMARY KEY (userName))",
    createCompanyTable:
      "CREATE TABLE companyDetails(companyName varchar(50), companyAddress varchar(200), companyEmail varchar(50) , phonenumber varchar(20),CONSTRAINT pk_compantData PRIMARY KEY(companyName))",
    createParticipants:
      "CREATE TABLE participantsDetails(fname varchar(50),lname varchar(50),address varchar(50),email varchar(50), phonenumber varchar(50) , employeeid varchar(50), company varchar(100), CONSTRAINT pk_participantsData PRIMARY KEY(employeeid))",
    createEventsTable:
      "CREATE TABLE eventsDetails(company varchar(50),eventName varchar(50),location varchar(50),date varchar(50), time varchar(50) , CONSTRAINT pk_participantsData PRIMARY KEY(eventName, date))",
    insertintoParticipantsTable:
      "INSERT INTO participantsDetails(fname,lname,address,email,phonenumber,employeeid,company) VALUES ?",
    insertIntoUserTable:
      "INSERT INTO userData(userName,password,name,emai) VALUES ?",
    insertIntoCompanyTable:
      "INSERT INTO companyDetails(companyName,companyAddress,companyEmail,phonenumber) VALUES ?",
    insertIntoEventTable:
      "INSERT INTO eventsDetails(company,eventName,location,date,time) VALUES ?",
    SelectUser: "SELECT * from userdata WHERE userName =",
    SelectParticipants: "SELECT * from participantsDetails",
    SelectCompany: "SELECT * from companyDetails",
    SelectUsers: 'SELECT * from userData WHERE userType != "admin"',
    updateUserType: "UPDATE userData SET userType = ? WHERE userName = ?"
  }
};

module.exports.tables = tables;
