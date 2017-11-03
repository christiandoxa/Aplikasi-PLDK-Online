var mysql = require("mysql");

function Connection() {

    this.pool = null;
    var pass = "";

    if (process.env.NODE_ENV != "development") {
        pass = process.env.PASS_DB.substring(0, 1) + "#" + process.env.PASS_DB.substring(1);
    }

    var konek = {
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: pass,
        database: 'db_pldk'
    };

    this.init = function () {
        this.pool = mysql.createPool(konek);
    }

    this.acquire = function (callback) {
        this.pool.getConnection(function (err, connection) {
            callback(err, connection);
        });
    };

}

module.exports = new Connection();
