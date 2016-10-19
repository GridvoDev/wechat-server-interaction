'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('authSuiteService use case test', function () {
    var service;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_application_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('authSuiteService');
            done();
        });
    });
    describe('#getSuiteAuthURL(suiteID,callback)', function () {
        context('get suite auth url from gridvo-wechat microservice)', function () {
            it('return null if gridvo-wechat microservice is fail', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, null);
                };
                muk(service, "__httpRequest__", mockRequest);
                service.getSuiteAuthURL("suiteID", (err, suiteAuthURL)=> {
                    _.isNull(suiteAuthURL).should.be.eql(true);
                    done();
                });
            });
            it('return url if gridvo-wechat microservice is ok', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {
                        errcode: 200,
                        errmsg: "ok",
                        suite_auth_url: "suite-auth-url"
                    });
                };
                muk(service, "__httpRequest__", mockRequest);
                service.getSuiteAuthURL("suiteID", (err, suiteAuthURL)=> {
                    suiteAuthURL.should.be.eql("suite-auth-url");
                    done();
                });
            });
        });
    });
    describe('#completeAuth(suiteID, authCode, callback)', function () {
        context('corp complete auth suite)', function () {
            it('return false if no suiteID or authCode', function (done) {
                service.completeAuth(null, null, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('return true if CorpCreateAuthTopicProducer produce message success', function (done) {
                service.completeAuth("suiteID", "authCode", (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
});