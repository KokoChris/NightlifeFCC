const express = require('express');
const router = express.Router();
const config = require('../../config')
const request = require('request');
const rp = require('request-promise')
const requestOptions = require('./config');

const client_id = config.foursquare.clientID;
const client_secret = config.foursquare.clientSecret;






router.get('/', decideOptions, (req, res) => {
    let options = req.options;
    let venueOptions = req.venueOptions;

    request(options, (error, response, body) => {

        if (!error && response.statusCode === 200) {
            let parsedBody = JSON.parse(body);
            let venuesList = parsedBody.response.groups[0].items;

            let venueIds = [];
            for (venue of venuesList) {
                venueIds.push(venue.venue.id);
            }
            let venues = [];
            venueIds.forEach((id) => {

                venueOptions.url = 'https://api.foursquare.com/v2/venues/' + id;

                request(venueOptions, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        venues.push(JSON.parse(body));
                        if (venues.length === venueIds.length) {
                            res.render('bars/index', { venues: venues, location: capitalize(req.query.location) });

                        }
                    } else {
                        res.send(error)
                    }


                })
            });

        } else {
            res.send(error);
        }
    });
})



router.get('/checkin', checkUser, (req, res) => {

    let checkinOptions = {
            url: 'https://api.foursquare.com/v2/venues/' + req.query.barId + '/like',
            qs: {
                oauth_token: req.user.token,
                set: 1,
                v: Date.now()
            },
            method: "POST"
        }
   
    rp(checkinOptions)
        .then(res.redirect('/bars/?location=' + req.session.location))
        .catch((err) => res.send(err));


});

router.get('/test', (req, res) => {

    rp(requestOptions.exploreUserless)
        .then((papa) => res.send(papa))
        .catch((err) => res.send(err));


})


function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function decideOptions(req, res, next) {
    var options;
    var venueOptions;
    if (req.user) {
        options = requestOptions.exploreWithUser;
        options.qs.oauth_token = req.user.token;

        venueOptions = requestOptions.venueWithUser;
        venueOptions.qs.oauth_token = req.user.token;

    } else {
        options = requestOptions.exploreUserless;
        venueOptions = requestOptions.venueWithoutUser;

    }

    options.qs.near = req.query.location;
    req.session.location = req.query.location;
    req.options = options;
    req.venueOptions = venueOptions;

    next();
}


function checkUser(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/bars?location=" + req.session.location)

    }
}
module.exports = router;
