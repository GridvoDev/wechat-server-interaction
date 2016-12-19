'use strict';
const kafka = require('kafka-node');
const _ = require('underscore');
const should = require('should');
const KafkaMessageProducer = require('../../../lib/infrastructure/message/kafkaMessageProducer');

describe('KafkaMessageProducer(topic, options) use case test', ()=> {
    let messageProducer;
    let consumer;
    before(()=> {
        messageProducer = new KafkaMessageProducer();
    });
    describe('#produce{Topic}Message(message, traceContext, callback)', ()=> {
        context('produce topic message', ()=> {
            it('should return null if no message', done=> {
                let message = null;
                let traceContext = {};
                messageProducer.produceSuiteTicketArriveTopicMessage(message, traceContext, (err, data)=> {
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
                let traceContext = {};
                messageProducer.produceSuiteTicketArriveTopicMessage(message, traceContext, (err, data)=> {
                    _.isNull(data).should.be.eql(false);
                    let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
                    let client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
                    let topics = [{
                        topic: "suite-ticket-arrive"
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