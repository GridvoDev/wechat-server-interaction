'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const WechatServerCallBackService = require('../../../lib/application/service/wechatServerCallBackService');
const MockWeChatCrypto = require('../../mock/external/weChatCrypto');

describe('wechatServerCallBackService use case test', ()=> {
    let service;
    before(()=> {
        service = new WechatServerCallBackService();
        let mockWeChatCrypto = new MockWeChatCrypto();
        muk(service, "_weChatCrypto", mockWeChatCrypto);
    });
    describe('#authCallBackURLSyn(authParameter)', ()=> {
        context('auth call back url return echostr #authURL(authParameter)', ()=> {
            it('return null if urlParameter no signature,timestamp,nonce,encrypt', ()=> {
                let authParameter = {};
                authParameter.signature = "signature";
                let echostr = service.authCallBackURLSyn(authParameter);
                _.isNull(echostr).should.be.eql(true);
            });
            it('return echostr if urlParameter is ok', ()=> {
                let authParameter = {};
                authParameter.signature = "signature";
                authParameter.timestamp = 13500001234;
                authParameter.nonce = "nonce";
                authParameter.encrypt = "encrypt";
                let echostr = service.authCallBackURLSyn(authParameter);
                echostr.should.be.eql("echostr");
            });
        });
    });
    describe('#parseCallBackData(parseParameter, data)', ()=> {
        context('parse call back data from wechat server', ()=> {
            it('return null if parseParameter no signature,timestamp,nonce,cbXMLString', done=> {
                let parseParameter = {};
                parseParameter.signature = "signature";
                service.parseCallBackData(parseParameter, (err, data)=> {
                    _.isNull(data).should.be.eql(true);
                    done();
                });
            });
            it('return data if parseParameter is ok', done=> {
                let parseParameter = {};
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
    after(()=> {
        muk.restore();
    });
});