var express = require('express');
var url = require('url');
// var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');


var app = express();
var path = require('path');
var  _ = require('underscore');
// var methodOverride = require('method-override');

// app.use(bodyParser());          // pull information from html in POST
// app.use(methodOverride());      // simulate DELETE and PUT
app.use(cors());

// var ip = "127.0.0.1";
var ip = "192.168.0.5";
var port = process.env.PORT || 3000;
app.use(express.static(__dirname));


// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


console.log('listening on port ', port, 'and ip: ', ip)
app.listen(port, ip);

