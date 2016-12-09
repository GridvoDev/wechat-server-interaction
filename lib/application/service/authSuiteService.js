'use strict';
const _ = require('underscore');
const {GridvoWechatServiceGateway, MessageProducer} = require('../../infrastructure');

class Service {
    constructor() {
        this.__CorpCreateAuthTopicProducer__ = new MessageProducer("corp-create-auth");
        this.__GridvoWechatServiceGateway__ = new GridvoWechatServiceGateway();
    }

    getSuiteAuthURL(suiteID, callback) {
        if (!suiteID) {
            callback(null, null);
            return;
        }
        this.__GridvoWechatServiceGateway__.getSuiteAuthUrl(suiteID, (err, suiteAuthURL)=> {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, suiteAuthURL);
            }
        );
    }

    completeAuth(suiteID, authCode, callback) {
        if (!suiteID || !authCode) {
            callback(null, false);
            return;
        }
        let message = {
            suiteID: suiteID,
            authCode: authCode,
            timestamp: new Date().getTime()
        };
        let self = this;
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
}

module.exports = Service;