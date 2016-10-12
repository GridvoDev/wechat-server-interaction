'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('wechatServerCallBackService use case test', function () {
    var service;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_application_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('wechatServerCallBackService');
            done();
        });
    });
    describe('#authCallBackURLSyn(authParameter)', function () {
        context('auth call back url return echostr #authURL(authParameter)', function () {
            it('return null if urlParameter no signature,timestamp,nonce,encrypt', function () {
                var authParameter = {};
                authParameter.signature = "signature";
                var echostr = service.authCallBackURLSyn(authParameter);
                _.isNull(echostr).should.be.eql(true);
            });
            it('return echostr if urlParameter is ok', function () {
                var authParameter = {};
                authParameter.signature = "signature";
                authParameter.timestamp = 13500001234;
                authParameter.nonce = "nonce";
                authParameter.encrypt = "encrypt";
                var echostr = service.authCallBackURLSyn(authParameter);
                echostr.should.be.eql("echostr");
            });
        });
    });
    describe('#parseCallBackData(parseParameter, data)', function () {
        context('parse call back data from wechat server', function () {
            it('return null if parseParameter no signature,timestamp,nonce,cbXMLString', function (done) {
                var parseParameter = {};
                parseParameter.signature = "signature";
                service.parseCallBackData(parseParameter, (err, data)=> {
                    _.isNull(data).should.be.eql(true);
                    done();
                });
            });
            it('return data if parseParameter is ok', function (done) {
                var parseParameter = {};
                parseParameter.signature = "signature";
                parseParameter.timestamp = new Date();
                parseParameter.nonce = "nonce";
                parseParameter.cbXMLString = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><AgentID><![CDATA[toAgentID]]></AgentID><Encrypt><![CDATA[msg_encrypt]]></Encrypt></xml>";
                service.parseCallBackData(parseParameter, (err, data)=> {
                    data.ToUserName.should.be.eql("userID");
                    data.MsgType.should.be.eql("event");
                    done();
                });
            });
        });
    });
});