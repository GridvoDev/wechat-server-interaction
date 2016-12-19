'use strict';

class Gateway {
    getSuiteAuthUrl(suiteID, traceContext, callback) {
        if (suiteID == "suiteID") {
            callback(null, "suite-auth-url");
        }
        else {
            callback(null, null);
        }
    }
}

module.exports = Gateway;