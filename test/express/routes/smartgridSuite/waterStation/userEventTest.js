'use strict';
var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var userEventRouter = require('../../../../../lib/express/routes/smartgridSuite/waterStation/userEvent');

describe('suiteSysEvent route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.waterfall([
            function (callback) {
                app = express();
                app.use('/suites/smartgrid-suite/apps/water-station', userEventRouter);
                server = app.listen(3001, callback);
            },
            function (callback) {
                var bearcatContextPath = require.resolve("../../../../../unittest_express_bcontext.json");
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
    describe('#get:/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=&timestamp=&nonce=&echostr=', function () {
        context('wechat server request app user event callback url', function () {
            it('should response wechat server', function (done) {
                request(server)
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=13500001234&nonce=nonce`)
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
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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
    describe('#post:/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=&timestamp=&nonce=', function () {
        context('wechat server post app user event request ', function () {
            it("should response text 'undoing' to wechat server", function (done) {
                var body = "<xml><ToUserName><![CDATA[toUser]]</ToUserName><AgentID><![CDATA[toAgentID]]</AgentID><Encrypt><![CDATA[msg_encrypt]]</Encrypt></xml>";
                var req = request(server)
                    .post(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=1403610513&nonce=123123`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("undoing");
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