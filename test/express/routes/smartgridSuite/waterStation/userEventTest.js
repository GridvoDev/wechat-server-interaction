'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const userEventRouter = require('../../../../../lib/express/routes/smartgridSuite/waterStation/userEvent');
const MockSuiteSysEventHandleService = require('../../../../mock/application/service/suiteSysEventHandleService');
const MockWechatServerCallBackService = require('../../../../mock/application/service/wechatServerCallBackService');
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
                app.use('/suites/smartgrid-suite/apps/water-station', userEventRouter);
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
    describe('#get:/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=&timestamp=&nonce=&echostr=', ()=> {
        context('wechat server request app user event callback url', ()=> {
            it('should response wechat server', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=13500001234&nonce=nonce`)
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
                    .get(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=13500001234&nonce=nonce&echostr=encrypt`)
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
    describe('#post:/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=&timestamp=&nonce=', ()=> {
        context('wechat server post app user event request ', ()=> {
            it("should response text 'undoing' to wechat server", done=> {
                var body = "<xml><ToUserName><![CDATA[toUser]]</ToUserName><AgentID><![CDATA[toAgentID]]</AgentID><Encrypt><![CDATA[msg_encrypt]]</Encrypt></xml>";
                var req = request(server)
                    .post(`/suites/smartgrid-suite/apps/water-station/user-event?msg_signature=signature&timestamp=1403610513&nonce=123123`)
                    .send(body)
                    .set('Content-Type', 'application/octet-stream')
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("undoing");
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