var express = require('express');
var router = express.Router();
const db = require('../database/db');
const apiQueries = require("../database/apiQueries");

router.post("/saveRecommendation", async (req, res) => {

    let output = true

    try {
        const comments = req.body.endpointRecommendations

        //delete previous commnets
        db.query(`DELETE
                  FROM "Comment"
                  WHERE crc_id = $1
                    AND category = 'endpoint'`, [comments[0].crId])
          .then(result => {
              comments.forEach(data => {
                  db.query(apiQueries.query_endpoint_save_recommendations, [data.comment, data.category, data.crId, data.employeeId]).then(result => {
                      if (result.rowCount <= 0) {
                          output = false
                      }
                  })
                  return false
              })

              res.status(200).send({output: output})
          })
          .catch(error => {
              console.log(error)
          })
    } catch (error) {
        console.log(error)
    }

})

router.get("/getEndpointRecommendation",async (req,res)=>{


    db.query(apiQueries.query_endpoint_get_recommendations,[req.query.category,req.query.crId]).then(result=>{
        res.status(200).send(result.rows)
    })
})

router.get("/getEDRMetrics",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_metric,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRDataSourceDetails",async (req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_data_source_details,[req.query.customerId,req.query.startDate, req.query.endDate])
        res.status(200).send(result.rows)
    }
    catch (error){
        console.log(error)
    }
})

router.get("/getEDRMetricsData/",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.get_query_edr_metric,[req.query.customerId,req.query.startDate, req.query.endDate])
        res.status(200).send(result.rows)
    }
    catch (error){
        console.log(error)
    }
})

router.get("/getEDRMPermittedMtricsData",async (req,res)=>{
    try{
        const result = await db.query(apiQueries.get_query_edr_permitted_metric,[req.query.customerId,req.query.startDate,req.query.endDate])
        res.status(200).send(result.rows)
    }catch (error){
        console.log(error)
    }
})

router.get("/getEDRCount",async (req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_count,[req.query.customerId, req.query.startDate, req.query.endDate])
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRLogcount", async (req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_log_count,[req.query.customerId,req.query.startDate,req.query.endDate])
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRTrojanCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_trojan_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRRiskwareCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_riskware_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRMalwareCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_malware_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRRansomwareCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_ransomware_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRPhishingCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_phishing_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRURLFilterCount",async(req,res)=>{
    try{
        const result = await db.query(apiQueries.query_edr_url_filter_count,'')
        res.status(200).send(result.rows)
    }catch(error){
        console.log(error)
    }
})

router.get("/getEDRMetric", async (req,res) => {
    try{
        const result = await db.query(apiQueries.query_edr_metric,'')
        res.status(200).send(result.rows)
    }catch (error){
        console.log(error)
    }
})

module.exports = router;
