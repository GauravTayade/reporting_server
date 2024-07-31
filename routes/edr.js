var express = require('express');
var router = express.Router();
const db = require('../database/db');
const apiQueries = require("../database/apiQueries");

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
