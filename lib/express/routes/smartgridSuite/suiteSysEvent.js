'use strict';
const _ = require('underscore');
const express = require('express');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../../util');

let router = express.Router();
router.get('/suite-sys-event', (req, res)=> {
    let traceContext = traceContextFeach(req);
    let {msg_signature, timestamp, nonce} = req.query;
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
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

router.post('/suite-sys-event', (req, res)=> {
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
            if (data.InfoType == 'suite_ticket') {
                suiteSysEventHandleService.handleSuiteTicketArriveSysEvent(data, traceContext, (err, isSuccess)=> {
                    if (err) {
                        logger.error(err.message, traceContext);
                        return;
                    }
                    if (!isSuccess) {
                        res.send('fail');
                        logger.error("handle wechat server push suite_ticket sys event fail", traceContext);
                        return;
                    }
                    res.send('success');
                    logger.info("handle wechat server push suite_ticket sys event success", traceContext);
                });
            } else if (data.InfoType == 'change_auth') {
                suiteSysEventHandleService.handleChangeAuthSysEvent(data, traceContext, (err, isSuccess)=> {
                    if (err) {
                        logger.error(err.message, traceContext);
                        return;
                    }
                    if (!isSuccess) {
                        res.send('fail');
                        logger.error("handle wechat server push change_auth sys event fail", traceContext);
                        return;
                    }
                    res.send('success');
                    logger.info("handle wechat server push change_auth sys event success", traceContext);
                });
            } else if (data.InfoType == 'cancel_auth') {
                suiteSysEventHandleService.handleCancelAuthSysEvent(data, traceContext, (err, isSuccess)=> {
                    if (err) {
                        logger.error(err.message, traceContext);
                        return;
                    }
                    if (!isSuccess) {
                        res.send('fail');
                        logger.error("handle wechat server push cancel_auth sys event fail", traceContext);
                        return;
                    }
                    res.send('success');
                    logger.info("handle wechat server push cancel_auth sys event success", traceContext);
                });
            } else if (data.InfoType == 'create_auth') {
                suiteSysEventHandleService.handleCreateAuthSysEvent(data, traceContext, (err, isSuccess)=> {
                    if (err) {
                        logger.error(err.message, traceContext);
                        return;
                    }
                    if (!isSuccess) {
                        res.send('fail');
                        logger.error("handle wechat server push create_auth sys event fail", traceContext);
                        return;
                    }
                    res.send('success');
                    logger.info("handle wechat server push create_auth sys event success", traceContext);
                });
            }
            else {
                res.send('fail');
                logger.error("no handle wechat server push sys event", traceContext);
            }
        });
    });
    req.once('error', err=> {
        res.send("fail");
        logger.error(err.message, traceContext);
    });
});

module.exports = router;