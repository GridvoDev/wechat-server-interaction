'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');

var smartStationSuite = "tj75d1122acf5ed4aa";
var router = express.Router();
router.get('/suite-sys-event', function (req, res) {
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        var callBackURLAuth = req.app.get('bearcat').getBean('callBackURLAuth');
        var authParameter = {};
        authParameter.signature = req.query.msg_signature;
        authParameter.timestamp = req.query.timestamp;
        authParameter.nonce = req.query.nonce;
        authParameter.encrypt = req.query.echostr;
        callBackURLAuth.authURL(authParameter, function (err, echostr) {
            if (err) {
                res.send(err);
                console.log(err);
                return;
            }
            res.send(echostr ? echostr : "auth parameter err");
        });
    } else {
        res.send("WeChat server had auth this URL");
        console.log("WeChat server had auth this URL");
    }
});

module.exports = router;