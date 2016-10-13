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

module.exports = Service;