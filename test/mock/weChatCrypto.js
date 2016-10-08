'use strict';

function WeChatCrypto() {
};

WeChatCrypto.prototype.getSignature = function () {
    return "signature";
};

WeChatCrypto.prototype.decrypt = function (encrypt) {
    if (encrypt == "encrypt") {
        return {message: "echostr"};
    }
    return {message: "<xml><ToUserName><![CDATA[userID]]></ToUserName><MsgType><![CDATA[event]]></MsgType></xml>"};
};

module.exports = WeChatCrypto;