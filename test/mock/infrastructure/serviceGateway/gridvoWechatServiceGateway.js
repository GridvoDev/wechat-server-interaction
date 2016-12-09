'use strict';

class Gateway {
    getSuiteAuthUrl(suiteID, callback) {
        if (suiteID == "suiteID") {
            callback(null, "suite-auth-url");
        }
        else {
            callback(null, null);
        }
    }
}

module.exports = Gateway;