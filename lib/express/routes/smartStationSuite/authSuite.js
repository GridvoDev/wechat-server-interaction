'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var constant = require('../../util/constant');

var router = express.Router();
router.get('/auth-suite', function (req, res) {
    var authSuiteService = req.app.get('bearcat').getBean('authSuiteService');
    async.waterfall([function (cb) {
        authSuiteService.getSuiteAuthURL(constant[constant.smartStationSuiteID].suiteID, cb);
    }], function (err, suiteAuthURL) {
        if (err || !suiteAuthURL) {
            res.end("auth suite fail");
            return;
        }
        res.redirect(suiteAuthURL);
    });
});

module.exports = router;