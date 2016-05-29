const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/foursquare',
    passport.authenticate('foursquare'));

router.get('/foursquare/callback',
    passport.authenticate('foursquare', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    })

module.exports = router;