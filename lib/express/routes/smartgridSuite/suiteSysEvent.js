'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');

var router = express.Router();
router.get('/suite-sys-event', function (req, res) {
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

router.post('/suite-sys-event', function (req, res) {
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
            if (data.InfoType == 'suite_ticket') {
                suiteSysEventHandleService.handleSuiteTicketArriveSysEvent(data, (err, isSuccess)=> {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                        return;
                    }
                    if (isSuccess) {
                        console.log(`${new Date()}:handle wechat server push suite_ticket sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${new Date()}:handle wechat server push suite_ticket sys event fail`);
                        res.send('fail');
                    }
                });
            } else if (data.InfoType == 'change_auth') {
                suiteSysEventHandleService.handleChangeAuthSysEvent(data, (err, isSuccess)=> {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                        return;
                    }
                    if (isSuccess) {
                        console.log(`${new Date()}:handle wechat server push change_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${new Date()}:handle wechat server push change_auth sys event fail`);
                        res.send('fail');
                    }
                });

            } else if (data.InfoType == 'cancel_auth') {
                suiteSysEventHandleService.handleCancelAuthSysEvent(data, (err, isSuccess)=> {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                        return;
                    }
                    if (isSuccess) {
                        console.log(`${new Date()}:handle wechat server push cancel_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${new Date()}:handle wechat server push cancel_auth sys event fail`);
                        res.send('fail');
                    }
                });
            } else if (data.InfoType == 'create_auth') {
                suiteSysEventHandleService.handleCreateAuthSysEvent(data, (err, isSuccess)=> {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                        return;
                    }
                    if (isSuccess) {
                        console.log(`${new Date()}:handle wechat server push create_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${new Date()}:handle wechat server push create_auth sys event fail`);
                        res.send('fail');
                    }
                });
            }
            else {
                console.log("other suite sys event");
                res.send('fail');
            }
        });
    });
    req.once('error', ()=> {
        res.send("fail");
    });
});

module.exports = router;