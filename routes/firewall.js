var express = require('express');
var router = express.Router();
const db = require('../database/db');
const apiQueries = require("../database/apiQueries");
const {lazyrouter} = require("express/lib/application");

//test get all firewall record
router.get('/getAllFirewallDetails', async(req, res) => {
  try{
    const result  = await db.query(apiQueries.query_test,[req.query.customerId,req.query.startDate,req.query.endDate]);
    res.status(200).send(result.rows)
  }
  catch (error){
    console.log(error)
  }
})


router.post("/saveRecommendation", async (req,res)=>{

  let output = true

  try{
    const comments = req.body.gatewayRecommendation

    //delete previous commnets
    db.query(`DELETE FROM "Comment" WHERE cr_id=$1 AND category='gateway'`,[comments[0].crId])

    comments.forEach(data=>{
      db.query(apiQueries.query_endpoint_save_recommendations,[data.comment,data.category,data.crId,data.employeeId]).then(result=>{
        if(result.rowCount<=0)
        {
          output = false
        }
      })
      return false
    })

    res.status(200).send({output:output})
  }
  catch (error){
    console.log(error)
  }

})

router.get("/getFirewallCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_count_total,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallDataSourceDetails",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_customer_firewall_data_source_details,[req.query.customerId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error){
    console.log(error)
  }
})

//get list of customer firewall
router.get("/getClientFirewallList",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_get_firewall_list_for_customer,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch (error){
    res.status(200).send(error)
  }
})

router.get("/getFirewallTotalLogCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_log_count_all,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallAdminActivitiesLogCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_admin_activities_log_count,[req.query.firewallId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallActiveBladeCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_active_blade_count,[req.query.firewallId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallMetrics",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_metric,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallAllowedDeniedIPSTrafficCount",async (req,res)=>{
  try {
    const result = db.query(apiQueries.query_firewall_allowed_denied_ips_traffic_count, [req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallAllowedTrafficCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_allowed_traffic_count,[req.query.firewallId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)

  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallDeniedTrafficCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_denied_traffic_count,[req.query.firewallId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallIPSTrafficCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_ips_traffic_count,[req.query.firewallId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallTotalIPSHitsCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_total_ips_hists_count,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallTotalSourceIPSCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_total_source_ips_count,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallTotalDestinationIPSCount",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_total_destination_ips_count,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallTotalNetworkProtocol",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_total_network_protocol,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
   res.status(200).send(error)
  }
})

router.get("/getFirewallTopNetworkProtocols",async (req,res)=>{
  try{
    console.log(req.query)
    const result = await db.query(apiQueries.query_firewall_top_network_protocol,[req.query.firewallId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})
router.get("/getFirewallTopNetworkRules",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_firewall_top_network_rule,[req.query.firewallId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})

router.get("/getTopExternalThreat",async(req,res)=>{
  try {
    const result = await db.query(apiQueries.query_get_top_extenal_threats,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch (error){
    res.status(200).send(error)
  }
})

module.exports = router;
