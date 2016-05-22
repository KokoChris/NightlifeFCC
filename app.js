var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(function(req, res, next) {

    res.locals.currentUser = req.user;
    next();
});


var client_id = '3RFULQTUSF5EOKZFGFRF2WNCC5LBUJW2D55HIVROUAYZXNB5';
var client_secret = 'KN3RBJGKKAGZITCWN3R1UV2QL43JJ1AONKBF2YH5XGEDMAZG';
var options = {
    uri: 'https://api.foursquare.com/v2/venues/explore',
    qs: {
        client_id: client_id,
        client_secret: client_secret,
        v: 20130815,
        near: 'Athens',
        query: 'bar',
        limit: 10,
        venuePhotos: 1
    }
}



app.get('/', function(req, res) {

    res.render('landing')
});



app.post('/bars', function(req, res) {

    options.qs.near = req.body.location;

    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var parsedBody = JSON.parse(body);

            var venues = parsedBody.response.groups[0].items;

            res.render('bars/index', { venues: venues, location: capitalize(req.body.location) });
        } else {


            res.send('Something went wrong');
        }
    });
})

app.get('/api/bars', function(req, res) {

    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var parsedBody = JSON.parse(body);

            var venues = parsedBody.response.groups[0].items;

            res.json(venues);
        } else {


            res.send('Something went wrong');
        }
    });
})


function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

app.listen(port, function() {
    console.log('server is running on port ' + port);
});
