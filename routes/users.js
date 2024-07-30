var express = require('express');
const db = require("../database/db");
const apiQueries = require("../database/apiQueries");
const {response} = require("express");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getCustomerList',async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_get_customer_list,'')
    res.status(200).send(result.rows)
  }
  catch(error){
    res.status(200).send(error)
  }
})

module.exports = router;
