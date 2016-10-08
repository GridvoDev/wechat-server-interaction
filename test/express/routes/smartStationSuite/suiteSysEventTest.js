var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var suiteSysEventRouter = require('../../../../lib/express/routes/smartStationSuite/suiteSysEvent.js');
var errCodeTable = require('../../../../lib/express/util/errCode.js');

describe('suiteSysEvent route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.waterfall([
            function (callback) {
                app = express();
                app.use('/smart-station-suite', suiteSysEventRouter);
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
    describe('#get:/smart-station-suite/suite-sys-event?msg_signature=&timestamp=&nonce=&echostr=', function () {
        context('wechat server request suite sys event callback url', function () {
            it('should response wechat server', function (done) {
                request(server)
                    .get(`/smart-station-suite/suite-sys-event?timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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
                    .get(`/smart-station-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce`)
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
                    .get(`/smart-station-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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