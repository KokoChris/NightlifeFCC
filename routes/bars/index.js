const express = require('express');
const router = express.Router();
const config = require('../../config')
const request = require('request');


const client_id = config.foursquare.clientID;
const client_secret = config.foursquare.clientSecret;
let options = {
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


router.post('/', function(req, res) {
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

router.get('/api/bars', function(req, res) {

    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            let parsedBody = JSON.parse(body);

            let venues = parsedBody.response.groups[0].items;
            res.json(venues);
        } else {
            res.send('Something went wrong');
        }
    });
})




function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}


module.exports = router;