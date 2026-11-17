import SeesawZone from './SeesawZone.jsx';

// 화면의 주인공인 시소.
//  - 삼각형 받침대(고정)
//  - 긴 직사각형 상판 + 좌우 배치 영역(angle 만큼 회전, CSS transition으로 부드럽게)
//
// 회전 중심은 상판 가운데 = 받침대 꼭짓점이다. (seesaw.css 참고)
export default function Seesaw({ leftCards, rightCards, angle, draggingId, hoverSide, onCardPointerDown }) {
  return (
    <div className="seesaw">
      <div className="seesaw__ground" />
      <div className="seesaw__triangle" />

      <div className="seesaw__assembly" style={{ transform: `rotate(${angle}deg)` }}>
        <SeesawZone
          side="left"
          cards={leftCards}
          draggingId={draggingId}
          isHover={hoverSide === 'left'}
          onCardPointerDown={onCardPointerDown}
        />
        <SeesawZone
          side="right"
          cards={rightCards}
          draggingId={draggingId}
          isHover={hoverSide === 'right'}
          onCardPointerDown={onCardPointerDown}
        />
        <div className="seesaw__bar" />
      </div>
    </div>
  );
}
