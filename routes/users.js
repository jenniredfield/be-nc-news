var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const usersRouter = require("express").Router();
const findUser = require("../controllers/users.controller");

usersRouter.route("/:username")
  .get(findUser);

module.exports = usersRouter;