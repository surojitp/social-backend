const jsonwebtoken = require('jsonwebtoken');
const keys = require('../config/keys')
const mongoose = require("mongoose");
const User = require('../models/User');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken.verify(token, keys.jwtKEY);
        req.user = decoded;
        //console.log(decoded);
        
        User.findById(decoded.id)
            .then(user => {
                //console.log(user)
                if (user) {
                    req.user = user;
                    next();
                }
                else{
                    return res.status(401).json({
                        message: "User not found"
                    })
                }
                
            })
            .catch(err => console.log(err))
        
    } catch (err) {
        return res.status(401).json({
            message: "Authentication Faild"
        })
    }
}