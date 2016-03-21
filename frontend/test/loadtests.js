'use strict';

import chaiSubset from 'chai-subset';
window.chai.use(chaiSubset);

// Add support for all files in the test directory
const testsContext = require.context('.', true, /test\.js$/);
testsContext.keys().forEach(testsContext);
