require('rootpath')()
var express = require('express');
var router = express.Router();

router.use('/', function (req,res,next) {
    // TODO: /app 호출전에 처리할 내용 여기 삽입

    next();
});

// serve files from app folder
router.use('/', express.static('app'));

module.exports = router;
