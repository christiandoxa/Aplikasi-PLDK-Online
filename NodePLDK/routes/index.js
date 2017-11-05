var express = require('express');
var router = express.Router();
var senior = require('../api/senior');
var junior = require('../api/user');
var io = require('socket.io')();
var ws = io
    .on('connection', function (socket) {
        junior.getInfo(function (err, informasi) {
            if (err) {
                console.log(err);
            } else {
                console.log('sending data');
                socket.emit('dataInfo', informasi);
            }
        });
        socket.on('disconnect', function () {
            console.log('disconnected');
        });
    });

var cekSenior = function (req, res, next) {
    if (req.role === 'senior') {
        next();
    } else {
        res.status(401).json({status: false, result: "Not Authorized"});
    }
};

var cekJunior = function (req, res, next) {
    if (req.role === 'junior') {
        next();
    } else {
        res.status(401).json({status: false, result: "Not Authorized"});
    }
};

var sendDataInfo = function () {
    junior.getInfo(function (err, informasi) {
        if (err) {
            console.log(err);
        } else {
            console.log('sending data');
            socket.emit('dataInfo', informasi);
        }
    });
};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use(senior.cekUser, function (req, res, next) {
    if (req.authorized) {
        next();
    } else {
        res.status(401).json({status: false, result: "Not Authorized"});
    }
});

router.get('/login', function (req, res) {
    res.status(200).json({status: true});
});
router.post('/info', cekSenior, senior.addInformasi, function (req, res) {
    sendDataInfo();
});
router.put('/pelanggaran', cekSenior, senior.updatePelanggaran, function (req, res) {
    sendDataInfo();
});
router.put('/info', cekSenior, senior.updateInfo, function (req, res) {
    sendDataInfo();
});
router.put('/detail', cekSenior, senior.updatedetail, function (req, res) {
    sendDataInfo();
});
router.post('/detail', cekSenior, senior.insertDetail, function (req, res) {
    sendDataInfo();
});

module.exports = {
    route: router,
    ws: io
};
