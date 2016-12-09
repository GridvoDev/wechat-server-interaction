'use strict';

class Service {

    handleSuiteTicketArriveSysEvent(sysEventData, callback) {
        if (!sysEventData.SuiteId || !sysEventData.InfoType || !sysEventData.TimeStamp || !sysEventData.SuiteTicket) {
            callback(null, false);
            return;
        }
        callback(null, true);
    }

    handleCreateAuthSysEvent(sysEventData, callback) {
        callback(null, true);
    }

    handleCancelAuthSysEvent(sysEventData, callback) {
        callback(null, true);
    }

    handleChangeAuthSysEvent(sysEventData, callback) {
        callback(null, true);
    }
}

module.exports = Service;