var express = require('express')
var favicon = require('serve-favicon')
var serveStatic = require('serve-static')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
//var mongoStore = require('connect-mongo')(session)
var fs = require('fs')
var path = require('path')

var app = express()
var port = process.env.PORT || 3000

var dbUrl = 'mongodb://localhost/imooc'
mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)
app.set('views', './app/views/pages')
app.set('view engine', 'jade')

app.use(favicon(__dirname + '/public/images/favicon.ico'))

app.use(bodyParser.urlencoded({ extended: true }))// parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(cookieParser())
app.use(session({
  secret: 'movieofshouliang',
  resave: false,
  saveUninitialized: true
}))

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  //mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
app.use(serveStatic(path.join(__dirname, 'public')))

console.log('imooc started on port ' + port)

