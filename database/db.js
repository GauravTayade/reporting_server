const { Pool,Client } = require('pg');

const pool = new Pool({
  user:"postgres",
  password:"rootuser",
  host:"10.3.22.38",
  port:5432,
  database:"reporting_crawler"
});

// const openConnection = async () =>{
//   await client.connect()
//     .then(()=>{
//       console.log("connected to database")
//     })
//     .catch(error  => {
//       console.log(error)
//     })
// }
const query = async(text,params) => {
  const res = await pool.query(text,params)
  return res
}

// const closeConnection = async () =>{
//   await client.end()
//     .then(()=>{
//       console.log("connection has been closed")
//     })
//     .catch(error => {
//       console.log(error)
//     })
// }

// module.exports = { openConnection, query, closeConnection}

module.exports = {
  query: (text,params) => pool.query(text,params)
}