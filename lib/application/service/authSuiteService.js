'use strict';
const _ = require('underscore');
const {createGridvoWechatServiceGateway, createMessageProducer} = require('../../infrastructure');

class Service {
    constructor() {
        this._messageProducer = createMessageProducer();
        this._gridvoWechatServiceGateway = createGridvoWechatServiceGateway();
    }

    getSuiteAuthURL(suiteID, traceContext, callback) {
        if (!suiteID) {
            callback(null, null);
            return;
        }
        this._gridvoWechatServiceGateway.getSuiteAuthUrl(suiteID, traceContext, (err, suiteAuthURL)=> {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, suiteAuthURL);
            }
        );
    }

    completeAuth(suiteID, authCode, traceContext, callback) {
        if (!suiteID || !authCode) {
            callback(null, false);
            return;
        }
        let message = {
            suiteID: suiteID,
            authCode: authCode,
            timestamp: new Date().getTime()
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
}

module.exports = Service;