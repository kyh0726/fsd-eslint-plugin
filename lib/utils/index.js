/**
 * FSD 레이어 순서 정의 (낮은 숫자 = 상위 레이어)
 */
const FSD_LAYERS = {
  app: 0,
  pages: 1,
  widgets: 2,
  features: 3,
  entities: 4,
  shared: 5,
};

const LAYER_NAMES = Object.keys(FSD_LAYERS);

/**
 * 파일 경로에서 FSD 레이어를 추출합니다
 * @param {string} filePath - 파일 경로
 * @returns {string|null} 레이어 이름 또는 null
 */
function extractLayer(filePath) {
  if (!filePath) return null;

  // 정규화: 백슬래시를 슬래시로 변환
  const normalizedPath = filePath.replace(/\\/g, '/');

  // src/ 또는 프로젝트 루트 이후의 경로만 추출
  const pathParts = normalizedPath.split('/');

  // 경로에서 레이어 찾기
  for (const part of pathParts) {
    if (LAYER_NAMES.includes(part)) {
      return part;
    }
  }

  return null;
}

/**
 * import 경로에서 FSD 레이어를 추출합니다
 * @param {string} importPath - import 경로 (예: '@/entities/user', '../../features/auth')
 * @returns {string|null} 레이어 이름 또는 null
 */
function extractLayerFromImport(importPath) {
  if (!importPath) return null;

  // 정규화
  const normalizedPath = importPath.replace(/\\/g, '/');

  // @ 알리아스 제거 (@/, @shared/ 등)
  const pathWithoutAlias = normalizedPath.replace(/^@[^/]*\//, '');

  // 경로 부분들로 분리
  const pathParts = pathWithoutAlias.split('/');

  // 모든 경로 부분을 검사하여 레이어 찾기 (상대 경로 대응)
  for (const part of pathParts) {
    if (LAYER_NAMES.includes(part)) {
      return part;
    }
  }

  return null;
}

/**
 * 두 레이어 간의 import가 허용되는지 확인합니다
 * @param {string} fromLayer - import하는 파일의 레이어
 * @param {string} toLayer - import되는 파일의 레이어
 * @returns {boolean} 허용 여부
 */
function isImportAllowed(fromLayer, toLayer) {
  if (!fromLayer || !toLayer) return true;
  if (fromLayer === toLayer) return true;

  const fromLevel = FSD_LAYERS[fromLayer];
  const toLevel = FSD_LAYERS[toLayer];

  // 상위 레이어(낮은 숫자)는 하위 레이어(높은 숫자)만 import 가능
  return fromLevel < toLevel;
}

/**
 * 레이어 레벨을 반환합니다 (낮을수록 상위 레이어)
 * @param {string} layer - 레이어 이름
 * @returns {number} 레이어 레벨
 */
function getLayerLevel(layer) {
  return FSD_LAYERS[layer];
}

/**
 * 경로가 FSD 프로젝트 내부 경로인지 확인합니다
 * @param {string} importPath - import 경로
 * @returns {boolean} 내부 경로 여부
 */
function isInternalImport(importPath) {
  if (!importPath) return false;

  // 상대 경로 (../, ./)
  if (importPath.startsWith('.')) return true;

  // @ 알리아스로 시작
  if (importPath.startsWith('@/')) return true;

  // 프로젝트 이름으로 시작하는 경우 (선택적)
  // 패키지 import는 제외 (node_modules)
  if (!importPath.includes('/')) return false;

  // FSD 레이어로 시작하는 경우
  const firstPart = importPath.split('/')[0].replace(/^@/, '');
  return LAYER_NAMES.includes(firstPart);
}

/**
 * FSD 허용된 세그먼트 이름 (슬라이스 내부 폴더)
 */
const ALLOWED_SEGMENTS = ['model', 'ui', 'api', 'lib', 'config'];

/**
 * import 경로에서 세그먼트를 추출합니다
 * @param {string} importPath - import 경로 (예: '@/entities/user/model', '@/features/auth/ui')
 * @returns {{layer: string|null, slice: string|null, segment: string|null}} 레이어, 슬라이스, 세그먼트 정보
 */
function extractSegmentFromImport(importPath) {
  if (!importPath) return { layer: null, slice: null, segment: null };

  // 정규화
  const normalizedPath = importPath.replace(/\\/g, '/');

  // @ 알리아스 제거
  const pathWithoutAlias = normalizedPath.replace(/^@[^/]*\//, '');

  // 경로 부분들로 분리
  const pathParts = pathWithoutAlias.split('/');

  // 레이어 찾기
  let layerIndex = -1;
  let layer = null;
  for (let i = 0; i < pathParts.length; i++) {
    if (LAYER_NAMES.includes(pathParts[i])) {
      layer = pathParts[i];
      layerIndex = i;
      break;
    }
  }

  if (layerIndex === -1 || layerIndex >= pathParts.length - 1) {
    return { layer: null, slice: null, segment: null };
  }

  // 슬라이스는 레이어 다음
  const slice = pathParts[layerIndex + 1];

  // 세그먼트는 슬라이스 다음 (있는 경우)
  const segment = layerIndex + 2 < pathParts.length ? pathParts[layerIndex + 2] : null;

  return { layer, slice, segment };
}

/**
 * 세그먼트가 허용된 것인지 확인합니다
 * @param {string} segment - 세그먼트 이름
 * @returns {boolean} 허용 여부
 */
function isValidSegment(segment) {
  if (!segment) return true; // 세그먼트가 없으면 허용 (슬라이스 루트)
  return ALLOWED_SEGMENTS.includes(segment);
}

module.exports = {
  FSD_LAYERS,
  LAYER_NAMES,
  ALLOWED_SEGMENTS,
  extractLayer,
  extractLayerFromImport,
  extractSegmentFromImport,
  isImportAllowed,
  isValidSegment,
  getLayerLevel,
  isInternalImport,
};
