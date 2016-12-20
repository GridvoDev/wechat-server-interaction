'use strict';
const HttpGridvoWechatServiceGateway = require('./httpGridvoWechatServiceGateway');

let gateway = null;
function createGridvoWechatServiceGateway(single = true) {
    if (single && gateway) {
        return gateway;
    }
    gateway = new HttpGridvoWechatServiceGateway();
    return gateway;
};

module.exports = {
    createGridvoWechatServiceGateway
};