var db = require('../database/model');
var async = require('async');
var CryptoJS = require("crypto-js");
var validate = require("validate.js");
var regexEmail = /_(24rpl|24tkj|25rpl|25tkj|26rpl|26tkj)@student\.smktelkom-mlg\.sch\.id/;
const SUCCESS = true;
const FAIL = false;

function API() {
    this.cekUser = function (req, res, next) {
        let email = req.headers.email;
        if (email) {
            if (regexEmail.test(email)) {
                db.que('SELECT * FROM senior WHERE email=?', email, function (err, data) {
                    if (err) {
                        if (err == 'other') {
                            db.que('SELECT * FROM junior WHERE email=?', email, function (err, data) {
                                if (err) {
                                    if (err == 'other') {
                                        res.status(401).json({status: FAIL, result: "Not Authorized"});
                                    } else {
                                        res.status(400).json({status: FAIL, result: err});
                                    }
                                } else {
                                    req.authorized = true;
                                    req.role = 'junior';
                                    next();
                                }
                            })
                        } else {
                            res.status(400).json({status: FAIL, result: err});
                        }
                    } else {
                        req.authorized = true;
                        req.role = 'senior';
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

    this.addInformasi = function (req, res) {
        let lokasi_koordinasi = req.body.lokasi_koordinasi;
        if (lokasi_koordinasi) {
            async.waterfall([
                function (callback) {
                    db.que('SELECT * FROM informasi', null, function (err, data) {
                        if (err) {
                            if (err == 'other') {
                                callback(null, true);
                            } else {
                                callback(err, null);
                            }
                        } else {
                            callback(null, false);
                        }
                    });
                },
                function (isEmpty, callback) {
                    if (!isEmpty) {
                        db.que('DELETE FROM informasi', null, function (err, data) {
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
                    } else {
                        callback(null);
                    }
                },
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
                    let i = 0;
                    let informasi = "";
                    if (typeof req.body.informasi === 'string' && req.body.informasi !== "") {
                        try {
                            informasi = JSON.parse(req.body.informasi);
                            insertDetailInfo();
                        } catch (e) {
                            callback(e.message);
                        }
                    } else if (typeof req.body.informasi === 'object' && req.body.informasi !== null) {
                        informasi = req.body.informasi;
                        insertDetailInfo();
                    } else {
                        callback(null);
                    }

                    function insertDetail() {
                        if (i < informasi.length) {
                            db.que('INSERT INTO detail_informasi VALUES (?,?,?,?)', [null, idInformasi, informasi[i].judul, informasi[i].informasi], function (err, data) {
                                if (err) {
                                    if (err == 'other') {
                                        i++;
                                        insertDetail();
                                    } else {
                                        callback(err);
                                    }
                                } else {
                                    i++;
                                    insertDetail();
                                }
                            });
                        } else {
                            callback(null);
                        }
                    }

                    function insertDetailInfo() {
                        if (informasi && Array.isArray(informasi)) {
                            if (informasi.length <= 3) {
                                insertDetail();
                            } else {
                                callback("Maximum info's are 3");
                            }
                        } else {
                            callback('informasi param is not an array');
                        }
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
            res.status(400).json({status: FAIL, result: "params not found"});
        }
    };

    this.updatePelanggaran = function (req, res) {
        let jumlahPelanggaran = req.body.jumlah;
        let aksi = req.body.aksi;
        if (aksi) {
            async.waterfall([
                function (callback) {
                    db.que('SELECT jumlah_pelanggaran FROM informasi', null, function (err, data) {
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
                        query = 'UPDATE informasi SET jumlah_pelanggaran = ? ' + action + ' ?';
                        preparedStatement = [jumlah, jumlahPelanggaran];
                    } else {
                        query = 'UPDATE informasi SET jumlah_pelanggaran = ? ' + action + ' 1';
                        preparedStatement = [jumlah];
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
    };

    this.updateInfo = function (req, res) {
        let lokasi = req.body.lokasi_koordinasi;
        if (lokasi) {
            db.que('UPDATE informasi SET lokasi_koordinasi = ?', lokasi, function (err, data) {
                if (err) {
                    if (err == 'other') {
                        res.status(200).json({status: SUCCESS});
                    } else {
                        res.status(400).json({status: FAIL, result: err});
                    }
                } else {
                    res.status(200).json({status: SUCCESS});
                }
            })
        } else {
            res.status(400).json({status: FAIL, result: "Params not found"});
        }
    };

    this.updatedetail = function (req, res) {
        let idDetail = req.body.id_detail;
        let informasi = req.body.informasi;
        let judul = req.body.judul;
        if (informasi && judul && idDetail) {
            db.que('UPDATE detail_informasi SET judul = ?, informasi = ? WHERE id_detail_informasi = ?', [judul, informasi, idDetail], function (err, data) {
                if (err) {
                    if (err == 'other') {
                        res.status(200).json({status: SUCCESS});
                    } else {
                        res.status(400).json({status: FAIL, result: err});
                    }
                } else {
                    res.status(200).json({status: SUCCESS});
                }
            });
        } else {
            res.status(400).json({status: FAIL, result: "Params not found"});
        }
    };

    this.insertDetail = function (req, res) {
        let idInformasi = req.body.id_informasi;
        let informasi = "";
        if (typeof req.body.informasi === 'string' && req.body.informasi !== "") {
            try {
                informasi = JSON.parse(req.body.informasi);
            } catch (e) {
                res.status(400).json({status: FAIL, result: e.message});
            }
        } else if (typeof req.body.informasi === 'object' && req.body.informasi !== null) {
            informasi = req.body.informasi;
        } else {
            informasi = null;
        }

        if (idInformasi && informasi) {
            if (Array.isArray(informasi)) {
                async.waterfall([
                    function (callback) {
                        db.que('SELECT COUNT(*) AS jumlahDetail FROM detail_informasi', null, function (err, data) {
                            if (err) {
                                if (err == 'other') {
                                    callback(null, 3);
                                } else {
                                    callback(err, null);
                                }
                            } else {
                                callback(null, 3 - data[0].jumlahDetail);
                            }
                        });
                    },
                    function (sisa, callback) {
                        if (sisa > 0) {
                            if (informasi.length <= sisa) {
                                let i = 0;

                                function insertDetail() {
                                    if (i < informasi.length) {
                                        db.que('INSERT INTO detail_informasi VALUES (?,?,?,?)', [null, idInformasi, informasi[i].judul, informasi[i].informasi], function (err, data) {
                                            if (err) {
                                                if (err == 'other') {
                                                    i++;
                                                    insertDetail();
                                                } else {
                                                    callback(err);
                                                }
                                            } else {
                                                i++;
                                                insertDetail();
                                            }
                                        });
                                    } else {
                                        callback(null);
                                    }
                                }

                                insertDetail();
                            } else {
                                callback("Maximum detail's that can be inserted are " + sisa);
                            }
                        } else {
                            callback("Maximum detail has been exceeded");
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
                res.status(400).json({status: FAIL, result: "informasi param is not an array"})
            }
        } else {
            res.status(400).json({status: FAIL, result: "Params not found"});
        }
    }
}

module.exports = new API();