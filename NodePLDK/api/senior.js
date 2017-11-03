var db = require('../database/model');
var async = require('async');
var CryptoJS = require("crypto-js");
var validate = require("validate.js");
var regexEmail = /_(24rpl|24tkj|25rpl|25tkj|26rpl|26tkj)@student\.smktelkom-mlg\.sch\.id/;
const SUCCESS = true;
const FAIL = false;

function API() {
    this.cekSenior = function (req, res, next) {
        let email = req.headers.email;
        if (email) {
            if (regexEmail.test(email)) {
                db.que('SELECT * FROM senior WHERE email=?', email, function (err, data) {
                    if (err) {
                        if (err == 'other') {
                            req.authorized = false;
                            next();
                        } else {
                            res.status(400).json({status: FAIL, result: err});
                        }
                    } else {
                        req.authorized = true;
                        next();
                    }
                })
            } else {
                res.status(400).json({status: FAIL, result: "Email is wrong"});
            }
        } else {
            res.status(400).json({status: FAIL, result: "Email not inserted"});
        }
    };

    this.cekJunior = function (req, res, next) {
        let email = req.headers.email;
        if (email) {
            if (!req.authorized) {
                if (regexEmail.test(email)) {
                    db.que('SELECT * FROM junior WHERE email=?', email, function (err, data) {
                        if (err) {
                            if (err == 'other') {
                                res.status(401).json({status: FAIL, result: "Not Authorized"});
                            } else {
                                res.status(400).json({status: FAIL, result: err});
                            }
                        } else {
                            next();
                        }
                    })
                } else {
                    res.status(400).json({status: FAIL, result: "Email is wrong"});
                }
            } else {
                next();
            }
        } else {
            res.status(400).json({status: FAIL, result: "Email not inserted"});
        }
    };

    this.addInformasi = function (req, res) {
        let lokasi_koordinasi = req.body.lokasi_koordinasi;
        let informasi = req.body.informasi;
        if (lokasi_koordinasi && informasi) {
            async.waterfall([
                function (callback) {
                    db.que('INSERT INTO informasi VALUES (?,?,?)', [null, lokasi_koordinasi, 0], function (err, data) {
                        if (err) {
                            if (err == 'other') {
                                callback(null, data.insertId);
                            } else {
                                callback(err, null);
                            }
                        } else {
                            callback(null, data.insertId);
                        }
                    });
                },
                function (idInformasi, callback) {
                    db.que('INSERT INTO detail_informasi VALUES (?,?,?)', [null, idInformasi, informasi], function (err, data) {
                        if (err) {
                            if (err == 'other') {
                                callback(null, data.insertId);
                            } else {
                                callback(err, null);
                            }
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function (err) {
                if (err) {
                    res.status(400).json({status: FAIL, result: err});
                } else {
                    res.status(200).json({status: SUCCESS});
                }
            });
        } else {
            res.status(400).json({status: FAIL, result: "params not found"});
        }
    };

    this.updatePelanggaran = function (req, res) {
        let idInformasi = req.body.id_informasi;
        let jumlahPelanggaran = req.body.jumlah;
        let aksi = req.body.aksi;
        if (idInformasi && aksi) {
            async.waterfall([
                function (callback) {
                    db.que('SELECT jumlah_pelanggaran FROM informasi WHERE id_informasi = ?', idInformasi, function (err, data) {
                        if (err) {
                            if (err == 'other') {
                                callback("ID doesn't exist", null);
                            } else {
                                callback(err, null);
                            }
                        } else {
                            if (aksi == "kurang" && data[0].jumlah_pelanggaran <= 0) {
                                callback("There isn't any violation", null);
                            } else {
                                callback(null, data[0].jumlah_pelanggaran);
                            }
                        }
                    });
                },
                function (jumlah, callback) {
                    let query = '';
                    let preparedStatement = [];
                    let action = '';
                    let update = true;
                    if (aksi == "tambah") {
                        action = '+';
                    } else if (aksi == "kurang") {
                        action = '-';
                    } else {
                        update = false;
                        callback("Wrong action");
                    }
                    if (jumlahPelanggaran) {
                        query = 'UPDATE informasi SET jumlah_pelanggaran = ? ' + action + ' ? WHERE id_informasi = ?';
                        preparedStatement = [jumlah, jumlahPelanggaran, idInformasi];
                    } else {
                        query = 'UPDATE informasi SET jumlah_pelanggaran = ? ' + action + ' 1 WHERE id_informasi = ?';
                        preparedStatement = [jumlah, idInformasi];
                    }
                    if (update) {
                        db.que(query, preparedStatement, function (err, data) {
                            if (err) {
                                if (err == 'other') {
                                    callback(null);
                                } else {
                                    callback(err);
                                }
                            } else {
                                callback(null);
                            }
                        });
                    }
                }
            ], function (err) {
                if (err) {
                    res.status(400).json({status: FAIL, result: err});
                } else {
                    res.status(200).json({status: SUCCESS});
                }
            });
        } else {
            res.status(400).json({status: FAIL, result: "Params not found"});
        }
    }
}

module.exports = new API();