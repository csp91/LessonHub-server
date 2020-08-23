const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  paswword: '123456',
  database: 'postgres',
  host: 'localhost',
  port: 5555,
})

module.exports = pool
