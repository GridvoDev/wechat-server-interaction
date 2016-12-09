'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const AuthSuiteService = require('../../../lib/application/service/authSuiteService');
const MockMessageProducer = require('../../mock/infrastructure/message/messageProducer');
const MockGridvoWechatServiceGateway = require('../../mock/infrastructure/serviceGateway/gridvoWechatServiceGateway');

describe('authSuiteService use case test', ()=> {
    let service;
    before(()=> {
        service = new AuthSuiteService();
        let mockGridvoWechatServiceGateway = new MockGridvoWechatServiceGateway();
        muk(service, "__GridvoWechatServiceGateway__", mockGridvoWechatServiceGateway);
        let mockMessageProducer = new MockMessageProducer();
        muk(service, "__CorpCreateAuthTopicProducer__", mockMessageProducer);
    });
    describe('#getSuiteAuthURL(suiteID,callback)', ()=> {
        context('get suite auth url from gridvo-wechat microservice)', ()=> {
            it('return null if gridvo-wechat microservice is fail', done=> {
                service.getSuiteAuthURL("noSuiteID", (err, suiteAuthURL)=> {
                    _.isNull(suiteAuthURL).should.be.eql(true);
                    done();
                });
            });
            it('return url if gridvo-wechat microservice is ok', done=> {
                service.getSuiteAuthURL("suiteID", (err, suiteAuthURL)=> {
                    suiteAuthURL.should.be.eql("suite-auth-url");
                    done();
                });
            });
        });
    });
    describe('#completeAuth(suiteID, authCode, callback)', ()=> {
        context('corp complete auth suite)', ()=> {
            it('return false if no suiteID or authCode', done=> {
                service.completeAuth(null, null, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('return true if CorpCreateAuthTopicProducer produce message success', done=> {
                service.completeAuth("suiteID", "authCode", (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(()=> {
        muk.restore();
    });
});