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
    var venueOptions = req.venueOptions;
    rp(options)
        .then(data => getVenuesUrlList(JSON.parse(data)))
        .then(urlList => {
            let venues = [];
            urlList.forEach((url) => {
                venueOptions.url = url;
                request(venueOptions, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        venues.push(JSON.parse(body));
                        if (venues.length === urlList.length) {
                            res.render('bars/index', { venues: venues, location: capitalize(req.query.location) });

                        }
                    } else {
                        console.log(error);
                    }


                })
            })
        })
        .catch(err => console.log(err))

});

router.get('/checkin', checkUser, handleCheckinOptions, (req, res) => {

    rp(req.searchOptions)
        .then(data => {
            let parsedBody = JSON.parse(data);
            if (parsedBody.response.venue.like === true) {
                req.checkinOptions.qs.set = 0;
                return rp(req.checkinOptions);
            } else {
                req.checkinOptions.qs.set = 1;
                return rp(req.checkinOptions);

            }

        })
        .then(res.redirect("/bars?location=" + req.session.location))
        .catch(err => res.send(err.message));



});



function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function decideOptions(req, res, next) {
    let options;
    let venueOptions;
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

function handleCheckinOptions(req, res, next) {

    req.searchOptions = requestOptions.venueWithUser;
    req.searchOptions.qs.oauth_token = req.user.token;
    req.searchOptions.url = 'https://api.foursquare.com/v2/venues/' + req.query.barId;
    req.checkinOptions = requestOptions.checkinOptions;
    req.checkinOptions.url = 'https://api.foursquare.com/v2/venues/' + req.query.barId + '/like';
    req.checkinOptions.qs.oauth_token = req.user.token;
    req.checkinOptions.qs.set = 1;

    next();
}


let getVenuesUrlList = (parsedBody) => {

    return new Promise((resolve, reject) => {
        let venuesList = parsedBody.response.groups[0].items;

        let venuesUrlList = []
        for (let venue of venuesList) {
            let url = 'https://api.foursquare.com/v2/venues/' + venue.venue.id;

            venuesUrlList.push(url);
        }

        resolve(venuesUrlList);
    })
}
module.exports = router;
