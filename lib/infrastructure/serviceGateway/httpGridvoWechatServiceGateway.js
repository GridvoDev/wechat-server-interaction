'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer} = require('../../../lib/util');

const {GRIDVO_WECHAT_SERVICE_HOST = "127.0.0.1", GRIDVO_WECHAT_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    getSuiteAuthUrl(suiteID, traceContext, callback) {
        var url = `http://${GRIDVO_WECHAT_SERVICE_HOST}:${GRIDVO_WECHAT_SERVICE_PORT}/suites/${suiteID}/suite-auth-url`;
        var options = {
            method: "GET",
            path: url
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'wechat-server-interaction',
            remoteServiceName: 'gridvo-wechat'
        }).wrap(mime);
        request(options).then(response => {
            let {suiteAuthUrl, errcode, errmsg} = response.entity;
            if (suiteAuthUrl && errcode == "200" && errmsg == "ok") {
                callback(null, suiteAuthUrl);
            }
            else {
                callback(null, null);
            }
        }).catch(err => {
            callback(err);
        });
    }

    getCorpUser(corpID, suiteID, code, traceContext, callback) {
        var url = `http://${GRIDVO_WECHAT_SERVICE_HOST}:${GRIDVO_WECHAT_SERVICE_PORT}/suites/${suiteID}/corp-users?corpID=${corpID}&code=${code}`;
        var options = {
            method: "GET",
            path: url
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'wechat-server-interaction',
            remoteServiceName: 'gridvo-wechat'
        }).wrap(mime);
        request(options).then(response => {
            let {corpUser, errcode, errmsg} = response.entity;
            if (corpUser && errcode == "200" && errmsg == "ok") {
                callback(null, corpUser);
            }
            else {
                callback(null, null);
            }
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Gateway;