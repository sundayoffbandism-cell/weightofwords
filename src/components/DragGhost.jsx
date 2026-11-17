import Card from './Card.jsx';
import { ghostTransform } from '../hooks/useCardDrag.js';

// 드래그 중 포인터를 따라다니는 카드 복제본.
// 위치 갱신은 useCardDrag 가 ghostRef 의 style.transform 을 직접 바꾸는 방식으로 처리한다.
export default function DragGhost({ card, drag, ghostRef, positionRef }) {
  return (
    <div
      ref={ghostRef}
      className="drag-ghost"
      style={{
        width: drag.width,
        height: drag.height,
        transform: ghostTransform(positionRef.current, drag),
      }}
    >
      <Card card={card} variant="ghost" />
    </div>
  );
}
