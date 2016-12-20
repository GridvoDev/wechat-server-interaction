'use strict';
const _ = require('underscore');
const express = require('express');
const {constant} = require('../../util');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../../util');

let router = express.Router();
router.get('/complete-auth', (req, res)=> {
    let traceContext = traceContextFeach(req);
    let authCode = req.query.auth_code;
    if (!authCode) {
        res.end("fail");
        logger.warn(`${constant[constant.smartgridSuiteID].suiteID} suite auth fail`, traceContext);
        return;
    }
    let authSuiteService = req.app.get('authSuiteService');
    authSuiteService.completeAuth(constant[constant.smartgridSuiteID].suiteID, authCode, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            res.end("fail");
            logger.warn(`${constant[constant.smartgridSuiteID].suiteID} suite auth fail`, traceContext);
            return;
        }
        res.end("success");
        logger.info(`${constant[constant.smartgridSuiteID].suiteID} suite complete auth`, traceContext);
    });
});

module.exports = router;