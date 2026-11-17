// 단어/물체 카드 하나. 무게는 절대 렌더링하지 않는다.
//
// variant
//  - 'tray'   : 하단 목록에 있는 카드
//  - 'placed' : 시소 위에 올려진 카드 (조금 작게)
//  - 'ghost'  : 드래그 중 포인터를 따라다니는 복제본
//
// state
//  - dimmed : (tray) 지금 드래그 중인 원본 자리. 흐리게 남겨 레이아웃이 흔들리지 않게 한다.
//  - lifted : (placed) 지금 집어 올린 카드. 시소에서 즉시 빠진 것처럼 보이게 한다.
export default function Card({ card, variant = 'tray', dimmed = false, lifted = false, onPointerDown }) {
  const className = [
    'card',
    `card--${card.type}`,
    `card--${variant}`,
    dimmed && 'card--dimmed',
    lifted && 'card--lifted',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
      data-card-id={card.id}
    >
      {card.label}
    </div>
  );
}
