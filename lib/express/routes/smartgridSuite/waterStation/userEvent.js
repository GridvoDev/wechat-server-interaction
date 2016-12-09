'use strict';
const _ = require('underscore');
const express = require('express');

let router = express.Router();
router.get('/user-event', (req, res)=> {
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        let {msg_signature, timestamp, nonce} = req.query;
        let authParameter = {};
        authParameter.signature = msg_signature;
        authParameter.timestamp = timestamp;
        authParameter.nonce = nonce;
        authParameter.encrypt = req.query.echostr;
        let wechatServerCallBackService = req.app.get('wechatServerCallBackService');
        let echostr = wechatServerCallBackService.authCallBackURLSyn(authParameter);
        res.send(echostr ? echostr : "auth parameter err");
    } else {
        res.send("WeChat server had auth this URL");
        console.log("WeChat server had auth this URL");
    }
});

router.post('/user-event', (req, res)=> {
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
        wechatServerCallBackService.parseCallBackData(parseParameter, (err, data)=> {
            res.send("undoing");
        });
    });
    req.once('error', ()=> {
        res.send("undoing");
    });
});

module.exports = router;