const usersRouter = require("express").Router();
const findUser = require("../controllers/users.controller");

usersRouter.route("/:username")
  .get(findUser);

module.exports = usersRouter;