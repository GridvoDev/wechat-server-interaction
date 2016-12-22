'use strict';
const kafka = require('kafka-node');
const express = require('express');
const {logger, tracer} = require('./lib/util');
const {createAuthSuiteService, createWechatServerCallBackService, createSuiteSysEventHandleService} = require('./lib/application');
const {smartgridSuiteAuthSuiteRouter, smartgridSuiteCompleteAuthRouter, smartgridSuiteSuiteSysEventRouter, smartgridSuiteWaterStationUserEventRouter} = require('./lib/express');
const {expressZipkinMiddleware} = require("gridvo-common-js");

let app;
let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
let Producer = kafka.HighLevelProducer;
let client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
let initProducer = new Producer(client);
initProducer.on('ready', function () {
    initProducer.createTopics(["suite-ticket-arrive",
        "corp-create-auth",
        "corp-change-auth",
        "corp-cancel-auth",
        "zipkin"], true, (err)=> {
        if (err) {
            logger.error(err.message);
            return;
        }
        client.refreshMetadata(["suite-ticket-arrive",
            "corp-create-auth",
            "corp-change-auth",
            "corp-cancel-auth",
            "zipkin"], ()=> {
            initProducer.close(()=> {
                logger.info("init kafka topics success");
            });
        });
    });
});
initProducer.on('error', (err)=> {
    logger.error(err.message);
});
app = express();
app.use(expressZipkinMiddleware({
    tracer: tracer,
    serviceName: 'wechat-server-interaction'
}));
app.use('/suites/smartgrid-suite', smartgridSuiteAuthSuiteRouter);
app.use('/suites/smartgrid-suite', smartgridSuiteCompleteAuthRouter);
app.use('/suites/smartgrid-suite', smartgridSuiteSuiteSysEventRouter);
app.use('/suites/smartgrid-suite/apps/water-station', smartgridSuiteWaterStationUserEventRouter);
let authSuiteService = createAuthSuiteService();
app.set('authSuiteService', authSuiteService);
let wechatServerCallBackService = createWechatServerCallBackService();
app.set('wechatServerCallBackService', wechatServerCallBackService);
let suiteSysEventHandleService = createSuiteSysEventHandleService();
app.set('suiteSysEventHandleService', suiteSysEventHandleService);
app.listen(3001, (err)=> {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});