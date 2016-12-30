'use strict';
const _ = require('underscore');
const express = require('express');
const {constant} = require('../../util');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../../util');

let router = express.Router();
router.get('/auth-suite', (req, res)=> {
    let authSuiteService = req.app.get('authSuiteService');
    let traceContext = traceContextFeach(req);
    authSuiteService.getSuiteAuthURL(constant[constant.smartgridSuiteID].suiteID, traceContext, (err, suiteAuthURL)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!suiteAuthURL) {
            res.end("get suite auth url fail");
            logger.error("get suite auth url fail", traceContext);
            return;
        }
        res.redirect(suiteAuthURL);
    });
});

module.exports = router;