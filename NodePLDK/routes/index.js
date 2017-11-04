var express = require('express');
var router = express.Router();
var senior = require('../api/senior');
var junior = require('../api/user');

var cekSenior = function (req, res, next) {
    if (req.role === 'senior') {
        next();
    } else {
        res.status(401).json({status: false, result: "Not Authorized"});
    }
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
router.post('/info', cekSenior, senior.addInformasi);
router.put('/pelanggaran', cekSenior, senior.updatePelanggaran);
router.put('/info', cekSenior, senior.updateInfo);
router.put('/detail', cekSenior, senior.updatedetail);
router.post('/detail', cekSenior, senior.insertDetail);
router.get('/info', junior.getInfo);

module.exports = router;
