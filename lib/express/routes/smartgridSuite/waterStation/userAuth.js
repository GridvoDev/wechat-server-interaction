'use strict';
const _ = require('underscore');
const express = require('express');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../../../util');
const {constant} = require('../../../util');

let router = express.Router();
router.get('/user-auth', (req, res) => {
    let traceContext = traceContextFeach(req);
    let {code, state:corpID} = req.query;
    if (!code || !corpID) {
        logger.error("auth corp user fail", traceContext);
        res.send("");
        return;
    }
    let userService = req.app.get('userService');
    let suiteID = constant.smartgridSuiteID;
    userService.getCorpUser(corpID, suiteID, code, traceContext, (err, corpUserJSON) => {
        if (err) {
            logger.error(err.message, traceContext);
            res.send("");
            return;
        }
        if (!corpUserJSON || !corpUserJSON.userID) {
            logger.error("auth corp user fail", traceContext);
            res.send("");
            return;
        }
        let {SG_WECHAT_PORTAL_DOMAIN = "wechat.smartgrid.gridvo.com"}=process.env;
        res.cookie('memberID', corpUserJSON.userID, {domain: SG_WECHAT_PORTAL_DOMAIN});
        let appPortalURL = `http://${SG_WECHAT_PORTAL_DOMAIN}/water-station`;
        logger.info(`auth corp user success,redirect to ${appPortalURL}`, traceContext);
        res.redirect(appPortalURL);
    });
});

module.exports = router;