const mongoose = require('mongoose');
const Users = require('../models/users')
const models = require('../models/models')

function findUser(req, res, next) {
    
    const user = req.params.username;

    Users.findOne({username : user})
        .then(user => {
            if(user === null) { return next({statusCode: 404, message: "User not found"})}

            res.send(user);

        }).catch((error)=>{
            next(error)
        })
}

module.exports = findUser;