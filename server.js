var pmx = require('pmx'); pmx.init();

var express = require('express')
  , http = require('http')
  , https = require('https') // Added for HTTPS
  , path = require('path')
  , fs = require('fs')
  , inspect = require('util').inspect
  , logger = require('./lib/logger.js')
  , helmet = require('helmet') // Added for security headers
  , rateLimit = require('express-rate-limit') // Added for rate limiting
  ;

var app      = express();

// Use Helmet to secure Express apps by setting various HTTP headers
app.use(helmet());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {pretty: true});
app.set('port', process.env.PORT || 8888);
app.set('title', 'cloudcv.io');

app.use(express.static(path.join(__dirname, 'public')));

// Static pages
app.get('/',         function(req, res) { res.render('index');    });
app.get('/about',    function(req, res) { res.render('about');    });
app.get('/privacy',  function(req, res) { res.render('privacy');  });
app.get('/docs',     function(req, res) { res.render('api-docs'); });

// Demo endpoints:
app.all('/demo/analysis', limiter, function(req, res) { // Added rate limiter

    res.render('demo-analysis',
    {
        "example":  { "availableImages": [
            "/images/lena.png",
            "/images/mandrill.png",
            "/images/sudoku.png",
            "/images/kid.jpg"
        ] } 
    });
});

// Use HTTPS instead of HTTP
https.createServer(app).listen(app.get('port'), function(){
  logger.log("cloudcv.io server listening on port " + app.get('port'));
});