# no-cross-layer-import

FSD 아키텍처에서 상위 레이어가 하위 레이어를 import하는 것을 방지합니다.

## 📖 규칙 설명

Feature-Sliced Design (FSD) 아키텍처는 계층적 구조를 가지고 있으며, 각 레이어는 자신보다 아래에 있는 레이어만 import할 수 있습니다.

**FSD 레이어 순서 (위→아래):**

```
app      (최상위)
  ↓
pages
  ↓
widgets
  ↓
features
  ↓
entities
  ↓
shared   (최하위)
```

**허용되는 import 방향:**
- ✅ 상위 레이어 → 하위 레이어 (예: `pages` → `widgets`)
- ✅ 같은 레이어 내부 (예: `features/auth` → `features/auth/ui`)
- ❌ 하위 레이어 → 상위 레이어 (예: `entities` → `features`)

## 🔴 잘못된 코드 예시

```javascript
// ❌ pages가 app을 import (하위가 상위를 import)
// File: src/pages/home/index.js
import { config } from '@/app/config';

// ❌ widgets가 pages를 import
// File: src/widgets/header/Header.js
import { HomePage } from '@/pages/home';

// ❌ features가 widgets를 import
// File: src/features/auth/index.js
import { Sidebar } from '@/widgets/sidebar';

// ❌ entities가 features를 import
// File: src/entities/user/model.js
import { login } from '@/features/auth';

// ❌ shared가 entities를 import
// File: src/shared/ui/Avatar.js
import { User } from '@/entities/user';

// ❌ require 문법도 동일하게 체크
// File: src/features/auth/index.js
const Header = require('@/widgets/header');

// ❌ dynamic import도 체크
// File: src/widgets/header/index.js
const module = await import('@/pages/home');
```

## 🟢 올바른 코드 예시

```javascript
// ✅ app이 pages를 import (상위가 하위를 import)
// File: src/app/App.js
import { MainPage } from '@/pages/main';

// ✅ pages가 widgets를 import
// File: src/pages/home/index.js
import { Header } from '@/widgets/header';

// ✅ widgets가 features를 import
// File: src/widgets/sidebar/Sidebar.js
import { LoginForm } from '@/features/auth';

// ✅ features가 entities를 import
// File: src/features/profile/index.js
import { User } from '@/entities/user';

// ✅ entities가 shared를 import
// File: src/entities/post/ui/PostCard.js
import { Button } from '@/shared/ui';

// ✅ 같은 레이어 내 import
// File: src/entities/user/index.js
import { UserCard } from './UserCard';

// ✅ 외부 패키지 import
// File: src/pages/home/index.js
import React from 'react';
import { useQuery } from 'react-query';
```

## ⚙️ 옵션

### `alias`

Path alias prefix를 지정합니다. 기본값은 `"@"`입니다.

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

체크를 무시할 파일 패턴을 정규표현식 배열로 지정합니다.

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

## 💡 사용 시기

이 규칙은 다음과 같은 경우에 유용합니다:

- Feature-Sliced Design 아키텍처를 프로젝트에 적용할 때
- 레이어 간 의존성을 명확하게 관리하고 싶을 때
- 순환 의존성을 방지하고 싶을 때
- 코드베이스의 구조를 강제하고 싶을 때

## 🔗 관련 링크

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [FSD - Architectural Requirements](https://feature-sliced.design/docs/reference/layers)

## ⚡ 구현 세부사항

이 규칙은 다음과 같은 import 구문을 모두 체크합니다:

- ES6 `import` 문
- CommonJS `require()` 호출
- Dynamic `import()` 표현식

**지원하는 경로 형식:**
- Absolute alias (`@/entities/user`, `~/features/auth`)
- Relative path (`../../entities/user`)

**체크하지 않는 경우:**
- 외부 패키지 import (`react`, `lodash` 등)
- FSD 레이어가 아닌 디렉토리의 파일
- 같은 레이어 내부의 import

