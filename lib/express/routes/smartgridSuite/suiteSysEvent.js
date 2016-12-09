'use strict';
const _ = require('underscore');
const express = require('express');

let router = express.Router();
router.get('/suite-sys-event', (req, res)=> {
    let {msg_signature, timestamp, nonce} = req.query;
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
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

router.post('/suite-sys-event', (req, res)=> {
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
            if (data.InfoType == 'suite_ticket') {
                suiteSysEventHandleService.handleSuiteTicketArriveSysEvent(data, (err, isSuccess)=> {
                    if (err) {
                        console.log(err);
                        res.send('fail');
                        return;
                    }
                    if (isSuccess) {
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push suite_ticket sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push suite_ticket sys event fail`);
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
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push change_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push change_auth sys event fail`);
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
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push cancel_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push cancel_auth sys event fail`);
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
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push create_auth sys event success`);
                        res.send('success');
                    }
                    else {
                        console.log(`${(new Date()).toLocaleString()}:handle wechat server push create_auth sys event fail`);
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