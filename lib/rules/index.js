// Import all rules here
const noCrossLayerImport = require('./no-cross-layer-import');
const enforceSliceSegments = require('./enforce-slice-segments');

module.exports = {
  'no-cross-layer-import': noCrossLayerImport,
  'enforce-slice-segments': enforceSliceSegments,
};
