var express = require('express');
var router = express.Router();
var senior = require('../api/senior');
var junior = require('../api/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/info', senior.cekSenior, senior.addInformasi);
router.put('/pelanggaran', senior.cekSenior, senior.updatePelanggaran);
router.get('/info', senior.cekSenior, senior.cekJunior, junior.getInfo);

module.exports = router;
