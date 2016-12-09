'use strict';
const kafka = require('kafka-node');

let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
class MessageProducer {
    constructor(topic = "no-topic", options = {}) {
        this.topic = topic;
        let clientDefaults = {
            connectionString: `${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`,
            clientId: `wechat-server-interaction-${this.topic}-producer-client`,
            zkOpts: {}
        };
        let clientOpts = Object.assign({}, clientDefaults, options.clientOpts || {});
        let producerDefaults = {
            requireAcks: 1
        };
        let producerOpts = Object.assign({}, producerDefaults, options.producerOpts || {});
        let self = this;
        this.producerPromise = new Promise((resolve, reject) => {
            self.client = new kafka.Client(
                clientOpts.connectionString, clientOpts.clientId, clientOpts.zkOpts
            );
            let producer = new kafka.HighLevelProducer(self.client, producerOpts);
            producer.on('ready', ()=> {
                resolve(producer);
            });
            producer.on('error', err=> {
                if (self.client) {
                    self.client.close();
                }
                reject(err);
            });
        });
    }

    produceMessage(message, callback) {
        if (!this.topic || this.topic == "no-topic" || !message) {
            callback(null, null);
            return;
        }
        var payloads = [{
            topic: this.topic,
            messages: [JSON.stringify(message)]
        }];
        this.producerPromise.then(producer=> {
            producer.send(payloads, (err, data) => {
                callback(null, data);
            });
        }).catch(err=> {
            callback(err);
        });
    }

    close() {
        return (this.producerPromise.then(()=> {
            return new Promise(resolve=> this.client.close(resolve));
        }));
    }
}

module.exports = MessageProducer;