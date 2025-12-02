const rules = require('./rules');
const legacyConfigs = require('./configs');

// Plugin object for Flat Config
const plugin = {
  meta: {
    name: '@yh-kim/eslint-plugin-fsd',
    version: '0.1.0',
  },
  rules,
};

// Legacy configs (for ESLint < 9)
const configs = {
  ...legacyConfigs,
};

// Flat Config support (for ESLint >= 9)
// These configs include the plugin reference
configs['flat/recommended'] = {
  plugins: {
    fsd: plugin,
  },
  rules: {
    // Add recommended rules here
    'fsd/no-cross-layer-import': 'error',
    'fsd/enforce-slice-segments': 'error',
  },
};

configs['flat/all'] = {
  plugins: {
    fsd: plugin,
  },
  rules: {
    // Add all rules here
    'fsd/no-cross-layer-import': 'error',
    'fsd/enforce-slice-segments': 'error',
  },
};

// Export the plugin with both legacy and flat configs
plugin.configs = configs;

module.exports = plugin;
