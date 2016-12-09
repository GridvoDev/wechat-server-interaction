'use strict';
const {KafkaMessageProducer:MessageProducer} = require("./message");
const {HttpGridvoWechatServiceGateway:GridvoWechatServiceGateway} = require("./serviceGateway");

module.exports = {
    GridvoWechatServiceGateway,
    MessageProducer
};