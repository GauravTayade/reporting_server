const db = require("./db");

//report queries

//query to save user
exports.save_user_details = `INSERT INTO "Employee" ("fname","lname","email","department","password") VALUES ($1,$2,$3,$4,$5)`

//query to user login
exports.validate_user = `SELECT * FROM "Employee" WHERE email = $1`

//get users from database
exports.query_get_users_list = `SELECT * FROM "Employee"`

//get a user from database
exports.query_get_user_details = `SELECT * FROM "Employee" WHERE id= $1`


//mark report as ready for review
exports.query_report_ready_for_review = `UPDATE "ClientReportCollection"
                                         SET is_pending       = false,
                                             review_requested = true,
                                             is_reviewed      = false,
                                             is_delivered     = false
                                         WHERE id = $1`

//mark report as reviewed
exports.query_report_reviewed = `UPDATE "ClientReportCollection"
                                 SET is_pending       = false,
                                     review_requested = false,
                                     is_reviewed      = true,
                                     is_delivered     = false
                                 WHERE id = $1`
//mark report as delivered
exports.query_report_delivered = `UPDATE "ClientReportCollection"
                                  SET is_pending       = false,
                                      review_requested = false,
                                      is_reviewed      = false,
                                      is_delivered     = true
                                  WHERE id = $1`

exports.query_get_customer_list = `SELECT *
                                   FROM "Client"`

exports.query_get_customer_report_list = `SELECT CL.id           AS client_id,
                                                 CR.id           AS report_id,
                                                 CL.name         AS customer_name,
                                                 CL.code         AS customer_code,
                                                 CR.created_at   AS report_date,
                                                 CR.format       AS report_type,
                                                 CR.description  AS report_description,
                                                 CR.is_reviewed  AS report_reviewed,
                                                 CR.is_delivered AS report_delivered,
                                                 CR.from         AS start_date,
                                                 CR.to           AS end_date,
                                                 R.name          AS report_occurance_name,
                                                 R.type          AS report_occurance
                                          FROM "ClientReport" AS CR
                                                   JOIN "Client" AS CL
                                                        ON CR.client_id = CL.id
                                                   JOIN "Report" AS R
                                                        ON CR.report_id = R.id
                                          ORDER BY CR.id ASC LIMIT $1
                                          OFFSET $2`

exports.get_customer_report_details = `SELECT CRC.id               AS report_id,
                                              CRC.created_at       AS report_date,
                                              CRC.from             AS report_start_date,
                                              CRC.to               AS report_end_date,
                                              CRC.is_pending       AS report_pending,
                                              CRC.review_requested AS report_review_requested,
                                              CRC.is_reviewed      AS report_reviewed,
                                              CRC.is_delivered     AS report_delivered,
                                              CR.client_id         AS customer_id,
                                              CL.code              AS customer_code,
                                              CL.name              AS customer_name
                                       FROM "ClientReportCollection" AS CRC
                                                JOIN "ClientReport" AS CR
                                                     ON CRC.cr_id = CR.id
                                                JOIN "Client" AS CL
                                                     ON CR.client_id = CL.id
                                       WHERE CRC.id = $1`

exports.get_customer_report_status_details = `SELECT CRC.is_pending       AS report_pending,
                                                     CRC.review_requested AS report_review_requested,
                                                     CRC.is_reviewed      AS report_reviewed,
                                                     CRC.is_delivered     AS report_delivered
                                              FROM "ClientReportCollection" AS CRC
                                                JOIN "ClientReport" AS CR
                                                    ON CRC.cr_id = CR.id
                                                JOIN "Client" AS CL
                                                     ON CR.client_id = CL.id
                                              WHERE CRC.id = $1`

exports.query_get_customer_details = `SELECT * FROM "Client" AS Cl WHERE Cl.code=$1`

//test
exports.query_test = `SELECT *
                       FROM "FirewallMetrics"
                       WHERE cf_id = $1
                         AND created_at BETWEEN  $2 AND $3`

//get source country count for Global Traffic Analysis
exports.query_global_traffic_unique_src_countries = `SELECT COUNT(DISTINCT (FGC.country))
                                                     FROM "FirewallGeoCountry" AS FGC
                                                     where FGC.cf_id IN ($1)
                                                       AND FGC.created_at >= $2
                                                       AND FGC.created_at <= $3
                                                       AND FGC.direction = 'src'`

