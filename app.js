'use strict';
var bearcat = require('bearcat');
var kafka = require('kafka-node');
var express = require('express');
var authSuiteRouter = require('./lib/express/routes/smartgridSuite/authSuite');
var completeAuthRouter = require('./lib/express/routes/smartgridSuite/completeAuth');
var suiteSysEventRouter = require('./lib/express/routes/smartgridSuite/suiteSysEvent');

var app;
var bearcatContextPath = require.resolve("./production_bcontext.json");
bearcat.createApp([bearcatContextPath]);
bearcat.start(function () {
    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
    var Producer = kafka.Producer;
    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
    var initProducer = new Producer(client);
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
    app.use('/suites/smartgrid-suite', authSuiteRouter);
    app.use('/suites/smartgrid-suite', completeAuthRouter);
    app.use('/suites/smartgrid-suite', suiteSysEventRouter);
    app.set('bearcat', bearcat);
    app.listen(3001);
    console.log("wechat-server-interaction service is starting...");
});