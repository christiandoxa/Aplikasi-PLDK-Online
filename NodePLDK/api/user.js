var db = require('../database/model');
var async = require('async');
var CryptoJS = require("crypto-js");
var validate = require("validate.js");
var regexEmail = /_(24rpl|24tkj|25rpl|25tkj|26rpl|26tkj)@student\.smktelkom-mlg\.sch\.id/;
const SUCCESS = true;
const FAIL = false;

function API() {
    this.getInfo = function (req, res) {
        async.waterfall([
            function (callback) {
                db.que('SELECT * FROM informasi', null, function (err, data) {
                    if (err) {
                        if (err == 'other') {
                            callback('Still Empty', null);
                        } else {
                            callback(err, null);
                        }
                    } else {
                        callback(null, data);
                    }
                });
            },
            function (dataInformasi, callback) {
                let informasiFinal = [];
                let i = 0;

                function getDetail() {
                    if (i < dataInformasi.length) {
                        let tempDetail = [];
                        db.que('SELECT * FROM detail_informasi WHERE id_informasi=?', dataInformasi[i].id_informasi, function (err, data) {
                            if (err) {
                                if (err == 'other') {
                                    informasiFinal.push({
                                        id: dataInformasi[i].id_informasi,
                                        lokasiKoor: dataInformasi[i].lokasi_koordinasi,
                                        jumlahPelanggaran: dataInformasi[i].jumlah_pelanggaran,
                                        detail: tempDetail
                                    });
                                    i++;
                                    getDetail();
                                } else {
                                    callback(err, null);
                                }
                            } else {
                                for (let j = 0; j <= data.length; j++) {
                                    if (j < data.length) {
                                        tempDetail.push({
                                            judul: data[j].judul,
                                            informasi: data[j].informasi
                                        });
                                    } else {
                                        informasiFinal.push({
                                            id: dataInformasi[i].id_informasi,
                                            lokasiKoor: dataInformasi[i].lokasi_koordinasi,
                                            jumlahPelanggaran: dataInformasi[i].jumlah_pelanggaran,
                                            detail: tempDetail
                                        });
                                        i++;
                                        getDetail();
                                    }
                                }
                            }
                        });
                    } else {
                        callback(null, informasiFinal);
                    }
                }

                getDetail();
            }
        ], function (err, informasi) {
            if (err) {
                res.status(400).json({status: FAIL, result: err});
            } else {
                res.status(200).json({status: SUCCESS, result: informasi});
            }
        });
    }
}

module.exports = new API();