//get destination country count for Global Traffic Analysis
exports.query_global_traffic_unique_dest_countries = `SELECT COUNT(DISTINCT (FGC.country))
                                                      FROM "FirewallGeoCountry" AS FGC
                                                      where FGC.cf_id IN ($1) 
                                                        AND FGC.created_at >= $2
                                                        AND FGC.created_at <= $3
                                                        AND FGC.direction = 'dest'`

//get source continent traffic for Global Traffic Analysis

//get destination continent traffic for Global Traffic Analysis

//to get firewall datasource details
//COUNT(DISTINCT (CF.id)) AS firewallCount,
exports.query_customer_firewall_data_source_details = `SELECT F.name                  AS vendor,
                                                              CF.id                   AS clientFirewallId,
                                                              CF.firewall_id          AS firewallId,
                                                              MAX(FM.count)           AS firewallCount,
                                                              SUM(FM.log)             AS totalLogs
                                                       FROM "ClientFirewall" as CF
                                                                JOIN "Firewall" as F
                                                                     ON CF.firewall_id = F.id
                                                                JOIN "FirewallMetrics" AS FM
                                                                     ON CF.id = FM.cf_id
                                                       WHERE CF.client_id IN ($1)
                                                         AND FM.created_at BETWEEN $2 AND $3
                                                       GROUP BY CF.id, F.id`

//to get endpoint datasource details
exports.query_endpoint_data_source_details = `SELECT E.name         AS vendor,
                                                     CE.id          AS clientEndpoitId,
                                                     CE.endpoint_id AS endpointId,
                                                     MAX(EM.count)  AS endpointCount,
                                                     SUM(EM.log)    AS totalLogs
                                              FROM "ClientEndpoint" as CE
                                                       JOIN "Endpoint" as E
                                                            ON CE.endpoint_id = E.id
                                                       JOIN "EndpointMetrics" AS EM
                                                            ON CE.id = EM.ce_id
                                              WHERE CE.client_id IN ($1)
                                                AND EM.created_at BETWEEN $2 AND $3
                                              GROUP BY CE.id, E.id`

//to get edr datasource details
exports.query_edr_data_source_details = `SELECT edr.name        AS vendor,
                                                CEDR.id         as clientEDRId,
                                                CEDR.edr_id     as edrId,
                                                MAX(EDRM.count) as edrcount,
                                                SUM(EDRM.log)   as totallogs
                                         FROM "ClientEDR" AS CEDR
                                                  JOIN "EDR" AS edr
                                                       ON CEDR.edr_id = edr.id
                                                  JOIN "EDRMetrics" AS EDRM
                                                       ON CEDR.id = EDRM.cedr_id
                                         WHERE CEDR.client_id IN ($1)
                                           AND EDRM.created_at BETWEEN $2 AND $3
                                         GROUP BY CEDR.id, edr.id`

//to get nac datasource details
exports.query_nac_data_source_details = `SELECT N.name          AS vendor,
                                                CNAC.id         AS clientNACId,
                                                CNAC.nac_id     AS nacId,
                                                MAX(NACM.count) AS nacCount,
                                                SUM(NACM.log)   AS totalLogs
                                         FROM "ClientNAC" as CNAC
                                                  JOIN "NAC" as N
                                                       ON CNAC.nac_id = N.id
                                                  JOIN "NACMetrics" AS NACM
                                                       ON CNAC.id = NACM.cnac_id
                                         WHERE CNAC.client_id IN ($1)
                                           AND NACM.created_at BETWEEN $2 AND $3
                                         GROUP BY CNAC.id, N.id`
//get VA scan details
exports.query_VAScan_data_source_details = `SELECT V.code    AS vendor,
                                                   CVA.id    AS ClientVAId,
                                                   CVA.va_id AS clientId,
                                                   SUM(iva)  AS ivaCount,
                                                   SUM(eva)  AS evaCount
                                            FROM "ClientVA" AS CVA
                                                     JOIN "VA" AS V
                                                          ON CVA.va_id = V.id
                                                     JOIN "VAMetrics" AS VAM
                                                          ON CVA.id = VAM.cva_id
                                            WHERE CVA.client_id IN ($1)
                                              AND VAM.created_at BETWEEN $2 AND $3
                                            GROUP BY CVA.id, V.id`

