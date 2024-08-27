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

router.get('/getCustomer',async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_get_customer_details,[req.query.customerCode])
    res.status(200).send(result.rows)
  }
  catch(error){
    res.status(200).send({error:error})
  }
})

router.get ('/getCustomerReportDetails',async(req,res)=>{
  try{
    const result = await db.query(apiQueries.get_customer_report_details,[req.query.reportId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})

router.get("/getCustomerReports", async (req,res)=>{
  try{

    let result = null

    //let qur = 'SELECT CL.id AS client_id, CR.id AS report_id,CL.name AS customer_name,CL.code AS customer_code,CR.created_at AS report_date,CR.format AS report_type,CR.description AS report_description, CR.is_reviewed AS report_reviewed,CR.is_delivered AS report_delivered,CR.is_pending AS report_pending, CR.from AS start_date,CR.to AS end_date,R.name AS report_occurance_name, R.type AS report_occurance FROM "ClientReport" AS CR JOIN "Client" AS CL ON CR.client_id = CL.id JOIN "Report" AS R ON CR.report_id = R.id'
    let qur = 'SELECT CL.id AS client_id, CRC.id AS report_id, CL.name AS customer_name, CRC.created_at AS report_date, CRC.format AS report_formate, CRC.description AS report_description, CRC.is_reviewed AS report_reviewed, CRC.review_requested AS report_review_requested, CRC.is_delivered AS report_delivered, CRC.is_pending AS report_pending, CRC.from AS start_date, CRC.to AS end_date, R.name AS report_occurance_name, R.type AS report_occurance FROM "ClientReportCollection" AS CRC JOIN "ClientReport" AS CR ON CRC.cr_id = CR.id JOIN "Client" AS CL ON CR.client_id = CL.id JOIN "Report" AS R ON CR.report_id = R.id'
    if(req.query.is_pending === 'false' && req.query.is_reviewed === 'false' && req.query.is_delivered === 'false')
    {
      if(req.query.searchByClientName){
        qur += ' WHERE CR.client_id IN ('+req.query.searchByClientName+')'
      }
      if(req.query.searchByReportFormat){
        qur += ' AND CRC.format IN ('+req.query.searchByReportFormat+')'
      }

      if(req.query.searchByReportOccurrence){
        qur += ' AND R.type IN ('+req.query.searchByReportOccurrence+')'
      }

    }else{
      if (req.query.is_reviewed) {
        qur += ' WHERE CRC.is_reviewed = ' + req.query.is_reviewed
      }

      if (req.query.is_pending) {
        qur += ' AND CRC.is_pending = ' + req.query.is_pending
      }

      if (req.query.is_delivered) {
        qur += ' AND CRC.is_delivered = ' + req.query.is_delivered
      }

      if(req.query.searchByClientName){
        qur += ' AND CR.client_id IN ('+req.query.searchByClientName+')'
      }
      if(req.query.searchByReportFormat){
        qur += ' AND CRC.format IN ('+req.query.searchByReportFormat+')'
      }

      if(req.query.searchByReportOccurrence){
        qur += ' AND R.type IN ('+req.query.searchByReportOccurrence+')'
      }
    }

    qur+=' ORDER BY CRC.id ASC LIMIT '+req.query.limit+' OFFSET '+req.query.offset

   result = await db.query(qur)
    //result = await db.query(apiQueries.query_get_customer_report_list,[req.query.limit, req.query.offset])

    res.status(200).send(result.rows)
  }
  catch(error){
    res.status(200).send(error)
  }
})

//mark report ready for review
router.post("/reportReadyReview",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_report_ready_for_review,[req.body.report_id])
    res.status(200).send(result)
  }catch (error){
    console.log(error)
  }
})

//mark report as reviewed
router.post("/reportReviewed",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_report_reviewed,[req.body.report_id])
    res.status(200).send(result)
  }catch (error){
    console.log(error)
  }
})

//mark report as delivered
router.post("/reportDelivered",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_report_delivered,[req.body.report_id])
    res.status(200).send(result)
  }catch (error){
    console.log(error)
  }
})

router.get("/reportStatus",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.get_customer_report_status_details,[req.query.reportId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})


module.exports = router;
