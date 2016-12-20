'use strict';
const AuthSuiteService = require('./authSuiteService');
const WechatServerCallBackService = require('./wechatServerCallBackService');
const SuiteSysEventHandleService = require('./suiteSysEventHandleService');

let authSuiteService = null;
function createAuthSuiteService(single = true) {
    if (single && authSuiteService) {
        return authSuiteService;
    }
    authSuiteService = new AuthSuiteService();
    return authSuiteService;
};

let wechatServerCallBackService = null;
function createWechatServerCallBackService(single = true) {
    if (single && wechatServerCallBackService) {
        return wechatServerCallBackService;
    }
    wechatServerCallBackService = new WechatServerCallBackService();
    return wechatServerCallBackService;
};

let suiteSysEventHandleService = null;
function createSuiteSysEventHandleService(single = true) {
    if (single && suiteSysEventHandleService) {
        return suiteSysEventHandleService;
    }
    suiteSysEventHandleService = new SuiteSysEventHandleService();
    return suiteSysEventHandleService;
};

module.exports = {
    createAuthSuiteService,
    createWechatServerCallBackService,
    createSuiteSysEventHandleService
};