# @yh-kim/eslint-plugin-fsd

ESLint plugin for Feature-Sliced Design (FSD) architecture.

## Installation

```bash
pnpm add -D @yh-kim/eslint-plugin-fsd
# or
npm install --save-dev @yh-kim/eslint-plugin-fsd
# or
yarn add --dev @yh-kim/eslint-plugin-fsd
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
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   └── sidebar/
├── features/
│   ├── auth/
│   │   ├── model/
│   │   ├── ui/
│   │   ├── api/
│   │   └── index.ts
│   └── comments/
├── entities/
│   ├── user/
│   │   ├── model/
│   │   ├── ui/
│   │   ├── api/
│   │   ├── lib/
│   │   └── index.ts
│   └── post/
└── shared/
    ├── ui/
    ├── lib/
    └── api/
```

### Slice Segment Structure

Each slice (e.g., `entities/user`, `features/auth`) should only contain these segment folders:

- **`model/`** - Business logic, stores, types
- **`ui/`** - UI components
- **`api/`** - API calls and data fetching
- **`lib/`** - Slice-specific utility functions
- **`config/`** - Configuration files and constants

**Example - Valid Structure:**

```
entities/user/
├── model/          ✅ Allowed
├── ui/             ✅ Allowed
├── api/            ✅ Allowed
├── lib/            ✅ Allowed
├── config/         ✅ Allowed
└── index.ts        ✅ Root file

entities/user/
├── utils/          ❌ Invalid segment!
├── helpers/        ❌ Invalid segment!
└── constants/      ❌ Invalid segment! (use config/)
```

## Rules

### Import Relationship Rules

| Rule                                                           | Description                                                                   | Recommended | Level |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- | :---------: | :---: |
| [no-cross-layer-import](./docs/rules/no-cross-layer-import.md) | Enforces FSD layer hierarchy (upper layers can only import from lower layers) |     ✅      | error |

### Segment Naming Rules

| Rule                                                             | Description                                                                              | Recommended | Level |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | :---------: | :---: |
| [enforce-segment-naming](./docs/rules/enforce-segment-naming.md) | Enforces valid segment folders within slices (checks file system structure, not imports) |     ✅      | error |

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

**Core Principle**: Each layer can only import from layers below it in the hierarchy.

### ✅ Valid Examples

```javascript
// ✅ Upper layer importing lower layer
import { HomePage } from '@/pages/home'; // app → pages
import { Header } from '@/widgets/header'; // pages → widgets
import { LoginForm } from '@/features/auth'; // widgets → features
import { User } from '@/entities/user'; // features → entities
import { Button } from '@/shared/ui'; // entities → shared

// ✅ Same layer imports
import { UserCard } from './UserCard';

// ✅ External packages
import React from 'react';
```

### ❌ Invalid Examples

```javascript
// ❌ Lower layer importing upper layer (violates hierarchy)
import { config } from '@/app/config'; // pages → app ✗
import { HomePage } from '@/pages/home'; // widgets → pages ✗
import { Sidebar } from '@/widgets/sidebar'; // features → widgets ✗
import { login } from '@/features/auth'; // entities → features ✗
import { User } from '@/entities/user'; // shared → entities ✗
```

## Why Use This Plugin?

- **🏗️ Architecture Enforcement**: Automatically enforce FSD architectural principles
- **🔒 Prevent Circular Dependencies**: Catch dependency violations before they become problems
- **📚 Self-Documenting Code**: Clear layer structure makes codebase easier to understand
- **⚡ Scalability**: Maintain clean architecture as your project grows
- **🛡️ Type Safety**: Works seamlessly with TypeScript projects

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
