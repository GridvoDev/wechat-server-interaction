'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('callBackURLAuth use case test', function () {
    var callBackURLAuth;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_express_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            callBackURLAuth = bearcat.getBean('callBackURLAuth');
            done();
        });
    });
    context('auth call back url return echostr #authURL(authParameter, callback)', function () {
        it('return null if urlParameter no signature,timestamp,nonce,encrypt', function (done) {
            var authParameter = {};
            authParameter.signature = "signature";
            callBackURLAuth.authURL(authParameter, function (err, echostr) {
                _.isNull(echostr).should.be.eql(true);
                done();
            });
        });
        it('return echostr if urlParameter is ok', function (done) {
            var authParameter = {};
            authParameter.signature = "signature";
            authParameter.timestamp = 13500001234;
            authParameter.nonce = "nonce";
            authParameter.encrypt = "encrypt";
            callBackURLAuth.authURL(authParameter, function (err, echostr) {
                echostr.should.be.eql("echostr");
                done();
            });
        });
    });
});