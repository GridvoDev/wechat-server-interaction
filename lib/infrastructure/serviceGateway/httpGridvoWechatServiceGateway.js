'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const {GRIDVO_WECHAT_SERVICE_HOST = "127.0.0.1", GRIDVO_WECHAT_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this.__HttpRequest__ = rest.wrap(mime);
    }

    getSuiteAuthUrl(suiteID, callback) {
        var url = `http://${GRIDVO_WECHAT_SERVICE_HOST}:${GRIDVO_WECHAT_SERVICE_PORT}/suites/${suiteID}/suite-auth-url`;
        var options = {
            method: "GET",
            path: url
        };
        this.__HttpRequest__(options).then(response=> {
            let {suiteAuthUrl, errcode, errmsg} = response.entity;
            if (suiteAuthUrl && errcode == "200" && errmsg == "ok") {
                callback(null, suiteAuthUrl);
            }
            else {
                callback(null, null);
            }
        }).catch(err=> {
            callback(err);
        });
    }
}

module.exports = Gateway;