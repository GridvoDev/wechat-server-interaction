'use strict';
const smartgridSuiteAuthSuiteRouter = require('./smartgridSuite/authSuite');
const smartgridSuiteCompleteAuthRouter = require('./smartgridSuite/completeAuth');
const smartgridSuiteSuiteSysEventRouter = require('./smartgridSuite/suiteSysEvent');
const smartgridSuiteWaterStationUserEventRouter = require('./smartgridSuite/waterStation/userEvent');

module.exports = {
    smartgridSuiteAuthSuiteRouter,
    smartgridSuiteCompleteAuthRouter,
    smartgridSuiteSuiteSysEventRouter,
    smartgridSuiteWaterStationUserEventRouter
};