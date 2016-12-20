'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const suiteSysEventRouter = require('../../../../lib/express/routes/smartgridSuite/suiteSysEvent');
const MockSuiteSysEventHandleService = require('../../../mock/application/service/suiteSysEventHandleService');
const MockWechatServerCallBackService = require('../../../mock/application/service/wechatServerCallBackService');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('suiteSysEvent route use case test', ()=> {
    let app;
    let server;
    before(done=> {
        function setupExpress() {
            return new Promise((resolve, reject)=> {
                app = express();
                app.use(expressZipkinMiddleware({
                    tracer: createZipkinTracer({}),
                    serviceName: 'test-service'
                }));
                app.use('/suites/smartgrid-suite', suiteSysEventRouter);
                let suiteSysEventHandleService = new MockSuiteSysEventHandleService();
                app.set('suiteSysEventHandleService', suiteSysEventHandleService);
                let wechatServerCallBackService = new MockWechatServerCallBackService();
                app.set('wechatServerCallBackService', wechatServerCallBackService);
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
            done();
        }).catch(err=> {
            done(err);
        });
    });
    describe('#get:/suites/smartgrid-suite/suite-sys-event?msg_signature=&timestamp=&nonce=&echostr=', ()=> {
        context('wechat server request suite sys event callback url', ()=> {
            it('should response wechat server', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?timestamp=13500001234&nonce=nonce&echostr=encrypt`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("auth parameter err");
                        done();
                    });
            });
            it('should response wechat server', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("weChat server had auth this url");
                        done();
                    });
            });
            it('should response wechat server', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=13500001234&nonce=nonce&echostr=encrypt`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("echostr");
                        done();
                    });
            });
        });
    });
    describe('#post:/suites/smartgrid-suite/suite-sys-event?msg_signature=&timestamp=&nonce=', ()=> {
        context('wechat server post suite sys event request ', ()=> {
            it("should response fail text to wechat server,if InfoType is unknown", done=> {
                let body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[un_known]]></InfoType><TimeStamp>1403610513</TimeStamp><SuiteTicket><![CDATA[SuiteTicket]]></SuiteTicket></xml>";
                let req = request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=un_known`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it("should response success text to wechat server,and suite-ticket-arrive topic message producer's  produceMessage methods can be call if InfoType is suite_ticket", done=> {
                let body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[suite_ticket]]></InfoType><TimeStamp>1403610513</TimeStamp><SuiteTicket><![CDATA[SuiteTicket]]></SuiteTicket></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=suite_ticket`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-create-auth topic message producer's  produceMessage methods can be call if InfoType is create_auth", done=> {
                let body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[create_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=create_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-cancel-auth topic message producer's  produceMessage methods can be call if InfoType is cancel_auth", done=> {
                let body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[cancel_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=cancel_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
                        done();
                    });
            });
            it("should response success text to wechat server,and corp-change-auth topic message producer's  produceMessage methods can be call if InfoType is change_auth", done=> {
                let body = "<xml><SuiteId><![CDATA[SuiteId]]></SuiteId><InfoType> <![CDATA[change_auth]]></InfoType><TimeStamp>1403610513</TimeStamp></xml>";
                request(server)
                    .post(`/suites/smartgrid-suite/suite-sys-event?msg_signature=signature&timestamp=1403610513&nonce=change_auth`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("success");
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
        });
    });
});