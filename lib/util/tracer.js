'use strict';
const {createZipkinTracer} = require("gridvo-common-js");

const tracer = createZipkinTracer({});
module.exports = tracer;