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

let db;

if(process.env.NODE_ENV === "test") {
 
  db = "mongodb://localhost/northcoders-news-api-test";

} 
else if (process.env.NODE_ENV === "dev") {
  
  db = "mongodb://localhost/northcoders-news-api";

}
else {
  db = process.env.db;
}


app.use(cors());

mongoose.Promise = Promise;

mongoose.connect(db)
  .then(() => console.log("successfully connected to", process.env.NODE_ENV))
  .catch(err => console.log("connection failed", err));

app.use(bodyParser.json());

app.get("/", function(req, res, next){
  res.send("Your server works!");
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {

  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {

  if(err.statusCode){
    console.log(err.message);
    return res.status(err.statusCode).send({message : err.message});

  }
  else { res.status(500).send({err});}


    
});

module.exports = app;