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
constant[smartgridSuite][waterStationApp].appContent = {};
constant[smartgridSuite][waterStationApp].appContent.menu = {
    "button": [
        {
            "type": "view",
            "name": "主控台",
            "url": "http://pascal.gridvo.com"
        },
        {
            "type": "view",
            "name": "气象云图",
            "url": "http://pascal.gridvo.com"
        },
        {
            "name": "班组管理",
            "sub_button": [
                {
                    "type": "view",
                    "name": "运行日志",
                    "url": "http://pascal.gridvo.com"
                },
                {
                    "type": "view",
                    "name": "交接管理",
                    "url": "http://pascal.gridvo.com"
                }
            ]
        }
    ]
};
module.exports = constant;