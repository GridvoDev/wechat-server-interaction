'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const userAuthRouter = require('../../../../../lib/express/routes/smartgridSuite/waterStation/userAuth');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('suiteSysAuth route use case test', () => {
    let app;
    let server;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use(expressZipkinMiddleware({
                    tracer: createZipkinTracer({}),
                    serviceName: 'test-service'
                }));
                app.use('/suites/smartgrid-suite/apps/water-station', userAuthRouter);
                let mockUserService = {};
                mockUserService.getCorpUser = (corpID, suiteID, code, traceContext, callback) => {
                    if (code == "failCode") {
                        callback(null, null);
                        return;
                    }
                    let corpUserJSON = {
                        userID: "wechat-user-id"
                    };
                    callback(null, corpUserJSON);
                };
                app.set('userService', mockUserService);
                server = app.listen(3001, err => {
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
        co(setup).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('#get:/suites/smartgrid-suite/apps/water-station/user-auth?code=CODE&state=STATE', () => {
        context('wechat server request app user auth callback url', () => {
            it('response "" text to wechat server if no "code or state" param', done => {
                request(server)
                    .get(`/suites/smartgrid-suite/apps/water-station/user-auth`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("");
                        done();
                    });
            });
            it('should response  "" text to wechat server if corpUserJSON is null ', done => {
                request(server)
                    .get(`/suites/smartgrid-suite/apps/water-station/user-auth?code=failCode&state=corp-id`)
                    .expect(200)
                    .expect('Content-Type', /text/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("");
                        done();
                    });
            });
            it('should redirect to app portal if all is ok', done => {
                request(server)
                    .get(`/suites/smartgrid-suite/apps/water-station/user-auth?code=code&state=corp-id`)
                    .expect(302)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        done();
                    });
            });
        });
    });
    after(done => {
        function teardownExpress() {
            return new Promise((resolve, reject) => {
                server.close(err => {
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
        co(teardown).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
});