var express = require('express');
var router = express.Router();
const db = require('../database/db');
const apiQueries = require("../database/apiQueries");

router.get("/", async (req,res)=>{
  res.status(200).send("if edr works it works")
})

router.post("/saveRecommendation", async (req,res)=>{

  let output = true

  try{
    const comments = req.body.endpointRecommendations

    //delete previous commnets
    db.query(`DELETE FROM "Comment" WHERE cr_id=$1 AND category='server'`,[comments[0].crId])

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

router.get("/getEndpointDatSourceDetails",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_data_source_details,[req.query.customerId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error){
    console.log(error)
  }
})

router.get("/getClientEndpoint",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_list,[req.query.customerId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})

router.get("/getTopTargetFailedAuthenticationHosts",async(req,res)=>{
  try{
    const result = await db.query(apiQueries, [req.query.endpointId])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})

router.get("/getMostEndpointMostActiveServerList",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_most_active_servers_list,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch(error){
    console.log(error)
  }
})

router.get("/getEndpointMetrics", async (req,res) => {
  try{
    const result = await db.query(apiQueries.query_endpoint_metric,'')
    res.status(200).send(result.rows)
  }catch (error){
    console.log(error)
  }
})

router.get("/getEndpointCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalLogCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_log_ingestion_count,[req.query.customerId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointAuthenticationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_authentication_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointRegistryChangesCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_registry_changes_count,[req.query.customerId, req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointServiceCreationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_service_creation_count,[req.query.customerId,req.query.startDate, req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointProcessCreationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_process_creation_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointPolicyChangesCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_policy_changes_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointFileCreationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_file_creation_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointMostActiveServers",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_most_active_servers,'')
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalAuthenticationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_total_authentication_count,'')
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalFailedAuthenticationCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_total_failed_authentication_count,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalTargetHostsCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_total_target_hosts_count,'')
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalTargetUsernamesCount",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_total_target_usernames_count,'')
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTotalFailedAuthenticationTargetHosts",async(req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_top_failed_authentication_target_hosts,'')
    res.status(200).send(result.rows)
  }
  catch (error) {
    console.log(error)
  }
})

router.get("/getEndpointTopExternalThreats",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_endpoint_get_top_external_threats,[req.query.endpointId])
    res.status(200).send(result.rows)
  }
  catch (error){
    console.log(error)
  }
})

router.get("/getVAScanDataSourceDetails",async (req,res)=>{
  try{
    const result = await db.query(apiQueries.query_VAScan_data_source_details,[req.query.customerId,req.query.startDate,req.query.endDate])
    res.status(200).send(result.rows)
  }
  catch (error){
    console.log(error)
  }
})

module.exports = router;
