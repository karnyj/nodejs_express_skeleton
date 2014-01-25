var express = require('express');
var mongoStore = require('connect-mongo')(express);
var querystring = require('querystring');
var request = require('request');
var sprintf = require('sprintf').sprintf;
var partials = require('express-partials');

// The port that this express app will listen on
var port = process.env.PORT || 7464;



var hostBaseUrl = (process.env.HOST || 'http://localhost:' + port);

// Create an HTTP server
var app = express();


// Pick a secret to secure your session storage
var sessionSecret = 'peekaboo';

// Setup for the express web framework
app.configure(function() {
  // Use ejs instead of jade because HTML is easy
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.logger());
  app.use(express['static'](__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new mongoStore({
        url: 'mongodb://localhost/test-session'
    }),
    secret: sessionSecret
  }));
  app.use(app.router);
});

// We want exceptions and stracktraces in development
app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.get('/', function(req, res) {
  // Render out views/index.ejs, passing in the session
  res.render('index', {
    session: req.session
  });
});

app.listen(port);

console.log(sprintf('Listening at %s using API endpoint %s.', hostBaseUrl));
