'use strict';
let _ = require('underscore');
const {MessageProducer} = require('../../infrastructure');

class Service {
    constructor() {
        this.__SuiteTicketArriveTopicProducer__ = new MessageProducer("suite-ticket-arrive");
        this.__CorpCreateAuthTopicProducer__ = new MessageProducer("corp-create-auth");
        this.__CorpCancelAuthTopicProducer__ = new MessageProducer("corp-cancel-auth");
        this.__CorpChangeAuthTopicProducer__ = new MessageProducer("corp-change-auth");
    }

    handleSuiteTicketArriveSysEvent(sysEventData, callback) {
        let {SuiteId, InfoType, TimeStamp, SuiteTicket} = sysEventData;
        if (!SuiteId || !InfoType || !TimeStamp || !SuiteTicket) {
            callback(null, false);
            return;
        }
        TimeStamp = TimeStamp * 1000;
        let message = {
            suiteID: SuiteId,
            ticket: SuiteTicket,
            timestamp: TimeStamp
        };
        this.__SuiteTicketArriveTopicProducer__.produceMessage(message, (err, data)=> {
            if (err) {
                callback(err);
                return;
            }
            if (data) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    }

    handleCreateAuthSysEvent(sysEventData, callback) {
        let {SuiteId, InfoType, TimeStamp, AuthCode}= sysEventData;
        if (!SuiteId || !InfoType || !TimeStamp || !AuthCode) {
            callback(null, false);
            return;
        }
        TimeStamp = TimeStamp * 1000;
        let message = {
            suiteID: SuiteId,
            authCode: AuthCode,
            timestamp: TimeStamp
        };
        this.__CorpCreateAuthTopicProducer__.produceMessage(message, (err, data)=> {
            if (err) {
                callback(err);
                return;
            }
            if (data) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });

    }

    handleCancelAuthSysEvent(sysEventData, callback) {
        let {SuiteId, InfoType, TimeStamp, AuthCorpId}= sysEventData;
        if (!SuiteId || !InfoType || !TimeStamp || !AuthCorpId) {
            callback(null, false);
            return;
        }
        TimeStamp = TimeStamp * 1000;
        let message = {
            suiteID: SuiteId,
            corpID: AuthCorpId,
            timestamp: TimeStamp
        };
        this.__CorpCancelAuthTopicProducer__.produceMessage(message, (err, data)=> {
            if (err) {
                callback(err);
                return;
            }
            if (data) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    }

    handleChangeAuthSysEvent(sysEventData, callback) {
        let {SuiteId, InfoType, TimeStamp, AuthCorpId}= sysEventData;
        if (!SuiteId || !InfoType || !TimeStamp || !AuthCorpId) {
            callback(null, false);
            return;
        }
        TimeStamp = TimeStamp * 1000;
        let message = {
            suiteID: SuiteId,
            corpID: AuthCorpId,
            timestamp: TimeStamp
        };
        this.__CorpChangeAuthTopicProducer__.produceMessage(message, (err, data)=> {
            if (err) {
                callback(err);
                return;
            }
            if (data) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    }
}

module.exports = Service;