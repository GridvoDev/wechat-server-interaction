'use strict';

const constant = {};
constant.corpID = "wx9b41eed392c6d447";
constant.token = "GuEccJzML5RxVB8fLhhzRPBda5aJNw5J";
constant.encodingAESKey = "FWj4LPoWHVbHglyHnxC4gifhjFfOn89hfYXMH3Y7N9b";
constant.qyapiPrefix = "https://qyapi.weixin.qq.com/cgi-bin/";
constant.smartgridSuiteID = "tj75d1122acf5ed4aa";
const smartgridSuite = constant.smartgridSuiteID;
constant[smartgridSuite] = {};
constant[smartgridSuite].suiteID = "tj75d1122acf5ed4aa";
constant[smartgridSuite].suiteSecret = "YpLfaMsOAR0e0TKSSjQRNfgIMd-bHew9kyNMqHghaHcF9HOdHBGXNs7CNbOiPER1";
const waterStationApp = "1";
constant[smartgridSuite][waterStationApp] = {};
module.exports = constant;