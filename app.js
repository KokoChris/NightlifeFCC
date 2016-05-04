var express = require('express');

var app = express();

var port = process.env.PORT || 3000,

app.get('/',function(req,res){
    res.redirect('/polls');
});


app.listen(port,function(){
    console.log('server is running on port ' + port );
});


