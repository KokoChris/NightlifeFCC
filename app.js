'use strict';
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const passport = require('passport');
const barRoutes = require('./routes/bars');
const authRoutes = require('./routes/auth');
require('./auth')();

const session = require('./session');

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);




app.use(passport.initialize());
app.use(passport.session());



app.use(function(req, res, next) {
	console.log(req.user);
    res.locals.user= req.user;
    next();
});
app.use('/bars', barRoutes);
app.use('/auth', authRoutes);

app.get('/', function(req, res) {
   
    res.render('landing', { user: req.user })
});
app.listen(port, () => {
    console.log('server is running on port ' + port);
});
