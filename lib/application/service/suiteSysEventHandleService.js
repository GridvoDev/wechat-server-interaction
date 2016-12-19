'use strict';
let _ = require('underscore');
const {createMessageProducer} = require('../../infrastructure');

class Service {
    constructor() {
        this._messageProducer = createMessageProducer();
    }

    handleSuiteTicketArriveSysEvent(sysEventData, traceContext, callback) {
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
        this._messageProducer.produceSuiteTicketArriveTopicMessage(message, traceContext, (err, data)=> {
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

    handleCreateAuthSysEvent(sysEventData, traceContext, callback) {
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
        this._messageProducer.produceCorpCreateAuthTopicMessage(message, traceContext, (err, data)=> {
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

    handleCancelAuthSysEvent(sysEventData, traceContext, callback) {
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
        this._messageProducer.produceCorpCancelAuthTopicMessage(message, traceContext, (err, data)=> {
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

    handleChangeAuthSysEvent(sysEventData, traceContext, callback) {
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
        this._messageProducer.produceCorpChangeAuthTopicMessage(message, traceContext, (err, data)=> {
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