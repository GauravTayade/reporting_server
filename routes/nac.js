var express = require('express');
var router = express.Router();
const db = require('../database/db');
const apiQueries = require("../database/apiQueries");

router.get("/getNACCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_nac_count,[req.query.customerId,req.query.startDate, req.query.endDate]);
    res.status(200).send(result.rows)
  }
  catch(error){
    res.status(500).send(error)
  }
})

router.get("/getNACDataSourceDetails",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_nac_data_source_details,[req.query.customerId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(500).send(error)
  }
})

router.get("/getClientNAC",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_nac_metrics,'')
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(500).send(error)
  }
})

router.get("/getNACMetrics",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_nac_metrics,'')
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(500).send(error)
  }
})

router.get("/getNACLogIngestionCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_nac_log_ingestion_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
    res.status(500).send(error)
  }
})

module.exports = router