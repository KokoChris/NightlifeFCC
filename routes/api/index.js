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

router.get('/bars/explore', function(req, res) {
    if(req.query.location){
             options.qs.near = req.query.location;
    }    
    request(options, (error, response, body) => {

        if (!error && response.statusCode === 200) {

            let parsedBody = JSON.parse(body);
            let venues = parsedBody.response.groups[0].items;
            res.json(parsedBody);
        } else {
            res.send(body);
        }
    });
})

router.get('/bars/search', (req, res) => {
    if(req.query.location){

        options.qs.near = req.query.location;
    
    }
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



router.get('/bars/searchOne', (req, res) => {
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


module.exports = router ;