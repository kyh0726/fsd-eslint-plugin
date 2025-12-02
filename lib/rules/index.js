// Import all rules here
const noCrossLayerImport = require('./no-cross-layer-import');
const enforceSegmentNaming = require('./enforce-segment-naming');

module.exports = {
  'no-cross-layer-import': noCrossLayerImport,
  'enforce-segment-naming': enforceSegmentNaming,
};