//get the IPS Hits Analysis for now then ES
exports.query_get_firewall_IPS_hists_analysis = `SELECT DISTINCT(attack), count(attack) AS attackCount, src, dest
                                                 FROM "FirewallAttacks"
                                                 WHERE cf_id IN ($1)
                                                   AND created_at >= $2
                                                   AND created_at <= $3
                                                   AND src NOT LIKE '192.%'
                                                   AND src NOT LIKE '10.%'
                                                 GROUP BY attack, src, dest
                                                 ORDER BY attackCount DESC
                                                 LIMIT 10`

//get the top external threats count
exports.query_get_top_extenal_threats = `SELECT te.ip,
                                                sum(te.count) as hitsCount
                                         FROM "ThreatsExternal" as te
                                         WHERE client_id = $1
                                           AND te.created_at >= $2 AND te.created_at <= $3
                                         GROUP BY te.ip
                                         ORDER BY hitsCount DESC LIMIT 5`

//get the count of all firewalls for customer
// exports.query_firewall_count_total = `SELECT COUNT(*) as clientFirewallCount FROM "ClientFirewall" WHERE client_id = $1`

exports.query_firewall_count_total = `SELECT MAX(FM.count) AS clientfirewallcount
                                      FROM "ClientFirewall" AS CF
                                               JOIN "FirewallMetrics" AS FM ON CF.id = FM.cf_id
                                      WHERE CF.client_id = $1`

//get the list of all firewalls for a customer
exports.query_get_firewall_list_for_customer = `SELECT *
                                                FROM "ClientFirewall"
                                                WHERE client_id = $1`

//to get count of logs for all firewalls
exports.query_firewall_log_count_all = `SELECT SUM(log) as logcount
                                        FROM "FirewallMetrics" AS FM
                                                 JOIN "ClientFirewall" AS CF
                                                      ON FM.cf_id = CF.id
                                        WHERE client_id IN ($1)
                                          AND FM.created_at BETWEEN $2 AND $3 `

exports.query_firewall_admin_activities_log_count = `SELECT SUM(admin_activity) as adminActivityLogCount
                                                     FROM "FirewallMetrics"
                                                     WHERE cf_id IN ($1)
                                                       AND created_at BETWEEN $2 AND $3`

exports.query_firewall_active_blade_count = `SELECT tdab.active_blade, SUM(tdab.count) as bladeCount
                                             FROM "FirewallMetricsActiveBlades" as tdab
                                             WHERE cf_id IN ($1)
                                               AND created_at BETWEEN $2 AND $3
                                             GROUP BY active_blade
                                             ORDER BY bladeCount DESC LIMIT 5`

exports.query_firewall_metric = `SELECT SUM(count)          as c,
                                        SUM(log)            as logCount,
                                        SUM(admin_activity) as adminActivities,
                                        MAX(active_blades)  as activeBlades
                                 FROM "FirewallMetrics"
                                 WHERE cf_id IN (SELECT id FROM "ClientFirewall" WHERE client_id = $1)
                                   AND created_at >= current_date - interval '30' day`

exports.query_firewall_allowed_denied_ips_traffic_count = `SELECT SUM(allowed) as allowedTraffic,
                                                                  SUM(denied)  as deniedTraffic
                                                           FROM "FirewallTraffic"
                                                           WHERE cf_id IN (SELECT id FROM "ClientFirewall" WHERE client_id = $1)
                                                             AND created_at >= current_date - interval '30' day`

exports.query_firewall_allowed_traffic_count = `SELECT SUM(allowed) as allowedTraffic
                                                FROM "FirewallTraffic"
                                                WHERE cf_id IN ($1)
                                                  AND created_at BETWEEN $2 AND $3`

exports.query_firewall_denied_traffic_count = `SELECT SUM(denied) as deniedTraffic
                                               FROM "FirewallTraffic"
                                               WHERE cf_id IN ($1)
                                                 AND created_at BETWEEN $2 AND $3`

exports.query_firewall_ips_traffic_count = `SELECT SUM(ips) as ipsTrafficCount
                                            FROM "FirewallTraffic"
                                            WHERE cf_id IN ($1)
                                              AND created_at BETWEEN $2 AND $3`

exports.query_firewall_total_ips_hists_count = `SELECT SUM(ips) as ipsCount
                                                FROM "FirewallGeoCount"
                                                WHERE cf_id IN ($1)
                                                  AND created_at >= current_date - interval '30' day`

exports.query_firewall_total_source_ips_count = `SELECT SUM(src) as srcCount
                                                 FROM "FirewallGeoCount"
                                                 WHERE cf_id IN ($1)
                                                   AND created_at >= current_date - interval '30' day`

