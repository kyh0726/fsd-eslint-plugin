# no-cross-layer-import

Prevents upper layers from importing lower layers in Feature-Sliced Design (FSD) architecture.

## 📖 Rule Details

Feature-Sliced Design (FSD) architecture has a hierarchical structure where each layer can only import from layers below it.

**FSD Layer Order (top to bottom):**

```
app      (Top)
  ↓
pages
  ↓
widgets
  ↓
features
  ↓
entities
  ↓
shared   (Bottom)
```

**Allowed import directions:**
- ✅ Upper layer → Lower layer (e.g., `pages` → `widgets`)
- ✅ Same layer (e.g., `features/auth` → `features/auth/ui`)
- ❌ Lower layer → Upper layer (e.g., `entities` → `features`)

## 🔴 Examples of Incorrect Code

```javascript
// ❌ pages importing app (lower importing upper)
// File: src/pages/home/index.js
import { config } from '@/app/config';

// ❌ widgets importing pages
// File: src/widgets/header/Header.js
import { HomePage } from '@/pages/home';

// ❌ features importing widgets
// File: src/features/auth/index.js
import { Sidebar } from '@/widgets/sidebar';

// ❌ entities importing features
// File: src/entities/user/model.js
import { login } from '@/features/auth';

// ❌ shared importing entities
// File: src/shared/ui/Avatar.js
import { User } from '@/entities/user';

// ❌ require syntax is also checked
// File: src/features/auth/index.js
const Header = require('@/widgets/header');

// ❌ dynamic import is also checked
// File: src/widgets/header/index.js
const module = await import('@/pages/home');
```

## 🟢 Examples of Correct Code

```javascript
// ✅ app importing pages (upper importing lower)
// File: src/app/App.js
import { MainPage } from '@/pages/main';

// ✅ pages importing widgets
// File: src/pages/home/index.js
import { Header } from '@/widgets/header';

// ✅ widgets importing features
// File: src/widgets/sidebar/Sidebar.js
import { LoginForm } from '@/features/auth';

// ✅ features importing entities
// File: src/features/profile/index.js
import { User } from '@/entities/user';

// ✅ entities importing shared
// File: src/entities/post/ui/PostCard.js
import { Button } from '@/shared/ui';

// ✅ Same layer imports
// File: src/entities/user/index.js
import { UserCard } from './UserCard';

// ✅ External package imports
// File: src/pages/home/index.js
import React from 'react';
import { useQuery } from 'react-query';
```

## ⚙️ Options

### `alias`

Specify the path alias prefix. Default is `"@"`.

```json
{
  "rules": {
    "@yh-kim/fsd/no-cross-layer-import": ["error", {
      "alias": "@"
    }]
  }
}
```

### `ignorePatterns`

Specify file patterns to ignore as an array of regular expressions.

```json
{
  "rules": {
    "@yh-kim/fsd/no-cross-layer-import": ["error", {
      "ignorePatterns": [
        "\\.test\\.",
        "\\.spec\\.",
        "/tests/",
        "/stories/"
      ]
    }]
  }
}
```

## 💡 When to Use

This rule is useful when:

- Implementing Feature-Sliced Design architecture in your project
- You want to manage layer dependencies explicitly
- You want to prevent circular dependencies
- You want to enforce architectural structure in your codebase

## 🔗 Further Reading

- [Feature-Sliced Design Official Documentation](https://feature-sliced.design/)
- [FSD - Architectural Requirements](https://feature-sliced.design/docs/reference/layers)

## ⚡ Implementation Details

This rule checks the following import statements:

- ES6 `import` statements
- CommonJS `require()` calls
- Dynamic `import()` expressions

**Supported path formats:**
- Absolute alias (`@/entities/user`, `~/features/auth`)
- Relative paths (`../../entities/user`)

**Cases not checked:**
- External package imports (`react`, `lodash`, etc.)
- Files not in FSD layer directories
- Imports within the same layer
