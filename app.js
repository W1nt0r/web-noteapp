var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const hbs = require("hbs");
const moment = require('moment-timezone');
const session = require('express-session');

const notes = require('./routes/notesRoutes');

var app = express();

hbs.registerHelper('formatDate', (date, format) => {
    return moment(date).tz("Europe/Zurich").format(format);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: "N0te_aPp-W3d", resave: false, saveUninitialized: true }));
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", notes);
app.use("/stylesheets/theme-choose.css", (req, res) => {
    if(req.session.theme) {
        let theme = req.session.theme;
        if(theme == "dark") {
            res.sendFile(__dirname + "/public/stylesheets/theme-dark.css");
        } else {
            res.sendFile(__dirname + "/public/stylesheets/theme-light.css");
        }
    } else {
        req.session.theme = "light";
        res.sendFile(__dirname + "/public/stylesheets/theme-light.css");
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
