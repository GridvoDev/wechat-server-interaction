'use strict';
const kafka = require('kafka-node');
const {KafkaZipkinMessageProducer} = require('gridvo-common-js');

class MessageProducer {
    constructor() {
        this._initTopics = new Promise((resolve, reject)=> {
            let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
            let client = new kafka.Client(
                `${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`,
                "wechat-server-interaction-producer-client");
            let initProducer = new kafka.Producer(client);
            initProducer.on('ready', ()=> {
                initProducer.createTopics(["suite-ticket-arrive",
                    "corp-create-auth",
                    "corp-change-auth",
                    "corp-cancel-auth"], true, (err, data)=> {
                    if (err) {
                        reject(err)
                    }
                    client.refreshMetadata(["suite-ticket-arrive",
                        "corp-create-auth",
                        "corp-change-auth",
                        "corp-cancel-auth"], (err)=> {
                        if (err) {
                            reject(err)
                        }
                        initProducer.close((err)=> {
                            if (err) {
                                reject(err)
                            }
                            resolve();
                        });
                    });
                });
            });
            initProducer.on('error', (err)=> {
                reject(err);
            });
        });
        this._producer = new KafkaZipkinMessageProducer({
            serviceName: "wechat-server-interaction"
        });
    }

    produceSuiteTicketArriveTopicMessage(message, traceContext, callback) {
        this._initTopics.then(()=> {
            this._producer.produceMessage("suite-ticket-arrive", message, traceContext, callback);
        }).catch(err=> {
            callback(err);
        });
    }

    produceCorpCreateAuthTopicMessage(message, traceContext, callback) {
        this._initTopics.then(()=> {
            this._producer.produceMessage("corp-create-auth", message, traceContext, callback);
        }).catch(err=> {
            callback(err);
        });
    }

    produceCorpChangeAuthTopicMessage(message, traceContext, callback) {
        this._initTopics.then(()=> {
            this._producer.produceMessage("corp-change-auth", message, traceContext, callback);
        }).catch(err=> {
            callback(err);
        });
    }

    produceCorpCancelAuthTopicMessage(message, traceContext, callback) {
        this._initTopics.then(()=> {
            this._producer.produceMessage("corp-cancel-auth", message, traceContext, callback);
        }).catch(err=> {
            callback(err);
        });
    }

    close() {
        return this._producer.close();
    }
}

module.exports = MessageProducer;