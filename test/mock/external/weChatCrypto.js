'use strict';

class WeChatCrypto {
    getSignature() {
        return "signature";
    }

    decrypt(encrypt) {
        if (encrypt == "encrypt") {
            return {message: "echostr"};
        }
        return {message: "<xml><ToUserName><![CDATA[userID]]></ToUserName><MsgType><![CDATA[event]]></MsgType></xml>"};
    }
}

module.exports = WeChatCrypto;