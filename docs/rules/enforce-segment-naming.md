# enforce-segment-naming

Enforces valid segment folder names within FSD slices. Only `model`, `ui`, `api`, `lib`, and `config` segments are allowed.

## 📖 Rule Details

In Feature-Sliced Design (FSD) architecture, each slice (e.g., `entities/user`, `features/auth`) should only contain specific segment folders that define the structure of that slice.

This rule checks the **file system structure** itself, not import statements. If a file is located in an invalid segment folder, it will be flagged as an error.

**Allowed segments:**

- `model/` - Business logic and data models
- `ui/` - UI components
- `api/` - API calls and data fetching
- `lib/` - Utility functions and helpers specific to this slice
- `config/` - Configuration files and constants

Any other folder names within a slice are considered violations of FSD structure.

## 🔴 Examples of Incorrect Code

Files located in invalid segments will trigger errors:

```javascript
// ❌ File: src/entities/user/utils/helper.ts
// Error: Invalid segment "utils"
export const helper = () => {};

// ❌ File: src/entities/user/helpers/format.ts
// Error: Invalid segment "helpers"
export const format = () => {};

// ❌ File: src/features/auth/components/Button.tsx
// Error: Invalid segment "components" (should be "ui")
export const Button = () => {};

// ❌ File: src/features/auth/services/AuthService.ts
// Error: Invalid segment "services" (should be "api" or "model")
export class AuthService {}

// ❌ File: src/entities/user/constants/roles.ts
// Error: Invalid segment "constants" (should be in "config" or "model")
export const USER_ROLES = {};
```

## 🟢 Examples of Correct Code

Files in valid segments or slice root:

```javascript
// ✅ File: src/entities/user/model/store.ts
export const userModel = {};

// ✅ File: src/entities/user/ui/UserCard.tsx
export const UserCard = () => {};

// ✅ File: src/entities/user/api/getUser.ts
export const getUser = async () => {};

// ✅ File: src/entities/user/lib/formatUser.ts
export const formatUser = () => {};

// ✅ File: src/entities/user/config/index.ts
export const userConfig = {};

// ✅ File: src/entities/user/index.ts (slice root)
export { User } from './model';

// ✅ File: src/entities/user/model/types/index.ts (deep path in valid segment)
export type User = {};

// ✅ File: src/shared/ui/Button.tsx
export const Button = () => {};

// ✅ File: src/pages/home/HomePage.tsx
export const HomePage = () => {};
```

## ⚙️ Options

### `allowedSegments`

You can customize the allowed segment names. Default is `["model", "ui", "api", "lib", "config"]`.

```json
{
  "rules": {
    "@yh-kim/fsd/enforce-segment-naming": [
      "error",
      {
        "allowedSegments": ["model", "ui", "api", "lib", "config", "types"]
      }
    ]
  }
}
```

This would allow an additional `types` segment in your slices (note: `config` is already in the default list).

## 💡 When to Use

This rule is useful when:

- You want to enforce consistent slice structure across your FSD project
- You want to prevent developers from creating non-standard folders within slices
- You want to maintain clear separation of concerns within each slice
- You're onboarding new team members and want to enforce architectural standards

## 📁 FSD Slice Structure

A typical FSD slice should look like this:

```
entities/user/
├── model/          # Business logic, stores, types
│   ├── store.ts
│   └── types.ts
├── ui/             # UI components
│   ├── UserCard.tsx
│   └── UserAvatar.tsx
├── api/            # API calls
│   ├── getUser.ts
│   └── updateUser.ts
├── lib/            # Slice-specific utilities
│   └── formatUser.ts
├── config/         # Configuration and constants
│   └── constants.ts
└── index.ts        # Public API
```

## 🔗 Further Reading

- [Feature-Sliced Design - Segments](https://feature-sliced.design/docs/reference/segments)
- [Feature-Sliced Design Official Documentation](https://feature-sliced.design/)

## ⚡ Implementation Details

This rule checks the **file path** of the current file being linted, not import statements.

**What is checked:**

- File paths that match the pattern: `layer/slice/segment/...`
- Examples:
  - `src/entities/user/utils/helper.ts` ❌
  - `src/features/auth/services/AuthService.ts` ❌

**What is NOT checked:**

- Files in slice root (e.g., `src/entities/user/index.ts`) ✅
- Files not in FSD layer directories ✅
- Import statements (use `no-cross-layer-import` for that)

**How it works:**

1. Extracts the file path from the current file being linted
2. Identifies if the file is within an FSD layer/slice structure
3. Checks if the segment folder (first folder after slice) is in the allowed list
4. Reports an error if the segment is invalid
