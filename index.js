const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan')

let makeToken = require('./Helpers/Token.js')

const PORT = process.env.PORT || 3000;
const app = express();
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));

// const csrfMiddleware = csurf({
//   sessionKey: 'sessionID',
//   cookie: true,
//   ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
// });

app.use(session({
  name: 'sessionID',
  secret: 'SLIITSSDKt2HA454tYPW',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'))
app.use(cookieParser());
// app.use(csrfMiddleware);

// error handler
// app.use(function (err, req, res, next) {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err)

//   // handle CSRF token errors here
//   res.status(403)
//   res.send('Invalid CSRF found!')
// })

// index page
app.get('/', function(req, res) {
    res.render('views/index');
});
app.get('/form', function(req, res) {
    res.render('views/form');
});
app.get('/message', function(req, res) {
    res.render('views/message');
});
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });
// app.get('/form', function(req, res) {
//   console.log(req.session.csrf);
//   res.sendFile(path.join(__dirname + '/form.html'));
// });
// app.get('/message', function(req, res) {
//   console.log(req.session.csrf);
//   res.sendFile(path.join(__dirname + '/message.html'));
// });
// app.get('/message_success', function(req, res) {
//   console.log(req.session.csrf);
//   res.sendFile(path.join(__dirname + '/message-success.html'));
// });
// app.get('/message_fail', function(req, res) {
//   console.log(req.session.csrf);
//   res.sendFile(path.join(__dirname + '/message-fail.html'));
// });


app.get('/token', function(req, res) {
  console.log(req.session.csrf);
  res.json(req.session.csrf);
});

app.post('/login', function (req, res) {
  console.log(req.body);
  console.log(req.sessionID);
  if (req.body.username == "ssd" && req.body.password == "ssd123") {
    res.cookie('username', req.body.username);

    let token = makeToken(50);
    console.log(token);
    req.session.csrf = token;
    res.redirect('form');
  } else {
    res.status(401).end();
  }
})

app.post('/formsubmit', function(req, res) {
  console.log(req.body);
  let msgTxt = '';
  let reason = '';
  let className = '';
  if (req.session.csrf == req.body._csrf) {
    msgTxt = 'Your contact information has been successfully added!';
    reason = 'CSRF token is valid!';
    className = 'success';
  } else {
    msgTxt = 'Your contact information is invalid.';
    reason = 'Valid CSRF token required!';
    className = 'fail';
  }
  res.render('views/message', { msgTxt: msgTxt, reason: reason, className: className });
})


app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

