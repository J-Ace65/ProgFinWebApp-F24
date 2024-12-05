
const mysql = require('mysql2/promise');
// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '02051218Ejc!!',
    database: 'project_pt3',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

module.exports=pool;
