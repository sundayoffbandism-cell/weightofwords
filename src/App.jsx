import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Seesaw from './components/Seesaw.jsx';
import CardTray from './components/CardTray.jsx';
import DragGhost from './components/DragGhost.jsx';
import { CARDS, CARDS_BY_ID } from './data/cards.js';
import { calcTiltAngle, sumWeight } from './utils/physics.js';
import { shuffle } from './utils/shuffle.js';
import { useCardDrag } from './hooks/useCardDrag.js';

// 접속할 때마다 트레이의 카드 순서를 섞을지 여부. false면 데이터 파일의 순서 그대로.
const SHUFFLE_TRAY = true;

const isInside = (rect, x, y) =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

export default function App() {
  // 시소에 올라간 카드 id 목록 (배열 순서 = 쌓인 순서, 뒤쪽일수록 위)
  const [placement, setPlacement] = useState({ left: [], right: [] });

  // 트레이에서의 고정 순서. 카드가 돌아와도 원래 자리로 돌아온다.
  const trayOrder = useMemo(
    () => (SHUFFLE_TRAY ? shuffle(CARDS) : CARDS).map((card) => card.id),
    [],
  );

  const stageRef = useRef(null);
  const trayRef = useRef(null);

  // 포인터 위치 → 'left' | 'right' | 'tray' | null
  const resolveTarget = useCallback((x, y) => {
    const stage = stageRef.current?.getBoundingClientRect();
    if (stage && isInside(stage, x, y)) {
      return x < stage.left + stage.width / 2 ? 'left' : 'right';
    }
    const tray = trayRef.current?.getBoundingClientRect();
    if (tray && isInside(tray, x, y)) return 'tray';
    return null; // 어느 영역도 아니면 제자리로 돌아간다.
  }, []);

  const handleDrop = useCallback((cardId, target) => {
    if (!target) return;
    setPlacement((prev) => {
      const left = prev.left.filter((id) => id !== cardId);
      const right = prev.right.filter((id) => id !== cardId);
      if (target === 'left') left.push(cardId);
      if (target === 'right') right.push(cardId);
      return { left, right };
    });
  }, []);

  const { drag, ghostRef, positionRef, startDrag } = useCardDrag({
    resolveTarget,
    onDrop: handleDrop,
  });

  const draggingId = drag?.cardId ?? null;

  // 드래그 중에는 body 커서를 grabbing 으로
  useEffect(() => {
    document.body.classList.toggle('is-dragging', Boolean(drag));
    return () => document.body.classList.remove('is-dragging');
  }, [drag]);

  const leftCards = useMemo(() => placement.left.map((id) => CARDS_BY_ID[id]), [placement.left]);
  const rightCards = useMemo(() => placement.right.map((id) => CARDS_BY_ID[id]), [placement.right]);

  // 집어 올린 카드는 시소에서 즉시 빠진 것으로 보고 기울기를 다시 계산한다.
  const angle = useMemo(() => {
    const left = sumWeight(leftCards.filter((card) => card.id !== draggingId));
    const right = sumWeight(rightCards.filter((card) => card.id !== draggingId));
    return calcTiltAngle(left, right);
  }, [leftCards, rightCards, draggingId]);

  const trayCards = useMemo(() => {
    const placed = new Set([...placement.left, ...placement.right]);
    return trayOrder.filter((id) => !placed.has(id)).map((id) => CARDS_BY_ID[id]);
  }, [trayOrder, placement]);

  return (
    <div className="app">
      <h1 className="app__title">THE WEIGHT OF WORDS</h1>

      <main ref={stageRef} className="stage">
        <Seesaw
          leftCards={leftCards}
          rightCards={rightCards}
          angle={angle}
          draggingId={draggingId}
          hoverSide={drag?.hover === 'left' || drag?.hover === 'right' ? drag.hover : null}
          onCardPointerDown={startDrag}
        />
      </main>

      <CardTray
        cards={trayCards}
        draggingId={draggingId}
        isHover={drag?.hover === 'tray'}
        trayRef={trayRef}
        onCardPointerDown={startDrag}
      />

      {drag && (
        <DragGhost
          card={CARDS_BY_ID[drag.cardId]}
          drag={drag}
          ghostRef={ghostRef}
          positionRef={positionRef}
        />
      )}
    </div>
  );
}
