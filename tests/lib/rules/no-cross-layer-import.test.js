const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-cross-layer-import');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-cross-layer-import', rule, {
  valid: [
    // ✅ app이 pages를 import (허용)
    {
      code: "import { MainPage } from '@/pages/main';",
      filename: '/project/src/app/App.js',
      name: '[app → pages] import 허용',
    },

    // ✅ pages가 widgets를 import (허용)
    {
      code: "import { Header } from '@/widgets/header';",
      filename: '/project/src/pages/home/index.js',
      name: '[pages → widgets] import 허용',
    },

    // ✅ widgets가 features를 import (허용)
    {
      code: "import { LoginForm } from '@/features/auth';",
      filename: '/project/src/widgets/sidebar/Sidebar.js',
      name: '[widgets → features] import 허용',
    },

    // ✅ features가 entities를 import (허용)
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/features/profile/index.js',
      name: '[features → entities] import 허용',
    },

    // ✅ entities가 shared를 import (허용)
    {
      code: "import { Button } from '@/shared/ui';",
      filename: '/project/src/entities/post/ui/PostCard.js',
      name: '[entities → shared] import 허용',
    },

    // ✅ 같은 레이어 내 import (허용)
    {
      code: "import { UserCard } from './UserCard';",
      filename: '/project/src/entities/user/index.js',
      name: '[entities → entities] 같은 레이어 내 import 허용',
    },

    // ✅ 외부 패키지 import (허용)
    {
      code: "import React from 'react';",
      filename: '/project/src/pages/home/index.js',
      name: '[pages] 외부 패키지 import 허용',
    },

    // ✅ FSD 레이어가 아닌 파일 (체크 안함)
    {
      code: "import { something } from '@/app/config';",
      filename: '/project/src/config/index.js',
      name: '[non-FSD] FSD 레이어가 아닌 파일은 체크 안함',
    },

    // ✅ require 문법도 허용되는 경우
    {
      code: "const User = require('@/entities/user');",
      filename: '/project/src/features/auth/index.js',
      name: '[features → entities] require 문법 허용',
    },

    // ✅ dynamic import
    {
      code: "const module = import('@/entities/user');",
      filename: '/project/src/features/auth/index.js',
      name: '[features → entities] dynamic import 허용',
    },

    // ✅ 상대 경로로 하위 레이어 import
    {
      code: "import { User } from '../../../entities/user';",
      filename: '/project/src/features/auth/index.js',
      name: '[features → entities] 상대 경로 import 허용',
    },
  ],

  invalid: [
    // ❌ pages가 app을 import (위반)
    {
      code: "import { config } from '@/app/config';",
      filename: '/project/src/pages/home/index.js',
      name: '[pages ✗ app] 상위 레이어 import 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'pages',
            toLayer: 'app',
          },
        },
      ],
    },

    // ❌ widgets가 pages를 import (위반)
    {
      code: "import { HomePage } from '@/pages/home';",
      filename: '/project/src/widgets/header/Header.js',
      name: '[widgets ✗ pages] 상위 레이어 import 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'widgets',
            toLayer: 'pages',
          },
        },
      ],
    },

    // ❌ features가 widgets를 import (위반)
    {
      code: "import { Sidebar } from '@/widgets/sidebar';",
      filename: '/project/src/features/auth/index.js',
      name: '[features ✗ widgets] 상위 레이어 import 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'features',
            toLayer: 'widgets',
          },
        },
      ],
    },

    // ❌ entities가 features를 import (위반)
    {
      code: "import { login } from '@/features/auth';",
      filename: '/project/src/entities/user/model.js',
      name: '[entities ✗ features] 상위 레이어 import 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'entities',
            toLayer: 'features',
          },
        },
      ],
    },

    // ❌ shared가 entities를 import (위반)
    {
      code: "import { User } from '@/entities/user';",
      filename: '/project/src/shared/ui/Avatar.js',
      name: '[shared ✗ entities] 상위 레이어 import 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'shared',
            toLayer: 'entities',
          },
        },
      ],
    },

    // ❌ shared가 app을 import (위반 - 여러 레이어 건너뛰기)
    {
      code: "import { App } from '@/app';",
      filename: '/project/src/shared/config/index.js',
      name: '[shared ✗ app] 여러 레이어 건너뛰기 불가',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'shared',
            toLayer: 'app',
          },
        },
      ],
    },

    // ❌ require 문법도 체크
    {
      code: "const Header = require('@/widgets/header');",
      filename: '/project/src/features/auth/index.js',
      name: '[features ✗ widgets] require 문법도 체크',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'features',
            toLayer: 'widgets',
          },
        },
      ],
    },

    // ❌ dynamic import도 체크
    {
      code: "const module = import('@/pages/home');",
      filename: '/project/src/widgets/header/index.js',
      name: '[widgets ✗ pages] dynamic import도 체크',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'widgets',
            toLayer: 'pages',
          },
        },
      ],
    },

    // ❌ 상대 경로로 상위 레이어 import
    {
      code: "import { HomePage } from '../../../pages/home';",
      filename: '/project/src/entities/user/index.js',
      name: '[entities ✗ pages] 상대 경로도 체크',
      errors: [
        {
          messageId: 'crossLayerImport',
          data: {
            fromLayer: 'entities',
            toLayer: 'pages',
          },
        },
      ],
    },
  ],
});

console.log('✅ All tests passed for no-cross-layer-import rule!');
