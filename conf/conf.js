var mysql = require("mysql");
var pool = mysql.createPool({
  host: '139.196.96.67',
  user: 'root',
  password: 'scpcxb',
  database: 'jiehang',
  port: 3306,
  multipleStatements: true
});

function query(sql, values = {}, callback) {
  pool.getConnection(function (err, connection) {
    connection.query(sql, values, function (err, rows) {
      if (err) {
        throw err;
      }
      callback(err, rows);
    });
    connection.release();
  });
}
exports.query = query;