exports.query_firewall_total_destination_ips_count = `SELECT SUM(dest) as destCount
                                                      FROM "FirewallGeoCount"
                                                      WHERE cf_id IN ($1)
                                                        AND created_at >= current_date - interval '30' day`

exports.query_firewall_total_network_protocol = `SELECT SUM(network_protocols) as networkProtocols
                                                 FROM "FirewallGeoCount"
                                                 WHERE cf_id IN ($1)
                                                   AND created_at >= current_date - interval '30' day`

exports.query_firewall_top_network_protocol = `SELECT fns.network_protocol, SUM(fns.count) as logcount
                                               FROM "FirewallNetworkProtocols" as fns
                                               WHERE cf_id IN ($1)
                                                 AND created_at >= current_date - interval '30' day
                                               GROUP BY fns.network_protocol
                                               ORDER BY logcount DESC LIMIT 10`

exports.query_firewall_top_network_rule = `SELECT fgcr.rule as firewallRuleName, sum(fgcr.count) as logcount
                                           FROM "FirewallGeoCountRule" as fgcr
                                           WHERE fgcr.cf_id IN ($1)
                                             AND created_at >= current_date - interval '30' day
                                           GROUP BY fgcr.rule
                                           ORDER BY logcount DESC LIMIT 10`

exports.query_endpoint_list = `SELECT *
                               FROM "ClientEndpoint"
                               WHERE client_id = $1`

exports.query_endpoint_save_recommendations = `INSERT INTO "Comment"(comment,category,crc_id,employee_id) VALUES ($1,$2,$3,$4)`

exports.query_endpoint_get_recommendations = `SELECT * FROM "Comment" WHERE category=$1 AND crc_id=$2`

exports.query_endpoint_most_active_servers_list = `SELECT EAS.active_server,
                                                          SUM(EAS.count) as totalcount
                                                   FROM "EndpointAuthenticationsActiveServer" AS EAS
                                                            JOIN "ClientEndpoint" AS CE
                                                                 ON EAS.ce_id = CE.id
                                                   WHERE CE.client_id IN ($1)
                                                     AND EAS.created_at BETWEEN $2 AND $3
                                                   GROUP BY eas.active_server
                                                   ORDER BY totalcount DESC LIMIT 5`

exports.query_endpoint_metric = `SELECT MAX(count)    as hostCount,
                                        SUM(log)      as logCount,
                                        SUM(registry) as registryChangesCount,
                                        SUM(service)  as serviceCreationCount,
                                        SUM(process)  as processCreationCount,
                                        SUM(policy)   as policyChangesCount,
                                        SUM(file)     as fileCreationCount
                                 FROM "EndpointMetrics"
                                 WHERE created_at >= current_date - interval '30' day`

exports.query_endpoint_count = `SELECT MAX(active_server) AS hostcount
                                FROM "EndpointAuthentications" AS EA
                                         JOIN "ClientEndpoint" AS CE
                                              ON EA.ce_id = CE.id
                                WHERE CE.client_id IN ($1)
                                  AND EA.created_at BETWEEN $2 AND $3`

