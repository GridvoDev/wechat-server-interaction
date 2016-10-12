'use strict';
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');

function Service() {
    EventEmitter.call(this);
    this.__SuiteTicketArriveTopicProducer__ = null;
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
        dateTime: new Date(sysEventData.TimeStamp)
    };
    this.__SuiteTicketArriveTopicProducer__.produceMessage(message, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

module.exports = Service;