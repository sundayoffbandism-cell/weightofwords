// 시소의 무게 계산과 기울기 계산을 모아둔 순수 함수 모듈.
// 아래 상수만 바꿔도 시소의 "느낌"을 조절할 수 있다.

/** 시소가 기울 수 있는 최대 각도(도). */
export const MAX_TILT_DEG = 15;

/** 무게 차이가 아주 작아도(0이 아니면) 최소한 이 정도는 기울어 보이게 한다. */
export const MIN_TILT_DEG = 1.5;

/** 클수록 큰 무게 차이가 있어야 최대 기울기에 가까워진다. (단위: g) */
export const SENSITIVITY_G = 800;

/** 카드 배열의 무게 합계(g). */
export function sumWeight(cards) {
  return cards.reduce((total, card) => total + card.weight, 0);
}

/**
 * 좌우 무게 합계로 시소의 회전 각도(deg)를 계산한다.
 * - 같으면 0 (수평)
 * - 오른쪽이 무거우면 양수 (CSS rotate 기준 시계 방향 = 오른쪽이 내려감)
 * - 왼쪽이 무거우면 음수
 * - 결과는 항상 -MAX_TILT_DEG ~ +MAX_TILT_DEG 안에 있다.
 */
export function calcTiltAngle(leftWeight, rightWeight) {
  const diff = rightWeight - leftWeight;
  if (diff === 0) return 0;

  const strength = Math.tanh(Math.abs(diff) / SENSITIVITY_G); // 0 ~ 1, 부드럽게 포화
  const magnitude = MIN_TILT_DEG + (MAX_TILT_DEG - MIN_TILT_DEG) * strength;

  return Math.sign(diff) * magnitude;
}
