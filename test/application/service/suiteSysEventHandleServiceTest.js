'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const SuiteSysEventHandleService = require('../../../lib/application/service/suiteSysEventHandleService');
const MockMessageProducer = require('../../mock/infrastructure/message/messageProducer');

describe('suiteSysEventHandleService use case test', ()=> {
    let service;
    before(()=> {
        service = new SuiteSysEventHandleService();
        let mockMessageProducer = new MockMessageProducer();
        muk(service, "__SuiteTicketArriveTopicProducer__", mockMessageProducer);
        muk(service, "__CorpCreateAuthTopicProducer__", mockMessageProducer);
        muk(service, "__CorpCancelAuthTopicProducer__", mockMessageProducer);
        muk(service, "__CorpChangeAuthTopicProducer__", mockMessageProducer);
    });
    describe('#handleSuiteTicketArriveSysEvent(sysEventData,callback)', ()=> {
        context('wechat server push sys event infotype is suite_ticket)', ()=> {
            it('return true if handle success', done=> {
                let sysEventData = {};
                sysEventData.SuiteId = "wxfc918a2d200c9a4c";
                sysEventData.InfoType = "suite_ticket";
                sysEventData.TimeStamp = 1403610513;
                sysEventData.SuiteTicket = "suiteticket";
                service.handleSuiteTicketArriveSysEvent(sysEventData, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#handleCreateAuthSysEvent(sysEventData,callback)', ()=> {
        context('wechat server push sys event infotype is create_auth)', ()=> {
            it('return true if handle success', done=> {
                let sysEventData = {};
                sysEventData.SuiteId = "wxfc918a2d200c9a4c";
                sysEventData.InfoType = "create_auth";
                sysEventData.TimeStamp = 1403610513;
                sysEventData.AuthCode = "AuthCode";
                service.handleCreateAuthSysEvent(sysEventData, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#handleCancelAuthSysEvent(sysEventData,callback)', ()=> {
        context('wechat server push sys event infotype is cancel_auth)', ()=> {
            it('return true if handle success', done=> {
                let sysEventData = {};
                sysEventData.SuiteId = "wxfc918a2d200c9a4c";
                sysEventData.InfoType = "cancel_auth";
                sysEventData.TimeStamp = 1403610513;
                sysEventData.AuthCorpId = "wxf8b4f85f3a794e77";
                service.handleCancelAuthSysEvent(sysEventData, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#handleChangeAuthSysEvent(sysEventData,callback)', ()=> {
        context('wechat server push sys event infotype is change_auth)', ()=> {
            it('return true if handle success', done=> {
                let sysEventData = {};
                sysEventData.SuiteId = "wxfc918a2d200c9a4c";
                sysEventData.InfoType = "change_auth";
                sysEventData.TimeStamp = 1403610513;
                sysEventData.AuthCorpId = "wxf8b4f85f3a794e77";
                service.handleChangeAuthSysEvent(sysEventData, (err, isSuccess)=> {
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