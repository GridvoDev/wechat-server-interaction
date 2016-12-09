'use strict';

class Producer {
    produceMessage(message, callback) {
        callback(null, true);
    }
}

module.exports = Producer;