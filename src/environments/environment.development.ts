export const environment = {
   // srp_microservice_url: "https://evd.srp.cloud.slb-ds.com/api/",
    srp_microservice_url: "https://localhost:59475/api/",
    customAlertNotification:['Text','Email'],
    customAlertPriority:['High','Medium','Low'],
    customAlertCategory:['Fluid Pound Events','Gas Interference Events','Flatlining Events','Tagging Events','Distorted Card Events','Current SPM','Current PF','Load','Shutdowns','Runtime Yesterday'],
    customAlertOperator:['=','<>','>','>=','<','<='],
    customAlertValue:['Any numerical value','Max Allowable SPM Setpoint','Min Allowable SPM Setpoint','Max load','Min load','Max Allowable Shutdowns','Min Runtime'],

}