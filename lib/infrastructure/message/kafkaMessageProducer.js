'use strict';
const kafka = require('kafka-node');
const {KafkaZipkinMessageProducer} = require('gridvo-common-js');

class MessageProducer {
    constructor() {
        this._producer = new KafkaZipkinMessageProducer({
            serviceName: "wechat-server-interaction"
        });
    }

    produceSuiteTicketArriveTopicMessage(message, traceContext, callback) {
        this._producer.produceMessage("suite-ticket-arrive", message, traceContext, callback);
    }

    produceCorpCreateAuthTopicMessage(message, traceContext, callback) {
        this._producer.produceMessage("corp-create-auth", message, traceContext, callback);
    }

    produceCorpChangeAuthTopicMessage(message, traceContext, callback) {
        this._producer.produceMessage("corp-change-auth", message, traceContext, callback);
    }

    produceCorpCancelAuthTopicMessage(message, traceContext, callback) {
        this._producer.produceMessage("corp-cancel-auth", message, traceContext, callback);
    }

    close() {
        return this._producer.close();
    }
}

module.exports = MessageProducer;