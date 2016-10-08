'use strict';
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var WeChatCrypto = require('wechat-crypto');
var constant = require('./constant');

function CallBackURLAuth() {
    EventEmitter.call(this);
    this.__WeChatCrypto__ = new WeChatCrypto(constant.token, constant.encodingAESKey, constant.corpID);
};

util.inherits(CallBackURLAuth, EventEmitter);

CallBackURLAuth.prototype.authURL = function (authParameter, callback) {
    var echostr = null;
    if (!authParameter.signature || !authParameter.timestamp || !authParameter.nonce || !authParameter.encrypt) {
        callback(null, echostr);
    } else {
        var auth_signature = this.__WeChatCrypto__.getSignature(authParameter.timestamp, authParameter.nonce, authParameter.encrypt);
        if (authParameter.signature == auth_signature) {
            echostr = this.__WeChatCrypto__.decrypt(authParameter.encrypt).message;
            callback(null, echostr);
        }
        else {
            callback(null, echostr);
        }
    }
};

module.exports = CallBackURLAuth;