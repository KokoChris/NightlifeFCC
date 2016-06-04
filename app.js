'use strict';
const express = require('express');
const app = express();
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const passport = require('passport');
const barRoutes = require('./routes/bars');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const session = require('./session');

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
require('./auth')();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
   	res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    next();
});




app.use('/bars', barRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', function(req, res) {
   
    res.render('landing', { user: req.user || "" })

});
app.listen(port, () => {
    console.log('server is running on port ' + port);
});
