/* eslint-disable no-console */
/*eslint-disable no-unused-vars */

if (!process.env.NODE_ENV) process.env.NODE_ENV = "dev";
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config");
const apiRouter = require("./routes/api");
const cors = require("cors");
const path = require("path");

let db;

if(process.env.NODE_ENV === "test") {
 
  db = config.DB.test;

} 
else if (process.env.NODE_ENV === "dev") {
  
  db = config.DB.dev;

}
else {
  db = process.env.db;
}

app.use(cors());

app.use(express.static("public"));

mongoose.Promise = Promise;

mongoose.connect(db)
  .then(() => console.log("successfully connected to", process.env.NODE_ENV))
  .catch(err => console.log("connection failed", err));

app.use(bodyParser.json());

app.get("/", function(req, res, next){
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {

  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {

  if(err.statusCode){

    return res.status(err.statusCode).send({message : err.message});

  }
  else { res.status(500).send({err});}
    
});

module.exports = app;