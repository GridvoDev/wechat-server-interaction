'use strict';

class Service {

    getSuiteAuthURL(suiteID, traceContext, callback) {
        if (!suiteID) {
            callback(null, null);
            return;
        }
        callback(null, "suite-auth-url");
    }

    completeAuth(suiteID, authCode, traceContext, callback) {
        if (authCode == "fail") {
            callback(null, false);
            return;
        }
        callback(null, true);
    }
}

module.exports = Service;