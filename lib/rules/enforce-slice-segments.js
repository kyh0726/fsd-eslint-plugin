const { LAYER_NAMES, ALLOWED_SEGMENTS } = require('../utils');

/**
 * 파일 경로에서 레이어, 슬라이스, 세그먼트를 추출합니다
 * @param {string} filePath - 파일 경로
 * @returns {{layer: string|null, slice: string|null, segment: string|null}}
 */
function extractSegmentFromFilePath(filePath) {
  if (!filePath) return { layer: null, slice: null, segment: null };

  // 정규화
  const normalizedPath = filePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');

  // 마지막 부분이 파일인지 확인 (확장자가 있으면 파일)
  const lastPart = pathParts[pathParts.length - 1];
  const isFile = lastPart && lastPart.includes('.');

  // 파일이면 마지막 부분 제외 (디렉토리만 고려)
  const dirParts = isFile ? pathParts.slice(0, -1) : pathParts;

  // 레이어 찾기
  let layerIndex = -1;
  let layer = null;
  for (let i = 0; i < dirParts.length; i++) {
    if (LAYER_NAMES.includes(dirParts[i])) {
      layer = dirParts[i];
      layerIndex = i;
      break;
    }
  }

  // 레이어를 찾지 못했거나 레이어 뒤에 충분한 경로가 없으면 스킵
  if (layerIndex === -1 || layerIndex >= dirParts.length - 1) {
    return { layer: null, slice: null, segment: null };
  }

  // 슬라이스는 레이어 바로 다음
  const slice = dirParts[layerIndex + 1];

  // 세그먼트는 슬라이스 다음 (있는 경우)
  const segment = layerIndex + 2 < dirParts.length ? dirParts[layerIndex + 2] : null;

  return { layer, slice, segment };
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces valid segment folders within FSD slices (only model, ui, api, lib allowed)',
      category: 'FSD Architecture',
      recommended: true,
      url: 'https://github.com/kyh0726/fsd-eslint-plugin/blob/main/docs/rules/enforce-slice-segments.md',
    },
    messages: {
      invalidSegment:
        'File is in invalid segment "{{segment}}" within {{layer}}/{{slice}}/. Only these segments are allowed: {{allowedSegments}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedSegments: {
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'Custom allowed segment names. Default: ["model", "ui", "api", "lib", "config"]',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedSegments = options.allowedSegments || ALLOWED_SEGMENTS;

    const filename = context.getFilename();
    const { layer, slice, segment } = extractSegmentFromFilePath(filename);

    // 레이어나 슬라이스가 없으면 FSD 구조가 아님
    if (!layer || !slice) {
      return {};
    }

    // 세그먼트가 없으면 OK (슬라이스 루트, 예: entities/user/index.ts)
    if (!segment) {
      return {};
    }

    // 세그먼트가 허용되지 않은 경우 에러
    if (!allowedSegments.includes(segment)) {
      return {
        Program(node) {
          context.report({
            node,
            messageId: 'invalidSegment',
            data: {
              segment,
              layer,
              slice,
              allowedSegments: allowedSegments.join(', '),
            },
          });
        },
      };
    }

    return {};
  },
};
