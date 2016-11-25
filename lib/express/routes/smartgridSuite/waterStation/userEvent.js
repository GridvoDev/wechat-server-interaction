'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');

var router = express.Router();
router.get('/user-event', function (req, res) {
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        var authParameter = {};
        authParameter.signature = req.query.msg_signature;
        authParameter.timestamp = req.query.timestamp;
        authParameter.nonce = req.query.nonce;
        authParameter.encrypt = req.query.echostr;
        var wechatServerCallBackService = req.app.get('bearcat').getBean('wechatServerCallBackService');
        var echostr = wechatServerCallBackService.authCallBackURLSyn(authParameter);
        res.send(echostr ? echostr : "auth parameter err");
    } else {
        res.send("WeChat server had auth this URL");
        console.log("WeChat server had auth this URL");
    }
});

router.post('/user-event', function (req, res) {
    var buffers = [];
    req.on('data', (trunk)=> {
            buffers.push(trunk);
        }
    );
    req.on('end', ()=> {
        Buffer.concat(buffers);
        var parseParameter = {};
        parseParameter.signature = req.query.msg_signature;
        parseParameter.timestamp = req.query.timestamp;
        parseParameter.nonce = req.query.nonce;
        parseParameter.cbXMLString = buffers.toString("utf-8");
        var wechatServerCallBackService = req.app.get('bearcat').getBean('wechatServerCallBackService');
        var suiteSysEventHandleService = req.app.get('bearcat').getBean('suiteSysEventHandleService');
        wechatServerCallBackService.parseCallBackData(parseParameter, (err, data)=> {
            res.send("undoing");
            console.log(data);
        });
    });
    req.once('error', ()=> {
        res.send("undoing");
    });
});

module.exports = router;