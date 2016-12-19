'use strict';
const {createMessageProducer} = require("./message");
const {HttpGridvoWechatServiceGateway:GridvoWechatServiceGateway} = require("./serviceGateway");

module.exports = {
    GridvoWechatServiceGateway,
    createMessageProducer
};