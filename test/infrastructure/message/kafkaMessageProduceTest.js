'use strict';
const kafka = require('kafka-node');
const _ = require('underscore');
const co = require('co');
const should = require('should');
const KafkaMessageProducer = require('../../../lib/infrastructure/message/kafkaMessageProduce');

describe('KafkaMessageProducer(topic, options) use case test', ()=> {
    let messageProducer;
    let consumer;
    before(done=> {
        function setupKafka() {
            return new Promise((resolve, reject)=> {
                let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
                let client = new kafka.Client(
                    `${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`,
                    "wechat-server-interaction-test-producer-client");
                let initProducer = new kafka.Producer(client);
                initProducer.on('ready', ()=> {
                    initProducer.createTopics(["test-topic"], true, (err, data)=> {
                        if (err) {
                            reject(err)
                        }
                        client.refreshMetadata(["test-topic"], (err)=> {
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
        };
        function* setup() {
            yield setupKafka();
        };
        co(setup).then(()=> {
            messageProducer = new KafkaMessageProducer("test-topic");
            done();
        }).catch(err=> {
            done(err);
        });
    });
    describe('#produceMessage(message, callback)', ()=> {
        context('produce topic message', ()=> {
            it('should return null if no topic or message', done=> {
                let message = null;
                messageProducer.produceMessage(message, (err, data)=> {
                    _.isNull(data).should.be.eql(true);
                    done();
                });
            });
            it('should return data if message is send success', done=> {
                let message = {
                    suiteID: "suiteID",
                    corpID: "wxf8b4f85f3a794e77",
                    timestamp: 1403610513000
                };
                messageProducer.produceMessage(message, (err, data)=> {
                    _.isNull(data).should.be.eql(false);
                    let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
                    let client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
                    let topics = [{
                        topic: "test-topic"
                    }];
                    let options = {
                        groupId: "test-group"
                    };
                    consumer = new kafka.HighLevelConsumer(client, topics, options);
                    consumer.on('message', function (message) {
                        let data = JSON.parse(message.value);
                        data.suiteID.should.be.eql("suiteID");
                        data.corpID.should.be.eql("wxf8b4f85f3a794e77");
                        data.timestamp.should.be.eql(1403610513000);
                        done();
                    });
                });
            });
            after(done=> {
                consumer.close(true, (err)=> {
                    if (err) {
                        done(err);
                    }
                    done();
                });
            });
        });
    });
    after(done=> {
        messageProducer.close().then(done);
    });
});