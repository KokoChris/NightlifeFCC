'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
const barRoutes = require('./routes/bars');
const authRoutes = require('./routes/auth');
const session = require('./session');

require('./auth')();



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use('/bars',barRoutes);
app.use('/auth',authRoutes);





app.get('/', function(req, res) {
    res.render('landing')
});





app.listen(port, function() {
    console.log('server is running on port ' + port);
});
