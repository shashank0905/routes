const mysql = require("mysql");
  
let db_con  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'SHASHAnk@23',
    database : 'mysql_db'
});
  
db_con.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
});
  
module.exports = db_con;