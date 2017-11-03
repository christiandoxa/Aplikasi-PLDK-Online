var connection = require("./connection");
connection.init();

function Model() {
    this.que = function (quer, body, callback) {
        connection.acquire(function (err, con) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                con.query(quer, body, function (err, data) {
                    con.release();
                    if (err) {
                        return callback(err, null);
                    } else if (data.length > 0) {
                        return callback(null, data);
                    } else {
                        return callback('other', data);
                    }
                });
            }
        });
    };
};
module.exports = new Model();
