'use strict';

class Service {

    handleSuiteTicketArriveSysEvent(sysEventData, traceContext, callback) {
        if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.SuiteTicket) {
            callback(null, false);
            return;
        }
        callback(null, true);
    }

    handleCreateAuthSysEvent(sysEventData, traceContext, callback) {
        callback(null, true);
    }

    handleCancelAuthSysEvent(sysEventData, traceContext, callback) {
        callback(null, true);
    }

    handleChangeAuthSysEvent(sysEventData, traceContext, callback) {
        callback(null, true);
    }
}

module.exports = Service;