if(process.env.NODE_ENV === 'production'){
  module.exports = {
    host:process.env.host || "",
    dbURI: process.env.dbURI,
    sessionSecret: process.env.sessionSecret,
    foursquare:{
    	clientID: process.env.fsClientID,
    	clientSecret: process.env.fsClientSecret,
    	callbackURL: process.env.host + "/auth/foursquare/callback",
    	profileFields:['id','displayName','photos']
    }
  }


} else {

  module.exports = require('./development.json');

}
