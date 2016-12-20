const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const authSuiteRouter = require('../../../../lib/express/routes/smartgridSuite/authSuite');
const MockAuthSuiteService = require('../../../mock/application/service/authSuiteService');
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
                app.use('/suites/smartgrid-suite', authSuiteRouter);
                let authSuiteService = new MockAuthSuiteService();
                app.set('authSuiteService', authSuiteService);
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
    describe('#get:/suites/smartgrid-suite/auth-suite', ()=> {
        context('corp auth this suite', ()=> {
            it('should redirect to wechat server auth url', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/auth-suite`)
                    .expect(302)
                    .end((err)=> {
                        if (err) {
                            done(err);
                            return;
                        }
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