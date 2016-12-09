'use strict';
const _ = require('underscore');
const express = require('express');
const {constant} = require('../../util');

let router = express.Router();
router.get('/auth-suite', (req, res)=> {
    let authSuiteService = req.app.get('authSuiteService');
    authSuiteService.getSuiteAuthURL(constant[constant.smartgridSuiteID].suiteID, (err, suiteAuthURL)=> {
        if (err || !suiteAuthURL) {
            res.end("auth suite fail");
            return;
        }
        res.redirect(suiteAuthURL);
    });
});

module.exports = router;