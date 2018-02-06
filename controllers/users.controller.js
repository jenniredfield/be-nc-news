const mongoose = require('mongoose');
const Users = require('../models/users')
const models = require('../models/models')

function findUser(req, res, next) {
    
    const user = req.params.username;

    Users.findOne({username : user})
        .then(user => {
            res.send(user);
        })
}

module.exports = findUser;