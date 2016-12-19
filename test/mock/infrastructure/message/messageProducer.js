'use strict';

class MessageProducer {
    produceSuiteTicketArriveTopicMessage(message, traceContext, callback) {
        callback(null, {"test-topic": {}});
    }

    produceCorpCreateAuthTopicMessage(message, traceContext, callback) {
        callback(null, {"test-topic": {}});
    }

    produceCorpChangeAuthTopicMessage(message, traceContext, callback) {
        callback(null, {"test-topic": {}});
    }

    produceCorpCancelAuthTopicMessage(message, traceContext, callback) {
        callback(null, {"test-topic": {}});
    }

    close() {

    }
}

module.exports = MessageProducer;