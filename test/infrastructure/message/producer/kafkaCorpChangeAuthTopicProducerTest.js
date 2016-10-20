'use strict';
var kafka = require('kafka-node');
var _ = require('underscore');
var should = require('should');
var muk = require('muk');
var KafkaCorpChangeAuthTopicProducer = require('../../../../lib/infrastructure/message/producer/kafkaCorpChangeAuthTopicProducer');

describe('kafkaCorpChangeAuthTopicProducer use case test', function () {
    var producer;
    var consumer;
    before(function () {
        producer = new KafkaCorpChangeAuthTopicProducer();
    });
    describe('#produceMessage(message, callback)', function () {
        context('produce corp-change-auth topic message', function () {
            it('should return true if message is send success', function (done) {
                var message = {
                    suiteID: "suiteID",
                    corpID: "wxf8b4f85f3a794e77",
                    timestamp: 1403610513000
                };
                producer.produceMessage(message, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
                    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
                    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
                    var topics = [{
                        topic: "corp-change-auth"
                    }];
                    var options = {
                        groupId: "corp-auth-suite-manage-group"
                    };
                    consumer = new kafka.Consumer(client, topics, options);
                    consumer.on('message', function (message) {
                        var data = JSON.parse(message.value);
                        data.suiteID.should.be.eql("suiteID");
                        data.corpID.should.be.eql("wxf8b4f85f3a794e77");
                        data.timestamp.should.be.eql(1403610513000);
                        done();

                    });
                });
            });
        });
    });
    after(function () {
        consumer.close(()=> {
        });
    });
})
;