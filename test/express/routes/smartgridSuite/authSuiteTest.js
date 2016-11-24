var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var authSuiteRouter = require('../../../../lib/express/routes/smartgridSuite/authSuite');

describe('suiteSysEvent route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.waterfall([
            function (callback) {
                app = express();
                app.use('/suites/smartgrid-suite', authSuiteRouter);
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
    describe('#get:/suites/smartgrid-suite/auth-suite', function () {
        context('corp auth this suite', function () {
            it('should redirect to wechat server auth url', function (done) {
                request(server)
                    .get(`/suites/smartgrid-suite/auth-suite`)
                    .expect(302)
                    .end(()=> {
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