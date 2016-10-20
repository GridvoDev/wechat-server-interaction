'use strict';
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');

function Service() {
    EventEmitter.call(this);
    this.__SuiteTicketArriveTopicProducer__ = null;
    this.__CorpCreateAuthTopicProducer__ = null;
    this.__CorpCancelAuthTopicProducer__ = null;
    this.__CorpChangeAuthTopicProducer__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.handleSuiteTicketArriveSysEvent = function (sysEventData, callback) {
    if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.SuiteTicket) {
        callback(null, false);
        return;
    }
    sysEventData.TimeStamp = sysEventData.TimeStamp * 1000;
    var message = {
        suiteID: sysEventData.SuiteId,
        ticket: sysEventData.SuiteTicket,
        timestamp: sysEventData.TimeStamp
    };
    this.__SuiteTicketArriveTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

Service.prototype.handleCreateAuthSysEvent = function (sysEventData, callback) {
    if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.AuthCode) {
        callback(null, false);
        return;
    }
    sysEventData.TimeStamp = sysEventData.TimeStamp * 1000;
    var message = {
        suiteID: sysEventData.SuiteId,
        authCode: sysEventData.AuthCode,
        timestamp: sysEventData.TimeStamp
    };
    this.__CorpCreateAuthTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

Service.prototype.handleCancelAuthSysEvent = function (sysEventData, callback) {
    if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.AuthCorpId) {
        callback(null, false);
        return;
    }
    sysEventData.TimeStamp = sysEventData.TimeStamp * 1000;
    var message = {
        suiteID: sysEventData.SuiteId,
        corpID: sysEventData.AuthCorpId,
        timestamp: sysEventData.TimeStamp
    };
    this.__CorpCancelAuthTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

Service.prototype.handleChangeAuthSysEvent = function (sysEventData, callback) {
    if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.AuthCorpId) {
        callback(null, false);
        return;
    }
    sysEventData.TimeStamp = sysEventData.TimeStamp * 1000;
    var message = {
        suiteID: sysEventData.SuiteId,
        corpID: sysEventData.AuthCorpId,
        timestamp: sysEventData.TimeStamp
    };
    this.__CorpChangeAuthTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

module.exports = Service;