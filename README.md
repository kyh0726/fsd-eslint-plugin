# @yh-kim/eslint-plugin-fsd

ESLint plugin for Feature-Sliced Design (FSD) architecture.

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
      'fsd/no-cross-layer-import': 'error',
    },
  },
];
```

### ESLint 8 and below (Legacy Config)

Add to your `.eslintrc` configuration file:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "extends": ["plugin:@yh-kim/fsd/recommended"]
}
```

Or configure rules individually:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "rules": {
    "@yh-kim/fsd/no-cross-layer-import": "error"
  }
}
```

### With Options

```json
{
  "plugins": ["@yh-kim/fsd"],
  "rules": {
    "@yh-kim/fsd/no-cross-layer-import": [
      "error",
      {
        "alias": "@",
        "ignorePatterns": ["\\.test\\.", "\\.spec\\."]
      }
    ]
  }
}
```

## Configuration Presets

### ESLint 9+ (Flat Config)

- `fsdPlugin.configs['flat/recommended']` - Recommended rules for FSD architecture
- `fsdPlugin.configs['flat/all']` - All available rules enabled

### ESLint 8 and below (Legacy Config)

- `plugin:@yh-kim/fsd/recommended` - Recommended rules for FSD architecture
- `plugin:@yh-kim/fsd/all` - All available rules enabled

## Expected Project Structure

This plugin expects the following project structure:

```
src/
├── app/
│   ├── App.tsx
│   └── providers/
├── pages/
│   ├── home/
│   └── profile/
├── widgets/
│   ├── header/
│   └── sidebar/
├── features/
│   ├── auth/
│   └── comments/
├── entities/
│   ├── user/
│   └── post/
└── shared/
    ├── ui/
    ├── lib/
    └── api/
```

## Rules

### Import Relationship Rules

| Rule | Description | Recommended |
|------|-------------|:-----------:|
| [no-cross-layer-import](./docs/rules/no-cross-layer-import.md) | Enforces FSD layer hierarchy (upper layers can only import from lower layers) | ✅ |

## FSD Layer Hierarchy

This plugin enforces the following FSD layer hierarchy:

```
app      (Top - Application initialization)
  ↓
pages    (Page routes)
  ↓
widgets  (Independent UI blocks)
  ↓
features (Business features)
  ↓
entities (Business entities)
  ↓
shared   (Bottom - Shared utilities)
```

**Rule**: Each layer can only import from layers below it.

### ✅ Valid Examples

```javascript
// ✅ app → pages
import { HomePage } from '@/pages/home';

// ✅ features → entities
import { User } from '@/entities/user';

// ✅ entities → shared
import { Button } from '@/shared/ui';
```

### ❌ Invalid Examples

```javascript
// ❌ pages → app (lower layer importing upper layer)
import { config } from '@/app/config';

// ❌ entities → features (lower layer importing upper layer)
import { login } from '@/features/auth';

// ❌ shared → entities (lower layer importing upper layer)
import { User } from '@/entities/user';
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
