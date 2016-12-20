'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const HttpGridvoWechatServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpGridvoWechatServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpGridvoWechatServiceGateway use case test', ()=> {
    let app;
    let server;
    let gateway;
    before(done=> {
        function setupExpress() {
            return new Promise((resolve, reject)=> {
                app = express();
                app.get('/suites/:suiteID/suite-auth-url', (req, res)=> {
                    if (req.params.suiteID == "suiteID") {
                        res.json({
                            errcode: 200,
                            errmsg: "ok",
                            suiteAuthUrl: "suite-auth-url"
                        });
                    }
                    else {
                        res.json({
                            errcode: 400,
                            errmsg: "fail"
                        });
                    }
                });
                server = app.listen(3001, err=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* setup() {
            yield setupExpress();
        };
        co(setup).then(()=> {
            gateway = new HttpGridvoWechatServiceGateway();
            done();
        }).catch(err=> {
            done(err);
        });
    });
    describe('getSuiteAuthUrl(suiteID, traceContext, callback)', ()=> {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('get suite auth url)', ()=> {
            it('should return null if no this suite or other fail', done=> {
                gateway.getSuiteAuthUrl("noSuiteID", traceContext, (err, url)=> {
                    _.isNull(url).should.be.eql(true);
                    done();
                });
            });
            it('is ok', done=> {
                gateway.getSuiteAuthUrl("suiteID", traceContext, (err, url)=> {
                    url.should.be.eql("suite-auth-url");
                    done();
                });
            });
        });
    });
    after(done=> {
        function teardownExpress() {
            return new Promise((resolve, reject)=> {
                server.close(err=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* teardown() {
            yield teardownExpress();
        };
        co(teardown).then(()=> {
            done();
        }).catch(err=> {
            done(err);
        })
    });
});