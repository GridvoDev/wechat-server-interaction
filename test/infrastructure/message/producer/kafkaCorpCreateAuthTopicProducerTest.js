'use strict';
var kafka = require('kafka-node');
var _ = require('underscore');
var should = require('should');
var muk = require('muk');
var KafkaCorpCreateAuthTopicProducer = require('../../../../lib/infrastructure/message/producer/kafkaCorpCreateAuthTopicProducer');

describe('kafkaCorpCreateAuthTopicProducer use case test', function () {
    var producer;
    var consumer;
    before(function (done) {
        var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
        var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
        var Producer = kafka.Producer;
        var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
        var initProducer = new Producer(client);
        initProducer.on('ready', function () {
            initProducer.createTopics(['corp-create-auth'], true, (err, data)=> {
                client.refreshMetadata(['corp-create-auth'], ()=> {
                    producer = new KafkaCorpCreateAuthTopicProducer();
                    initProducer.close(()=> {
                        done();
                    });
                });
            });
        });
        initProducer.on('error', (err)=> {
            done(err);
        });
    });
    describe('#produceMessage(message, callback)', function () {
        context('produce corp-create-auth topic message', function () {
            it('should return true if message is send success', function (done) {
                var message = {
                    suiteID: "suiteID",
                    authCode: "authCode",
                    timestamp: 1403610513000
                };
                producer.produceMessage(message, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
                    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
                    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
                    var topics = [{
                        topic: "corp-create-auth"
                    }];
                    var options = {
                        groupId: "corp-auth-suite-manage-group"
                    };
                    consumer = new kafka.Consumer(client, topics, options);
                    consumer.on('message', function (message) {
                        var data = JSON.parse(message.value);
                        data.suiteID.should.be.eql("suiteID");
                        data.authCode.should.be.eql("authCode");
                        data.timestamp.should.be.eql(1403610513000);
                        done();

                    });
                });
            });
        });
    });
    after(function () {
        consumer.close(true, ()=> {
        });
    });
});