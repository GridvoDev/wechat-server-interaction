'use strict';

function Service() {

};

Service.prototype.authCallBackURLSyn = function (authParameter) {
    if (!authParameter.signature || !authParameter.timestamp || !authParameter.nonce || !authParameter.encrypt) {
        return null;
    }
    return "echostr";
};

Service.prototype.parseCallBackData = function (parseParameter, callback) {
    if (!parseParameter.signature || !parseParameter.timestamp || !parseParameter.nonce || !parseParameter.cbXMLString) {
        callback(null, null);
        return;
    }
    var data = {};
    data.SuiteId = "SuiteId";
    data.InfoType = parseParameter.nonce;
    data.TimeStamp = 1403610513;
    data.SuiteTicket = "SuiteTicket";
    callback(null, data);
};

module.exports = Service;