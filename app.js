'use strict';
const kafka = require('kafka-node');
const express = require('express');
const {AuthSuiteService, WechatServerCallBackService, SuiteSysEventHandleService} = require('./lib/application');
const {smartgridSuiteAuthSuiteRouter, smartgridSuiteCompleteAuthRouter, smartgridSuiteSuiteSysEventRouter, smartgridSuiteWaterStationUserEventRouter} = require('./lib/express');

let app;
let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
let Producer = kafka.HighLevelProducer;
let client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
let initProducer = new Producer(client);
initProducer.on('ready', function () {
    initProducer.createTopics(["suite-ticket-arrive",
        "corp-create-auth",
        "corp-change-auth",
        "corp-cancel-auth"], true, (err)=> {
        if (err) {
            console.log(err);
            return;
        }
        client.refreshMetadata(["suite-ticket-arrive",
            "corp-create-auth",
            "corp-change-auth",
            "corp-cancel-auth"], ()=> {
            initProducer.close(()=> {
                console.log("wechat-server-interaction service init topics success");
            });
        });
    });
});
initProducer.on('error', (err)=> {
    console.log(err);
});
app = express();
app.use('/suites/smartgrid-suite', smartgridSuiteAuthSuiteRouter);
app.use('/suites/smartgrid-suite', smartgridSuiteCompleteAuthRouter);
app.use('/suites/smartgrid-suite', smartgridSuiteSuiteSysEventRouter);
app.use('/suites/smartgrid-suite/apps/water-station', smartgridSuiteWaterStationUserEventRouter);
let authSuiteService = new AuthSuiteService();
app.set('authSuiteService', authSuiteService);
let wechatServerCallBackService = new WechatServerCallBackService();
app.set('wechatServerCallBackService', wechatServerCallBackService);
let suiteSysEventHandleService = new SuiteSysEventHandleService();
app.set('suiteSysEventHandleService', suiteSysEventHandleService);
app.listen(3001);
console.log("wechat-server-interaction service is starting...");