const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/enforce-slice-segments');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('enforce-slice-segments', rule, {
  valid: [
    // ✅ 허용된 세그먼트: model
    {
      code: 'export const userModel = {};',
      filename: '/project/src/entities/user/model/store.ts',
      name: '[entities/user/model/] Valid segment - model',
    },

    // ✅ 허용된 세그먼트: ui
    {
      code: 'export const UserCard = () => {};',
      filename: '/project/src/entities/user/ui/UserCard.tsx',
      name: '[entities/user/ui/] Valid segment - ui',
    },

    // ✅ 허용된 세그먼트: api
    {
      code: 'export const getUser = async () => {};',
      filename: '/project/src/entities/user/api/getUser.ts',
      name: '[entities/user/api/] Valid segment - api',
    },

    // ✅ 허용된 세그먼트: lib
    {
      code: 'export const formatUser = () => {};',
      filename: '/project/src/entities/user/lib/formatUser.ts',
      name: '[entities/user/lib/] Valid segment - lib',
    },

    // ✅ 슬라이스 루트 (세그먼트 없음)
    {
      code: "export { User } from './model';",
      filename: '/project/src/entities/user/index.ts',
      name: '[entities/user/index.ts] Slice root file',
    },

    // ✅ features의 허용된 세그먼트
    {
      code: 'export const LoginForm = () => {};',
      filename: '/project/src/features/auth/ui/LoginForm.tsx',
      name: '[features/auth/ui/] Valid segment',
    },

    // ✅ widgets의 허용된 세그먼트
    {
      code: 'export const headerModel = {};',
      filename: '/project/src/widgets/header/model/store.ts',
      name: '[widgets/header/model/] Valid segment',
    },

    // ✅ model 세그먼트 내 깊은 경로
    {
      code: 'export const types = {};',
      filename: '/project/src/entities/user/model/types/index.ts',
      name: '[entities/user/model/types/] Deep path in valid segment',
    },

    // ✅ FSD 레이어가 아닌 파일
    {
      code: 'export const utils = {};',
      filename: '/project/src/utils/helpers.ts',
      name: '[utils/] Non-FSD layer',
    },

    // ✅ shared 레이어 (세그먼트 체크 안함)
    {
      code: 'export const Button = () => {};',
      filename: '/project/src/shared/ui/Button.tsx',
      name: '[shared/ui/] Shared layer',
    },

    // ✅ app 레이어
    {
      code: 'export const App = () => {};',
      filename: '/project/src/app/App.tsx',
      name: '[app/] App layer root',
    },

    // ✅ pages 레이어
    {
      code: 'export const HomePage = () => {};',
      filename: '/project/src/pages/home/HomePage.tsx',
      name: '[pages/home/] Pages layer',
    },

    // ✅ 허용된 세그먼트: config
    {
      code: 'export const userConfig = {};',
      filename: '/project/src/entities/user/config/index.ts',
      name: '[entities/user/config/] Valid segment - config',
    },
  ],

  invalid: [
    // ❌ 잘못된 세그먼트: utils
    {
      code: 'export const helper = () => {};',
      filename: '/project/src/entities/user/utils/helper.ts',
      name: '[entities/user/utils/] Invalid segment - utils',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'utils',
            layer: 'entities',
            slice: 'user',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ 잘못된 세그먼트: helpers
    {
      code: 'export const format = () => {};',
      filename: '/project/src/entities/user/helpers/format.ts',
      name: '[entities/user/helpers/] Invalid segment - helpers',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'helpers',
            layer: 'entities',
            slice: 'user',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ 잘못된 세그먼트: components
    {
      code: 'export const Button = () => {};',
      filename: '/project/src/features/auth/components/Button.tsx',
      name: '[features/auth/components/] Invalid segment - components',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'components',
            layer: 'features',
            slice: 'auth',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ 잘못된 세그먼트: services
    {
      code: 'export class AuthService {}',
      filename: '/project/src/features/auth/services/AuthService.ts',
      name: '[features/auth/services/] Invalid segment - services',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'services',
            layer: 'features',
            slice: 'auth',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ 잘못된 세그먼트: constants
    {
      code: 'export const USER_ROLES = {};',
      filename: '/project/src/entities/user/constants/roles.ts',
      name: '[entities/user/constants/] Invalid segment - constants',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'constants',
            layer: 'entities',
            slice: 'user',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ widgets의 잘못된 세그먼트
    {
      code: 'export const headerUtils = {};',
      filename: '/project/src/widgets/header/utils/helpers.ts',
      name: '[widgets/header/utils/] Invalid segment in widgets',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'utils',
            layer: 'widgets',
            slice: 'header',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },

    // ❌ 잘못된 세그먼트 내 깊은 경로도 에러
    {
      code: 'export const helper = {};',
      filename: '/project/src/entities/user/helpers/deep/nested/file.ts',
      name: '[entities/user/helpers/deep/] Deep path in invalid segment',
      errors: [
        {
          messageId: 'invalidSegment',
          data: {
            segment: 'helpers',
            layer: 'entities',
            slice: 'user',
            allowedSegments: 'model, ui, api, lib, config',
          },
        },
      ],
    },
  ],
});

console.log('✅ All tests passed for enforce-slice-segments rule!');
