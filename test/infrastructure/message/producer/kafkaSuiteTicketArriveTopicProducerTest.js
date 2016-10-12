'use strict';
var kafka = require('kafka-node');
var _ = require('underscore');
var should = require('should');
var muk = require('muk');
var KafkaSuiteTicketArriveTopicProducer = require('../../../../lib/infrastructure/message/producer/kafkaSuiteTicketArriveTopicProducer');

describe('kafkaSuiteTicketArriveTopicProducer use case test', function () {
    var producer;
    var consumer;
    before(function () {
        producer = new KafkaSuiteTicketArriveTopicProducer();
    });
    describe('#produceMessage(message, callback)', function () {
        context('produce suite-ticket-arrive topic message', function () {
            it('should return true if message is send success', function (done) {
                var message = {
                    suiteID: "suiteID",
                    ticket: "ticket",
                    dateTime: 1403610513000
                };
                producer.produceMessage(message, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
                    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
                    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
                    var topics = [{
                        topic: "suite-ticket-arrive"
                    }];
                    var options = {
                        groupId: "suite-access-token-manage-group"
                    };
                    consumer = new kafka.Consumer(client, topics, options);
                    consumer.on('message', function (message) {
                        var suiteTicketData = JSON.parse(message.value);
                        suiteTicketData.suiteID.should.be.eql("suiteID");
                        suiteTicketData.ticket.should.be.eql("ticket");
                        suiteTicketData.dateTime.should.be.eql(1403610513000);
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