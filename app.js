var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/',function(req,res){
    res.send('giwnia');
});


app.listen(port,function(){
    console.log('server is running on port ' + port );
});


