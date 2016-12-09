'use strict';
const _ = require('underscore');
const express = require('express');
const {constant} = require('../../util');

let router = express.Router();
router.get('/complete-auth', (req, res)=> {
    let authCode = req.query.auth_code;
    if (!authCode) {
        res.end("fail");
        return;
    }
    let authSuiteService = req.app.get('authSuiteService');
    authSuiteService.completeAuth(constant[constant.smartgridSuiteID].suiteID, authCode, (err, isSuccess)=> {
        if (err || !isSuccess) {
            res.end("fail");
            return;
        }
        res.end("success");
    });
});

module.exports = router;