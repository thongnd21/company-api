const express = require("express");
const bodyParser = require("body-parser");
var session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3002;
// const db = require("./config/db-connection");
var cors = require("cors");
const { google } = require('googleapis');
// const { GoogleAuth } = require('google-auth-library');
var http = require('http').Server(app);
// const { auth } = require('google-auth-library');
const fs = require('fs');
const readline = require('readline');
// const { GoogleToken } = require('gtoken');
const { JWT } = require('google-auth-library');
const db = require("./config/company-connection");

http.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
app.use(
  cors({
    credentials: true,
    origin: true
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  session({
    secret: "123",
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 3600,
      secure: false
    }
  })
);
// swaggerDOC(app);
//db
// db.dbConnectionGmHRS().authenticate()
//   .then(res => {
//       console.log("db connected");
//   })
//     .catch(err => console.log("error: " + err));

// Account routes
app.use("/api", require("./routers"));
// app.get("/", function(req, res){
//   res.sendFile(__dirname +'/googlea5a397b0cace9851.html');
// });
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// main().catch(console.error);
