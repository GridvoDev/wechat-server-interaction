'use strict';

class MessageProducer {
    produceMessage(message, callback) {
        callback(null, {"test-topic": {}});
    }

    close() {

    }
}

module.exports = MessageProducer;