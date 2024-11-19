const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost', // or your database host
    user: 'root', // your database user
    password: 'root', // your database password
    database: 'project'
});

module.exports= db