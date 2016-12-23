'use strict';
const co = require('co');
const xml2js = require('xml2js');
const WeChatCrypto = require('wechat-crypto');
const {constant} = require('../util');

class Service {
    constructor() {
        this._weChatCrypto = new WeChatCrypto(constant.token, constant.encodingAESKey, constant.corpID);
    }

    authCallBackURLSyn(authParameter, traceContext) {
        let echostr = null;
        let {signature, timestamp, nonce, encrypt} = authParameter;
        if (!signature || !timestamp || !nonce || !encrypt) {
            return null;
        }
        let auth_signature = this._weChatCrypto.getSignature(timestamp, nonce, encrypt);
        if (signature == auth_signature) {
            echostr = this._weChatCrypto.decrypt(encrypt).message;
        }
        return echostr;
    }

    parseCallBackData(parseParameter, traceContext, callback) {
        let {signature, timestamp, nonce, cbXMLString} = parseParameter;
        if (!signature || !timestamp || !nonce || !cbXMLString) {
            callback(null, null);
            return;
        }
        let self = this;

        function formatMessage(result) {
            let message = {};
            if (typeof result === 'object') {
                for (let key in result) {
                    if (!Array.isArray(result[key]) || result[key].length === 0) {
                        continue;
                    }
                    if (result[key].length === 1) {
                        let val = result[key][0];
                        if (typeof val === 'object') {
                            message[key] = formatMessage(val);
                        } else {
                            message[key] = (val || '').trim();
                        }
                    } else {
                        message[key] = [];
                        result[key].forEach(function (item) {
                            message[key].push(formatMessage(item));
                        });
                    }
                }
            }
            return message;
        };
        function parseXMLString(xml) {
            return new Promise((resolve, reject)=> {
                xml2js.parseString(xml, {trim: true}, (err, result)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }

        function* parse() {
            let firstData = yield parseXMLString(cbXMLString);
            let xml = formatMessage(firstData.xml);
            let encryptMessage = xml.Encrypt;
            let auth_signature = self._weChatCrypto.getSignature(timestamp, nonce, encryptMessage);
            if (signature != auth_signature) {
                return null;
            }
            else {
                let decrypted = self._weChatCrypto.decrypt(encryptMessage);
                let messageXMLString = decrypted.message;
                let secondData = yield parseXMLString(messageXMLString);
                let data = formatMessage(secondData.xml);
                return data
            }
        };
        co(parse).then(data=> {
            callback(null, data);
        }).catch(err=> {
            callback(err);
        });
    }
}
module.exports = Service;