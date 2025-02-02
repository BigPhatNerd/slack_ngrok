require('dotenv').config();

const express = require("express");
var mongoose = require('mongoose');
var passport = require('./config/authentication.js');
var UserModel = require('./models/User.js');
var User = mongoose.model('User');
const app = express();
const session = require('express-session');
const path = require('path');
const request = require('request');
const { mongo, slack, url } = require('./lib/keys');
const cookieSession = require('cookie-session');
const cors = require("cors");
const connectDB = require('./config/db');
const routes = (require('./routes'));
const programRoutes = require('./routes/programs');
const weeklyGoals = require('./routes/weeklyGoals');
const homeviewRoutes = require('./routes/homeviewRoutes');
const finishedWorkouts = require('./routes/finishedWorkouts');
const goalReps = require('./routes/goalReps');
const sessions = require('./routes/session');
const getEverything = require('./routes/getEverything');
process.env.NODE_DEBUG = 'request';
const slackInteractions = require('./controller/message-handlers/slack-interactions.js')
const moreSlackInteractions = require('./controller/message-handlers/more-slack-interactions.js');
const static_select = require('./controller/message-handlers/static_select.js');
const buttons = require('./controller/message-handlers/buttons.js');

//ALL THIS SLACK EVENTS


const newVerification = require('./config/middleware/newVerification');

// mongoose will log all of our database queries to the console
// mongoose.set('debug', true);



const urlString = process.env.NODE_ENV === "production" ? url.production : url.development

var MongoStore = require("connect-mongo")(session);
const rawBodySaver = function(req, res, buf, encoding) {
    if(buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8')
    }
}
const cookieParser = require("cookie-parser");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ verify: rawBodySaver,extended: true }));
app.use(express.json({ verify: rawBodySaver }));
app.use('/slack/events', newVerification);
app.use('/slack/actions', [newVerification, slackInteractions.middleware, moreSlackInteractions.middleware, static_select.middleware, buttons.middleware]);


app.use(session({
    store: new MongoStore({
        url: mongo.dbURI,
        collection: 'sessions'
    }),
    secret: "my cust0m 5E5510N k3y",
    saveUninitialized: false,
    resave: false
}));


const PORT = process.env.PORT || 4390;

connectDB();

app.use(passport.initialize());
//Force SSL in https in Express
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(requireHTTPS);
// app.use(passport.session());
app.use(
    cors({
        origin: urlString,
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true
    })
);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", urlString);
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
require("./routes/api-routes.js")(app);
require('./routes/nodemailer.js')(app);
app.use('/', routes);
app.use('/programs', programRoutes);
app.use('/weeklyGoals', weeklyGoals);
app.use('/finishedWorkouts', finishedWorkouts);
app.use('/getEverything', getEverything);
app.use('/homeview', homeviewRoutes);
app.use('/goalReps', goalReps);
app.use('/session', sessions);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}




app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);

});

module.exports = express










//