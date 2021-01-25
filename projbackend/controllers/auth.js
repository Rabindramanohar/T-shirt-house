const User = require('./../models/user');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body);
    // console.log(user.name, user.email, user._id);
    user.save((err, user) => {
        if(err) {
            return  res.status(400).json({
                err: "NOT able save user in DB",
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req, res) => {

    const {email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User email does not exit!!",
            });
        }

        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password doesn't matches!!",
            })
        }

        // create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, {expire: new Date() + 999});

        // send response to frontend
        const { _id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role} });
    });


};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "you are logged out!!"
    });
}

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
})

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    // console.log(req);
    if(!checker) {
        return res.status(403).json({
            error: "ACCES DENIED!!",
        })
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "NOT AN ADMIN!!",
        });
    }
    next();
}