exports.query_endpoint_log_ingestion_count = `SELECT SUM(log) as logCount
                                              FROM "EndpointMetrics" AS EM
                                                       JOIN "ClientEndpoint" AS CE
                                                            ON EM.ce_id = CE.id
                                              WHERE client_id IN ($1)
                                                AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_authentication_count = `SELECT SUM(auth) as totalAuthenticationCount
                                               FROM "EndpointAuthentications" AS EA
                                                        JOIN "ClientEndpoint" AS CE
                                                             ON EA.ce_id = CE.id
                                               WHERE CE.client_id IN ($1)
                                                 AND EA.created_at BETWEEN $2 AND $3`

exports.query_endpoint_registry_changes_count = `SELECT SUM(registry) as totalRegistryChangeCount
                                                 FROM "EndpointMetrics" AS EM
                                                          JOIN "ClientEndpoint" AS CE
                                                               ON EM.ce_id = CE.id
                                                 WHERE CE.client_id IN ($1)
                                                   AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_service_creation_count = `SELECT SUM(service) as totalServiceCreationCount
                                                 FROM "EndpointMetrics" AS EM
                                                          JOIN "ClientEndpoint" AS CE
                                                               ON EM.ce_id = CE.id
                                                 WHERE CE.client_id IN ($1)
                                                   AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_process_creation_count = `SELECT SUM(process) as totalProcessCreationCount
                                                 FROM "EndpointMetrics" AS EM
                                                          JOIN "ClientEndpoint" AS CE
                                                               ON EM.ce_id = CE.id
                                                 WHERE CE.client_id IN ($1)
                                                   AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_policy_changes_count = `SELECT SUM(policy) as totalPolicyChangesCount
                                               FROM "EndpointMetrics" AS EM
                                                        JOIN "ClientEndpoint" AS CE
                                                             ON EM.ce_id = CE.id
                                               WHERE CE.client_id IN ($1)
                                                 AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_file_creation_count = `SELECT SUM(file) as totalFileCreationCount
                                              FROM "EndpointMetrics" AS EM
                                                       JOIN "ClientEndpoint" AS CE
                                                            ON EM.ce_id = CE.id
                                              WHERE CE.client_id IN ($1)
                                                AND EM.created_at BETWEEN $2 AND $3`

exports.query_endpoint_most_active_servers = `SELECT ROUND(AVG(active_server), 0) as totalActiveServer
                                              FROM "EndpointAuthentications"
                                              WHERE created_at >= current_date - interval '30' day`

exports.query_endpoint_total_authentication_count = `SELECT SUM(auth) as totalAuthentication
                                                     FROM "EndpointAuthentications"
                                                     WHERE created_at >= current_date - interval '30' day`

exports.query_endpoint_total_failed_authentication_count = `SELECT SUM(failed_auth) as totalFailedAuthentication
                                                            FROM "EndpointAuthentications" AS EA
                                                                     JOIN "ClientEndpoint" AS CE
                                                                          ON EA.ce_id = CE.id
                                                            WHERE CE.client_id IN ($1)
                                                              AND EA.created_at BETWEEN $2 AND $3`

exports.query_endpoint_total_target_hosts_count = `SELECT ROUND(AVG(host), 0) as totalHosts
                                                   FROM "EndpointAuthentications"
                                                   WHERE created_at >= current_date - interval '30' day`

exports.query_endpoint_total_target_usernames_count = `SELECT ROUND(AVG(username), 0) as totalUsername
                                                       FROM "EndpointAuthentications"
                                                       WHERE created_at >= current_date - interval '30' day`

exports.query_endpoint_top_failed_authentication_target_hosts = ``

exports.query_endpoint_get_top_external_threats = `SELECT te.ip, SUM(te.count) AS iphitcount
                                                   FROM "ThreatsExternal" AS te
                                                   WHERE created_at >= current_date - interval '30' DAY
                                                   GROUP BY te.ip
                                                   ORDER BY iphitcount DESC`

exports.query_nac_metrics = `SELECT SUM(count) as count, SUM(log) as logCount
                             FROM "NACMetrics"
                             WHERE created_at >= current_date - interval '30' day`

exports.query_nac_count = `SELECT MAX(NACM.count) as clientnaccount
                           FROM "NACMetrics" AS NACM
                                    JOIN "ClientNAC" AS CNAC
                                         ON NACM.cnac_id = CNAC.id
                           WHERE CNAC.client_id IN ($1)
                             AND NACM.created_at BETWEEN $2 AND $3`

exports.query_nac_log_ingestion_count = `SELECT SUM(log) as logCount
                                         FROM "NACMetrics" AS NACM
                                                  JOIN "ClientNAC" AS CNAC
                                                       ON NACM.cnac_id = CNAC.id
                                         WHERE client_id IN ($1)
                                           AND NACM.created_at BETWEEN $2 and $3`

exports.query_edr_metric = `SELECT SUM(log)        as logCount,
                                   SUM(trojan)     as trojanCount,
                                   SUM(riskware)   as riskwareCount,
                                   SUM(malware)    as malwareCount,
                                   SUM(ransomware) as ransomwareCount,
                                   SUM(phishing)   as phishingCount,
                                   SUM(url_filter) as urlFilterCount
                            FROM "EDRMetrics"
                            WHERE cedr_id IN ($1)
                              AND created_at >= current_date - interval '30' day`

exports.get_query_edr_metric = `SELECT SUM(log)                    AS logCount,
                                       MAX(EDRM.count)             AS edrCount,
                                       SUM(EDRM.trojan)            AS trojanCount,
                                       SUM(EDRM.riskware)          AS riskwareCount,
                                       SUM(EDRM.malware)           AS malwareCount,
                                       SUM(EDRM.ransomware)        AS ransomwareCount,
                                       SUM(EDRM.phishing)          AS phishingCount,
                                       SUM(EDRM.url_filter)        AS urlFilterCount,
                                       SUM(EDRM.threat_extraction) AS threatExtractionCount,
                                       SUM(EDRM.threat_emulation)  AS threatEmulationCount
                                FROM "ClientEDR" AS CEDR
                                         JOIN "EDRMetrics" AS EDRM
                                              ON CEDR.id = EDRM.cedr_id
                                WHERE client_id IN ($1)
                                  AND EDRM.created_at BETWEEN $2 and $3`

exports.get_query_edr_permitted_metric = `SELECT SUM(log)                    AS logCount,
                                                 MAX(EDRM.count)             AS edrCount,
                                                 SUM(EDRM.trojan)            AS trojanCount,
                                                 SUM(EDRM.riskware)          AS riskwareCount,
                                                 SUM(EDRM.malware)           AS malwareCount,
                                                 SUM(EDRM.ransomware)        AS ransomwareCount,
                                                 SUM(EDRM.phishing)          AS phishingCount,
                                                 SUM(EDRM.url_filter)        AS urlFilterCount,
                                                 SUM(EDRM.threat_extraction) AS threatExtractionCount,
                                                 SUM(EDRM.threat_emulation)  AS threatEmulationCount
                                         FROM "ClientEDR" AS CEDR
                                            JOIN "EDRMetrics" AS EDRM
                                                ON CEDR.id = EDRM.cedr_id
                                        WHERE client_id IN ($1)
                                            AND EDRM.created_at BETWEEN $2 and $3`

exports.query_edr_count = `SELECT MAX(EDRM.count) as clientedrcount
                           FROM "EDRMetrics" AS EDRM
                                    JOIN "ClientEDR" AS CEDR
                                         ON EDRM.cedr_id = CEDR.id
                           WHERE client_id IN ($1)
                             AND EDRM.created_at BETWEEN $2 AND $3`

exports.query_edr_log_count = `SELECT SUM(log) as logcount
                               FROM "EDRMetrics" AS EDRM
                                        JOIN "ClientEDR" AS CEDR
                                             ON EDRM.cedr_id = CEDR.id
                               WHERE client_id IN ($1)
                                 AND EDRM.created_at BETWEEN $2 and $3`

exports.query_edr_trojan_count = `SELECT SUM(trojan) as trojanCount
                                  FROM "EDRMetrics" AS EDRM
                                           JOIN "ClientEDR" AS CEDR
                                                ON EDRM.cedr_id = CEDR.id
                                  WHERE client_id IN ($1)
                                    AND EDRM.created_at >= current_date - interval '30' day`

exports.query_edr_riskware_count = `SELECT SUM(riskware) as riskwareCount
                                    FROM "EDRMetrics" AS EDRM
                                             JOIN "ClientEDR" AS CEDR ON EDRM.cedr_id = CEDR.id
                                    WHERE client_id IN ($1)
                                      AND EDRM.created_at >= current_date - interval '30' day`

exports.query_edr_malware_count = `SELECT SUM(malware) as malwareCount
                                   FROM "EDRMetrics" AS EDRM
                                            JOIN "ClientEDR" AS CEDR ON EDRM.cedr_id = CEDR.id
                                   WHERE client_id IN ($1)
                                     AND EDRM.created_at >= current_date - interval '30' day`

exports.query_edr_ransomware_count = `SELECT SUM(ransomware) as ransomwareCount
                                      FROM "EDRMetrics" AS EDRM
                                               JOIN "ClientEDR" AS CEDR ON EDRM.cedr_id = CEDR.id
                                      WHERE client_id IN ($1)
                                        AND EDRM.created_at >= current_date - interval '30' day`

exports.query_edr_phishing_count = `SELECT SUM(phishing) as phishingCount
                                    FROM "EDRMetrics" AS EDRM
                                             JOIN "ClientEDR" AS CEDR ON EDRM.cedr_id = CEDR.id
                                    WHERE client_id IN ($1)
                                      AND EDRM.created_at >= current_date - interval '30' day`

exports.query_edr_url_filter_count = `SELECT SUM(url_filter) as urlFilterCount
                                      FROM "EDRMetrics" AS EDRM
                                               JOIN "ClientEDR" AS CEDR ON EDRM.cedr_id = CEDR.id
                                      WHERE client_id IN ($1)
                                        AND EDRM.created_at >= current_date - interval '30' day`
