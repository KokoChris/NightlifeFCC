var express = require('express');
var request = require('request');
var app = express();

var port = process.env.PORT || 3000;

app.get('/',function(req,res){

 request('https://api.foursquare.com/v2/venues/search?client_id=3RFULQTUSF5EOKZFGFRF2WNCC5LBUJW2D55HIVROUAYZXNB5&client_secret=KN3RBJGKKAGZITCWN3R1UV2QL43JJ1AONKBF2YH5XGEDMAZG&v=20130815&near=Athens&query=bar&limit=10',function(error,response,body){
 	if(!error && response.statusCode ===200){
 		var parsedBody = JSON.parse(body);

 		res.send(parsedBody);
 	}else{

 		console.log(error,response.statusCode);	
 		res.send('bales');
 	}
 });
});


app.listen(port,function(){
    console.log('server is running on port ' + port );
});


