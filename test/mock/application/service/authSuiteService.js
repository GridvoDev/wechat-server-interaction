'use strict';

function Service() {
};

Service.prototype.getSuiteAuthURL = function (suiteID, callback) {
    if (!suiteID) {
        callback(null, null);
        return;
    }
    callback(null, "suite-auth-url");
};

Service.prototype.completeAuth = function (suiteID, authCode, callback) {
    if (authCode == "fail") {
        callback(null, false);
        return;
    }
    callback(null, true);
};

module.exports = Service;