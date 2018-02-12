const Users = require("../models/users");

function findUser(req, res, next) {
    
  const user = req.params.username;

  Users.findOne({username : user})
    .then(user => {
      if(user === null) { return next({statusCode: 404, message: "User not found"});}

      res.send(user);

    }).catch((error)=>{
      next(error);
    });
}

module.exports = findUser;