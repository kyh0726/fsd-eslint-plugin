# eslint-plugin-fsd

ESLint plugin for Feature-Sliced Design architecture.

## Installation

```bash
npm install --save-dev eslint-plugin-fsd
# or
yarn add --dev eslint-plugin-fsd
```

## Usage

### ESLint 9+ (Flat Config)

```javascript
// eslint.config.js
import fsd from 'eslint-plugin-fsd';

export default [
  // Use recommended config
  fsd.configs['flat/recommended'],

  // Or configure manually
  {
    plugins: {
      fsd
    },
    rules: {
      'fsd/rule-name': 'error'
    }
  }
];
```

### ESLint 8 and below (Legacy Config)

Add `fsd` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["fsd"],
  "extends": ["plugin:fsd/recommended"]
}
```

Or configure rules manually:

```json
{
  "plugins": ["fsd"],
  "rules": {
    "fsd/rule-name": "error"
  }
}
```

## Configurations

### For ESLint 9+ (Flat Config)
- `fsd.configs['flat/recommended']` - Recommended rules for FSD architecture
- `fsd.configs['flat/all']` - All available rules

### For ESLint 8 and below (Legacy Config)
- `plugin:fsd/recommended` - Recommended rules for FSD architecture
- `plugin:fsd/all` - All available rules

## Rules

<!-- List of rules will be added here -->

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
