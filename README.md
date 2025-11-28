# @yh-kim/eslint-plugin-fsd

ESLint plugin for Feature-Sliced Design architecture.

## Installation

```bash
npm install --save-dev @yh-kim/eslint-plugin-fsd
# or
yarn add --dev @yh-kim/eslint-plugin-fsd
# or
pnpm add --save-dev @yh-kim/eslint-plugin-fsd
```

## Usage

### ESLint 9+ (Flat Config)

```javascript
// eslint.config.js
import fsdPlugin from '@yh-kim/eslint-plugin-fsd';

export default [
  // Use recommended config
  fsdPlugin.configs['flat/recommended'],

  // Or configure manually
  {
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      'fsd/rule-name': 'error',
    },
  },
];
```

### ESLint 8 and below (Legacy Config)

Add `@yh-kim/fsd` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "extends": ["plugin:@yh-kim/fsd/recommended"]
}
```

Or configure rules manually:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "rules": {
    "@yh-kim/fsd/rule-name": "error"
  }
}
```

## Configurations

### For ESLint 9+ (Flat Config)

- `fsdPlugin.configs['flat/recommended']` - Recommended rules for FSD architecture
- `fsdPlugin.configs['flat/all']` - All available rules

### For ESLint 8 and below (Legacy Config)

- `plugin:@yh-kim/fsd/recommended` - Recommended rules for FSD architecture
- `plugin:@yh-kim/fsd/all` - All available rules

## Rules

### Import 관계 규칙

| Rule | Description | Recommended |
|------|-------------|:-----------:|
| [no-cross-layer-import](./docs/rules/no-cross-layer-import.md) | FSD 아키텍처에서 상위 레이어가 하위 레이어를 import하는 것을 방지합니다 | ✅ |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
