'use strict';
var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var suiteSysEventRouter = require('../../../../lib/express/routes/smartgridSuite/suiteSysEvent');

describe('suiteSysEvent route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.waterfall([
            function (callback) {
                app = express();
                app.use('/suites/smartgrid-suite', suiteSysEventRouter);
                server = app.listen(3001, callback);
            },
            function (callback) {
                var bearcatContextPath = require.resolve("../../../../unittest_express_bcontext.json");
                bearcat.createApp([bearcatContextPath]);
                bearcat.start(function () {
                    app.set('bearcat', bearcat);
                    callback(null);
                });
            }
        ], function (err) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
    describe('#get:/suites/smartgrid-suite/suite-sys-event?msg_signature=&timestamp=&nonce=&echostr=', function () {
        context('wechat server request suite sys event callback url', function () {
            it('should response wechat server', function (done) {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?timestamp=13500001234&nonce=nonce&echostr=encrypt`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("auth parameter err");
                        done();
                    });
            });
            it('should response wechat server', function (done) {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("WeChat server had auth this URL");
                        done();
                    });
            });
            it('should response wechat server', function (done) {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce&echostr=encrypt`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("echostr");
                        done();
                    });
            });
        });
    });
    describe('#post:/suites/smartgrid-suite/suite-sys-event?msg_signature=&timestamp=&nonce=', function () {
        context('wechat server post suite sys event request ', function () {
            it("should response fail text to wechat server,if InfoType is unknown", function (done) {
                var body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[un_known]]></InfoType><TimeStamp>1403610513</TimeStamp><SuiteTicket><![CDATA[SuiteTicket]]></SuiteTicket></xml>";
                var req = request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=un_known`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it("should response success text to wechat server,and suite-ticket-arrive topic message producer's  produceMessage methods can be call if InfoType is suite_ticket", function (done) {
                var body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[suite_ticket]]></InfoType><TimeStamp>1403610513</TimeStamp><SuiteTicket><![CDATA[SuiteTicket]]></SuiteTicket></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=suite_ticket`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-create-auth topic message producer's  produceMessage methods can be call if InfoType is create_auth", function (done) {
                var body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[create_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=create_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-cancel-auth topic message producer's  produceMessage methods can be call if InfoType is cancel_auth", function (done) {
                var body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[cancel_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=cancel_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-change-auth topic message producer's  produceMessage methods can be call if InfoType is change_auth", function (done) {
                var body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[change_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=change_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
        });
    });
    after(function (done) {
        async.parallel([
            function (callback) {
                server.close(callback);
            }], function (err, results) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
});