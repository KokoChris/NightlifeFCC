const config = require('../../config');
const client_id = config.foursquare.clientID;
const client_secret = config.foursquare.clientSecret;


let exploreUserless = {
    uri: 'https://api.foursquare.com/v2/venues/explore',
    qs: {
        client_id: client_id,
        client_secret: client_secret,
        v: Date.now(),
        near: 'Athens',
        query: 'bar',
        limit: 10,
        venuePhotos: 1
    }
}

let exploreWithUser = {
    uri: 'https://api.foursquare.com/v2/venues/explore',
    qs: {
        v: Date.now(),
        near: 'Athens',
        query: 'bar',
        limit: 10,
        venuePhotos: 1,
        oauth_token: ''
    }
}

let venueWithUser = {
    url: 'https://api.foursquare.com/v2/venues/',
    qs: {

        oauth_token: '',
        v: Date.now()
    }
}

let venueWithoutUser = {
    url: 'https://api.foursquare.com/v2/venues/',
    qs: {
        client_id: client_id,
        client_secret: client_secret,
        v: Date.now()
    }

}

let checkinOptions = {
    url: 'https://api.foursquare.com/v2/venues/',
    qs: {
        oauth_token: '',
        set: 0,
        v: Date.now(),
    },
    method: 'POST'
}

module.exports = {
    exploreUserless,
    exploreWithUser,
    venueWithUser,
    venueWithoutUser,
    checkinOptions
}
