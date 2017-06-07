require('rootpath')();

const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const env = process.env.NODE_ENV
const config = require('config.json')[env]

console.log("process.env.NODE_ENV ----> " + process.env.NODE_ENV)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

// routes
app.use('/app', require('server/controllers/app.controller'))
app.use('/sample', require('server/controllers/sample.controller'))


// make '/app' default routes
app.get('/', function(req, res) {
    return res.redirect('/app');
})

// server start
const server = app.listen(3000, function() {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
})