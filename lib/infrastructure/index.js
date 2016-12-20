'use strict';
const {createMessageProducer} = require("./message");
const {createGridvoWechatServiceGateway} = require("./serviceGateway");

module.exports = {
    createGridvoWechatServiceGateway,
    createMessageProducer
};