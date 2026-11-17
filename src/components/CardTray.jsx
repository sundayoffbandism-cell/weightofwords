import { useEffect, useRef } from 'react';
import Card from './Card.jsx';

// 화면 하단의 카드 목록. 가로로 스크롤되고, 카드를 위로 끌어 시소에 올린다.
// trayRef 는 App 이 "카드를 여기에 놓으면 시소에서 내려온다"를 판정할 때 사용한다.
export default function CardTray({ cards, draggingId, isHover, trayRef, onCardPointerDown }) {
  const scrollerRef = useRef(null);

  // 마우스 휠(세로)을 가로 스크롤로 바꿔준다.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section ref={trayRef} className={`tray${isHover ? ' tray--hover' : ''}`} aria-label="카드 목록">
      <div ref={scrollerRef} className="tray__scroller">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            variant="tray"
            dimmed={card.id === draggingId}
            onPointerDown={(e) => onCardPointerDown(e, card.id, { lockVertical: true })}
          />
        ))}
      </div>
    </section>
  );
}
