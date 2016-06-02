const express = require('express');
const router = express.Router();
const config = require('../../config')
const request = require('request');
const requestOptions = require('./config');

const client_id = config.foursquare.clientID;
const client_secret = config.foursquare.clientSecret;






router.get('/', decideOptions, function(req, res) {


    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            let parsedBody = JSON.parse(body);
            let venuesList = parsedBody.response.groups[0].items;
            let venueIds = [];

            for (venue of venuesList) {
                venueIds.push(venue.venue.id);
            }
            let venues = [];
            venueIds.forEach((id) => {

                let venueOptions = {

                    url: 'https://api.foursquare.com/v2/venues/' + id,
                    qs: {

                        client_id: client_id,
                        client_secret: client_secret,
                        // oauth_token: req.user.token,
                        v: Date.now()
                    },
                }
                request(venueOptions, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        venues.push(JSON.parse(body));
                    } else {

                    }

                    if (venues.length === venueIds.length) {
                        res.render('bars/index', { venues: venues, location: capitalize(req.query.location) });

                    }
                })
            });

        } else {
            // res.send('Something went wrong');
        }
    });
})



router.get('/checkin', (req, res) => {

    if (req.user) {
        let checkinOptions = {
            url: 'https://api.foursquare.com/v2/venues/' + req.query.barId + '/like',
            qs: {

                oauth_token: req.user.token,
                set: 1,
                v: Date.now()
            },
            method: "POST"
        }
        request(checkinOptions, (error, response, body) => {

            if (!error && response.statusCode === 200) {

                res.redirect("/bars?location=" + req.session.location)
            } else {

                res.send(error);
            }
        })

    } else {
        res.redirect('/bars?location=' + req.session.location);
    }



})

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}



function decideOptions(req, res, next) {
    if (req.user) {
        options = requestOptions.exploreWithUser;
        options.qs.oauth_token = req.user.token;


    } else {
        options = requestOptions.exploreUserless;
        // venueOptions = requestOptions.venueWithoutUser;

    }

    options.qs.near = req.query.location;
    req.session.location = req.query.location;
    next();
}

module.exports = router;
