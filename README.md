# @yh-kim/eslint-plugin-fsd

Feature-Sliced Design (FSD) 아키텍처를 위한 ESLint 플러그인입니다.

## 설치

```bash
npm install --save-dev @yh-kim/eslint-plugin-fsd
# or
yarn add --dev @yh-kim/eslint-plugin-fsd
# or
pnpm add --save-dev @yh-kim/eslint-plugin-fsd
```

## 사용법

### ESLint 9+ (Flat Config)

```javascript
// eslint.config.js
import fsdPlugin from '@yh-kim/eslint-plugin-fsd';

export default [
  // 추천 설정 사용
  fsdPlugin.configs['flat/recommended'],

  // 또는 수동으로 설정
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

### ESLint 8 이하 (Legacy Config)

`.eslintrc` 설정 파일에 추가:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "extends": ["plugin:@yh-kim/fsd/recommended"]
}
```

또는 룰을 개별적으로 설정:

```json
{
  "plugins": ["@yh-kim/fsd"],
  "rules": {
    "@yh-kim/fsd/no-cross-layer-import": "error"
  }
}
```

### 옵션과 함께 사용

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

## 설정 프리셋

### ESLint 9+ (Flat Config)

- `fsdPlugin.configs['flat/recommended']` - FSD 아키텍처를 위한 추천 규칙
- `fsdPlugin.configs['flat/all']` - 모든 규칙 활성화

### ESLint 8 이하 (Legacy Config)

- `plugin:@yh-kim/fsd/recommended` - FSD 아키텍처를 위한 추천 규칙
- `plugin:@yh-kim/fsd/all` - 모든 규칙 활성화

## 프로젝트 구조 예시

이 플러그인은 다음과 같은 프로젝트 구조를 기대합니다:

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

## 규칙 목록

### Import 관계 규칙

| 규칙 | 설명 | 추천 |
|------|------|:----:|
| [no-cross-layer-import](./docs/rules/no-cross-layer-import.md) | FSD 레이어 순서를 강제합니다 (상위 레이어가 하위 레이어만 import 가능) | ✅ |

## FSD 레이어 구조

이 플러그인은 다음과 같은 FSD 레이어 계층을 준수합니다:

```
app      (최상위 - 애플리케이션 초기화)
  ↓
pages    (페이지 라우트)
  ↓
widgets  (독립적인 UI 블록)
  ↓
features (비즈니스 기능)
  ↓
entities (비즈니스 엔티티)
  ↓
shared   (최하위 - 공유 유틸리티)
```

**규칙**: 각 레이어는 자신보다 아래에 있는 레이어만 import할 수 있습니다.

### ✅ 올바른 예시

```javascript
// ✅ app → pages
import { HomePage } from '@/pages/home';

// ✅ features → entities
import { User } from '@/entities/user';

// ✅ entities → shared
import { Button } from '@/shared/ui';
```

### ❌ 잘못된 예시

```javascript
// ❌ pages → app (하위가 상위를 import)
import { config } from '@/app/config';

// ❌ entities → features (하위가 상위를 import)
import { login } from '@/features/auth';

// ❌ shared → entities (하위가 상위를 import)
import { User } from '@/entities/user';
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
