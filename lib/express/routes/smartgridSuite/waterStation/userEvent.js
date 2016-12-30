'use strict';
const _ = require('underscore');
const express = require('express');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../../../util');

let router = express.Router();
router.get('/user-event', (req, res)=> {
    let traceContext = traceContextFeach(req);
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        let {msg_signature, timestamp, nonce} = req.query;
        let authParameter = {};
        authParameter.signature = msg_signature;
        authParameter.timestamp = timestamp;
        authParameter.nonce = nonce;
        authParameter.encrypt = req.query.echostr;
        let wechatServerCallBackService = req.app.get('wechatServerCallBackService');
        let echostr = wechatServerCallBackService.authCallBackURLSyn(authParameter, traceContext);
        res.send(echostr ? echostr : "auth parameter err");
        logger.info("weChat server auth this url", traceContext);
    } else {
        res.send("weChat server had auth this url");
        logger.error("weChat server had auth this url", traceContext);
    }
});

router.post('/user-event', (req, res)=> {
    let traceContext = traceContextFeach(req);
    let buffers = [];
    req.on('data', (trunk)=> {
            buffers.push(trunk);
        }
    );
    req.on('end', ()=> {
        Buffer.concat(buffers);
        let {msg_signature, timestamp, nonce} = req.query;
        let parseParameter = {};
        parseParameter.signature = msg_signature;
        parseParameter.timestamp = timestamp;
        parseParameter.nonce = nonce;
        parseParameter.cbXMLString = buffers.toString("utf-8");
        let wechatServerCallBackService = req.app.get('wechatServerCallBackService');
        let suiteSysEventHandleService = req.app.get('suiteSysEventHandleService');
        wechatServerCallBackService.parseCallBackData(parseParameter, traceContext, (err, data)=> {
            if (err) {
                logger.error(err.message, traceContext);
                return;
            }
            res.send("undoing");
            logger.error("no handle user event", traceContext);
        });
    });
    req.once('error', err=> {
        res.send("undoing");
        logger.error(err.message, traceContext);
    });
});

module.exports = router;