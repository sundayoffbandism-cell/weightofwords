import Card from './Card.jsx';

// 시소 상판 위의 한쪽 카드 배치 영역. 평소에는 눈에 보이지 않고,
// 드래그 중 카드가 이 쪽으로 향하면 아주 옅게만 드러난다.
// 카드는 아래에서 위로 쌓이며, 상판의 일부이므로 시소와 함께 기울어진다.
export default function SeesawZone({ side, cards, draggingId, isHover, onCardPointerDown }) {
  return (
    <div className={`seesaw__zone seesaw__zone--${side}${isHover ? ' seesaw__zone--hover' : ''}`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          variant="placed"
          lifted={card.id === draggingId}
          onPointerDown={(e) => onCardPointerDown(e, card.id)}
        />
      ))}
    </div>
  );
}
