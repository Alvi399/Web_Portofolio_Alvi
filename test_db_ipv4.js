require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing MySQL connection with 127.0.0.1...');
  
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });
    console.log('Successfully connected to MySQL server using 127.0.0.1.');
    await connection.end();
  } catch (err) {
    console.error('Connection failed with 127.0.0.1!');
    console.error('Error code:', err.code);
    console.error('Error sqlMessage:', err.sqlMessage);
  }
}

testConnection();
