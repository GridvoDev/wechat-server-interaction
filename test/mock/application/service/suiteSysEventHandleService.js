'use strict';

function Service() {
};

Service.prototype.handleSuiteTicketArriveSysEvent = function (sysEventData, callback) {
    if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.SuiteTicket) {
        callback(null, false);
        return;
    }
    callback(null, true);
};

module.exports = Service;