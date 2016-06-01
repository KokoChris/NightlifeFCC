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
let options2 = {
    uri: 'https://api.foursquare.com/v2/venues/explore',
    qs: {
        v: 20130815,
        near: 'Athens',
        query: 'bar',
        limit: 10,
        venuePhotos: 1,
        //        oauth_token: req.user.token
    }
}

router.get('/', function(req, res) {
    options.qs.near = req.query.location;
    req.session.location = req.query.location;


    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            let parsedBody = JSON.parse(body);
            let venues = parsedBody.response.groups[0].items;
            let venueIds = [];
            for (venue of venues) {

                venueIds.push(venue.venue.id);
            }
            let venues2 = [];
            venueIds.forEach((id) => {

                let checkinOptions = {

                    url: 'https://api.foursquare.com/v2/venues/' + id,
                    qs: {


                        oauth_token: 'ABXOZX1H54J5GDGCSITOYFGC1NER3YW11XY1RKHSRBWD2X3X',
                        v: Date.now()
                    },
                }
                request(checkinOptions, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        venues2.push(JSON.parse(body));
                    } else {
                        
                    }

                    if (venues2.length === venueIds.length) {
                         // res.send(venues2);
                         res.render('bars/index', { venues: venues2, location: capitalize(req.query.location) });

                    }
                })
            });



        } else {


            // res.send('Something went wrong');
        }
    });
})



router.get('/checkin', (req, res) => {
    let checkinOptions = {
        url: 'https://api.foursquare.com/v2/venues/4b3a4ffff964a5205f6425e3/like',
        qs: {

            oauth_token: 'ABXOZX1H54J5GDGCSITOYFGC1NER3YW11XY1RKHSRBWD2X3X',
            set: 0,
            v: Date.now()
        },
        method: "POST"
    }
    request(checkinOptions, (error, response, body) => {
        console.log(body);
        if (!error && response.statusCode === 200) {

            res.redirect("/bars?location=" + req.session.location)
        } else {
            console.log(JSON.parse(body));
            res.send(error);
        }
    })

})

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function chooseOptions() {
    if (req.user) {
        var queryOptions = options2;
        queryOptions.qs.oauth_token = req.user.token
    } else {
        var queryOptions = options;
    }
}

module.exports = router;
