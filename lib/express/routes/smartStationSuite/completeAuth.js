'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var constant = require('../../util/constant');

var router = express.Router();
router.get('/complete-auth', function (req, res) {
    var authCode = req.query.auth_code;
    if (!authCode) {
        res.end("fail");
        return;
    }
    var authSuiteService = req.app.get('bearcat').getBean('authSuiteService');
    async.waterfall([function (cb) {
        authSuiteService.completeAuth(constant[constant.smartStationSuiteID].suiteID, authCode, cb);
    }], function (err, isSuccess) {
        if (err || !isSuccess) {
            res.end("fail");
            return;
        }
        res.end("success");
    });
});

module.exports = router;