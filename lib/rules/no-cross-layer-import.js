const {
  extractLayer,
  extractLayerFromImport,
  isImportAllowed,
  isInternalImport,
  getLayerLevel,
} = require('../utils');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces FSD layer hierarchy (prevents lower layers from importing upper layers)',
      category: 'FSD Architecture',
      recommended: true,
      url: 'https://github.com/kyh0726/fsd-eslint-plugin/blob/main/docs/rules/no-cross-layer-import.md',
    },
    messages: {
      crossLayerImport:
        'Layer hierarchy violation: "{{fromLayer}}" layer cannot import from "{{toLayer}}" layer. Follow FSD layer order',
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
            description:
              'Path alias prefix (e.g., "@" for "@/entities/user"). Default: "@"',
          },
          ignorePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'File patterns to ignore (regular expressions)',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const alias = options.alias || '@';
    const ignorePatterns = (options.ignorePatterns || []).map(
      (pattern) => new RegExp(pattern)
    );

    const filename = context.getFilename();

    // 무시 패턴에 매칭되는 경우 스킵
    if (ignorePatterns.some((pattern) => pattern.test(filename))) {
      return {};
    }

    const currentLayer = extractLayer(filename);

    // 현재 파일이 FSD 레이어에 속하지 않으면 체크하지 않음
    if (!currentLayer) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // 내부 import가 아니면 스킵 (외부 패키지)
        if (!isInternalImport(importPath)) {
          return;
        }

        const importedLayer = extractLayerFromImport(importPath);

        // import되는 파일이 FSD 레이어에 속하지 않으면 스킵
        if (!importedLayer) {
          return;
        }

        // 같은 레이어 import는 허용
        if (currentLayer === importedLayer) {
          return;
        }

        // 레이어 순서 체크
        if (!isImportAllowed(currentLayer, importedLayer)) {
          context.report({
            node: node.source,
            messageId: 'crossLayerImport',
            data: {
              fromLayer: currentLayer,
              toLayer: importedLayer,
            },
          });
        }
      },

      // dynamic import도 체크
      ImportExpression(node) {
        if (node.source.type !== 'Literal') {
          return;
        }

        const importPath = node.source.value;

        if (!isInternalImport(importPath)) {
          return;
        }

        const importedLayer = extractLayerFromImport(importPath);

        if (!importedLayer) {
          return;
        }

        if (currentLayer === importedLayer) {
          return;
        }

        if (!isImportAllowed(currentLayer, importedLayer)) {
          context.report({
            node: node.source,
            messageId: 'crossLayerImport',
            data: {
              fromLayer: currentLayer,
              toLayer: importedLayer,
            },
          });
        }
      },

      // require() 호출도 체크
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'require'
        ) {
          return;
        }

        if (node.arguments.length === 0) {
          return;
        }

        const firstArg = node.arguments[0];
        if (firstArg.type !== 'Literal') {
          return;
        }

        const importPath = firstArg.value;

        if (!isInternalImport(importPath)) {
          return;
        }

        const importedLayer = extractLayerFromImport(importPath);

        if (!importedLayer) {
          return;
        }

        if (currentLayer === importedLayer) {
          return;
        }

        if (!isImportAllowed(currentLayer, importedLayer)) {
          context.report({
            node: firstArg,
            messageId: 'crossLayerImport',
            data: {
              fromLayer: currentLayer,
              toLayer: importedLayer,
            },
          });
        }
      },
    };
  },
};

