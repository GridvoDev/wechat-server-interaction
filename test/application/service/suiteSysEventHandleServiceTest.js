'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('suiteSysEventHandleService use case test', function () {
    var service;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_application_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('suiteSysEventHandleService');
            done();
        });
    });
    describe('#handleSuiteTicketArriveSysEvent(sysEventData,callback)', function () {
        context('wechat server push sys event infotype is suite_ticket)', function () {
            it('return true if handle success', function (done) {
                var sysEventData = {};
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
});