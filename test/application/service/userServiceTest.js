'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const UserService = require('../../../lib/application/service/userService');

describe('authSuiteService use case test', () => {
    let service;
    before(() => {
        service = new UserService();
    });
    describe('#getCorpUser(corpID, suiteID, code, traceContext, callback)', () => {
        context('get corp user from gridvo-wechat microservice)', () => {
            it('return null if no "corpID  suiteID  code"', done => {
                service.getCorpUser(null, null, null, {}, (err, corpUserJSON) => {
                    _.isNull(corpUserJSON).should.be.eql(true);
                    done();
                });
            });
            it('return corpUserJSON', done => {
                let mockGridvoWechatServiceGateway = {};
                mockGridvoWechatServiceGateway.getCorpUser = (corpID, suiteID, code, traceContext, callback) => {
                    callback(null, {
                        usarID: "wechat-user-id"
                    });
                };
                muk(service, "_gridvoWechatServiceGateway", mockGridvoWechatServiceGateway);
                service.getCorpUser("corpID", "suiteID", "code", {}, (err, corpUserJSON) => {
                    _.isNull(corpUserJSON).should.be.eql(false);
                    corpUserJSON.usarID.should.be.eql("wechat-user-id");
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});