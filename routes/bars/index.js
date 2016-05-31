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
   uri:'https://api.foursquare.com/v2/venues/explore',
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
    if (req.user) {
      var  queryOptions = options2;
      queryOptions.qs.oauth_token = req.user.token
    } else {
      var  queryOptions = options;
    }
    queryOptions.qs.near = req.query.location;
    req.session.location = req.query.location;
    
    request(queryOptions, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            let parsedBody = JSON.parse(body);
            let venues = parsedBody.response.groups[0].items;
            res.render('bars/index', { venues: venues, location: capitalize(req.query.location) });
        } else {

            console.log(error);
            res.send('Something went wrong');
        }
    });
})

router.get('/api/bars/explore', function(req, res) {
        
    options.qs.near = req.query.location;
    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            let parsedBody = JSON.parse(body);
            let venues = parsedBody.response.groups[0].items;
            res.json(parsedBody);
        } else {
            res.send('Something went wrong');
        }
    });
})

router.get('/api/bars/search', function(req, res) {
    options.qs.near = req.query.location;
    options.uri =  'https://api.foursquare.com/v2/venues/search';   
    request(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            let parsedBody = JSON.parse(body);
//            let venues = parsedBody.response.groups[0].items;
            res.json(parsedBody);
        } else {
            res.send('Something went wrong');
        }
    });
})



router.get('/api/bars/searchOne', (req, res) => {
    let checkinOptions = {
        url: 'https://api.foursquare.com/v2/venues/4b3a4ffff964a5205f6425e3',
        qs: {
           

            oauth_token:'ABXOZX1H54J5GDGCSITOYFGC1NER3YW11XY1RKHSRBWD2X3X',
            v: Date.now()
        },
    }
    request(checkinOptions, (error,response,body) => {
        console.log(body);
        if (!error && response.statusCode === 200 ) {

            res.send(JSON.parse(body));
        } else {
            console.log(JSON.parse(body));
            res.send(error);
        }
    })
} )



router.get('/checkin', (req, res) => {
    let checkinOptions = {
        url: 'https://api.foursquare.com/v2/venues/4b3a4ffff964a5205f6425e3/like',
        qs: {
           
            oauth_token:'ABXOZX1H54J5GDGCSITOYFGC1NER3YW11XY1RKHSRBWD2X3X',
            set: 0,
            v: Date.now()
        },
        method: "POST"
    }
    request(checkinOptions, (error,response,body) => {
        console.log(body);
        if (!error && response.statusCode === 200 ) {

            res.redirect("/bars?location="+ req.session.location)
        } else {
            console.log(JSON.parse(body));
            res.send(error);
        }
    })

})

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}


module.exports = router;
