require('rootpath')();
var express = require('express');
var router = express.Router();
const env = process.env.NODE_ENV || 'local'
var config = require('config.json')[env];
var sampleService = require('server/services/sample.service');

//routes
router.get('/location', getLocation);
router.post('/location', setLocation);

module.exports = router;

function getLocation(req, res) {
    sampleService.getLocation()   
        .then(function (data) {
            console.info("Data received: ", data)
            res.send({
                data: data
            });
        })
        .catch(function (err) {
            console.error("Error occurred: ", err)
            res.status(400).send({
                error: err
            });
        });
}
 
function setLocation(req, res) {
    sampleService.setLocation(req.body)
        .then(function (data) {
            console.info("Data received: ", data)
            res.send({
                data: data
            });
        })
        .catch(function (err) {
            console.error("Error occurred: ", err)
            res.status(400).send({
                error: err
            });
        });
}