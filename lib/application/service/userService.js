'use strict';
const _ = require('underscore');
const {createGridvoWechatServiceGateway} = require('../../infrastructure');

class Service {
    constructor() {
        this._gridvoWechatServiceGateway = createGridvoWechatServiceGateway();
    }

    getCorpUser(corpID, suiteID, code, traceContext, callback) {
        if (!corpID || !suiteID || !code) {
            callback(null, null);
            return;
        }
        this._gridvoWechatServiceGateway.getCorpUser(corpID, suiteID, code, traceContext, (err, corpUserJSON) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, corpUserJSON);
            }
        );
    }
}

module.exports = Service;