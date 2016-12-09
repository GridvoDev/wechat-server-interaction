const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const completeAuthRouter = require('../../../../lib/express/routes/smartgridSuite/completeAuth');
const MockAuthSuiteService = require('../../../mock/application/service/authSuiteService');

describe('completeAuth route use case test', ()=> {
    let app;
    let server;
    before(done=> {
        function setupExpress() {
            return new Promise((resolve, reject)=> {
                app = express();
                app.use('/suites/smartgrid-suite', completeAuthRouter);
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
    describe('#get:/suites/smartgrid-suite/complete-auth?auth_code=&expires_in=&state=', ()=> {
        context('corp auth this suite', ()=> {
            it('should response fail text if query is fail', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/complete-auth`)
                    .expect(200)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it('should response fail text if authSuiteService completeAuth methods callback false', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/complete-auth?auth_code=fail&expires_in=1200&state=ok`)
                    .expect(200)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.text.should.be.eql("fail");
                        done();
                    });
            });
            it('should response success text if authSuiteService completeAuth methods callback true', done=> {
                request(server)
                    .get(`/suites/smartgrid-suite/complete-auth?auth_code=xxxxx&expires_in=1200&state=ok`)
                    .expect(200)
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