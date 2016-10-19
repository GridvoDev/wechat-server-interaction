var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var completeAuthRouter = require('../../../../lib/express/routes/smartStationSuite/completeAuth.js');

describe('completeAuth route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.waterfall([
            function (callback) {
                app = express();
                app.use('/suites/smart-station-suite', completeAuthRouter);
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
    describe('#get:/suites/smart-station-suite/complete-auth?auth_code=&expires_in=&state=', function () {
        context('corp auth this suite', function () {
            it('should response fail text if query is fail', function (done) {
                request(server)
                    .get(`/suites/smart-station-suite/complete-auth`)
                    .expect(200)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it('should response fail text if authSuiteService completeAuth methods callback false', function (done) {
                request(server)
                    .get(`/suites/smart-station-suite/complete-auth?auth_code=fail&expires_in=1200&state=ok`)
                    .expect(200)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it('should response success text if authSuiteService completeAuth methods callback true', function (done) {
                request(server)
                    .get(`/suites/smart-station-suite/complete-auth?auth_code=xxxxx&expires_in=1200&state=ok`)
                    .expect(200)
                    .end((err, res)=> {
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