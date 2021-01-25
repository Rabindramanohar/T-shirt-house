const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {signout, signup, signin, isSignedIn} = require('./../controllers/auth');


router.post('/signup', [
    
    check("name", "name should be at least 3 characters").isLength({min: 3}),
    check("email", "correct email is required!!").isEmail(),
    check("password", "password field is required!!").isLength({min: 1}),
    
], signup);

router.post('/signin', [
    
    check("email", "correct email is required!!").isEmail(),
    check("password", "password should be at least 5 characters").isLength({min: 5}),
    
], signin);

router.get("/signout", signout);

router.get('/testroute', isSignedIn, (req, res) => {
    res.json(req.auth);
})

module.exports = router;
