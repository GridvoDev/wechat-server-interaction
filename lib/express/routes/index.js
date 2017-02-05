'use strict';
const smartgridSuiteAuthSuiteRouter = require('./smartgridSuite/authSuite');
const smartgridSuiteCompleteAuthRouter = require('./smartgridSuite/completeAuth');
const smartgridSuiteSuiteSysEventRouter = require('./smartgridSuite/suiteSysEvent');
const smartgridSuiteWaterStationUserEventRouter = require('./smartgridSuite/waterStation/userEvent');
const smartgridSuiteWaterStationUserAuthRouter = require('./smartgridSuite/waterStation/userAuth');

module.exports = {
    smartgridSuiteAuthSuiteRouter,
    smartgridSuiteCompleteAuthRouter,
    smartgridSuiteSuiteSysEventRouter,
    smartgridSuiteWaterStationUserEventRouter,
    smartgridSuiteWaterStationUserAuthRouter
};