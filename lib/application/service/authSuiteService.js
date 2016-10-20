'use strict';
var util = require('util');
var EventEmitter = require('events');
var async = require('async');
var request = require('request');
var _ = require('underscore');

function Service() {
    EventEmitter.call(this);
    this.__httpRequest__ = request;
    this.__CorpCreateAuthTopicProducer__ = null;
};
util.inherits(Service, EventEmitter);
Service.prototype.getSuiteAuthURL = function (suiteID, callback) {
    if (!suiteID) {
        callback(null, null);
        return;
    }
    var self = this;
    async.waterfall([function (cb) {
        var GRIDVOWECHAT_SERVICE_HOST = process.env.GRIDVOWECHAT_SERVICE_HOST ? process.env.GRIDVOWECHAT_SERVICE_HOST : "127.0.0.1";
        var GRIDVOWECHAT_SERVICE_PORT = process.env.GRIDVOWECHAT_SERVICE_PORT ? process.env.GRIDVOWECHAT_SERVICE_PORT : "80";
        var url = `http://${GRIDVOWECHAT_SERVICE_HOST}:${GRIDVOWECHAT_SERVICE_PORT}/suites/${suiteID}/suite-auth-url`;
        var options = {
            method: "GET",
            url: url,
            json: true
        };
        self.__httpRequest__(options, cb);
    }], function (err, response, body) {
        if (err) {
            callback(err, null);
            return;
        }
        if (body && body.suite_auth_url && body.errcode == "200" && body.errmsg == "ok") {
            callback(null, body.suite_auth_url);
        }
        else {
            callback(null, null);
        }
    });
};
Service.prototype.completeAuth = function (suiteID, authCode, callback) {
    if (!suiteID || !authCode) {
        callback(null, false);
        return;
    }
    var message = {
        suiteID: suiteID,
        authCode: authCode,
        timestamp: new Date().getTime()
    };
    this.__CorpCreateAuthTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

module.exports = Service;