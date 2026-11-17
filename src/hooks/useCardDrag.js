import { useCallback, useEffect, useRef, useState } from 'react';

// 마우스/터치/펜을 모두 Pointer Events 하나로 처리하는 드래그 훅.
//
// - 드래그 중에는 카드의 "복제본(ghost)"이 포인터를 따라다닌다.
// - ghost의 위치는 매 이동마다 setState 하지 않고 DOM transform을 직접 갱신한다. (렌더 최소화)
// - 포인터가 어디 위에 있는지는 resolveTarget(x, y) 가 판단한다. ('left' | 'right' | 'tray' | null)
// - 손을 떼면 onDrop(cardId, target) 을 호출한다.
//
// 모바일 대응: 트레이 안에서는 "가로 스와이프 = 트레이 스크롤", "세로로 끌어올리기 = 카드 드래그"로 구분한다.

const MOUSE_START_DISTANCE = 4;
const TOUCH_START_DISTANCE = 8;
const TOUCH_SCROLL_DISTANCE = 10;

export function ghostTransform(position, drag) {
  const x = position.x - drag.offsetX;
  const y = position.y - drag.offsetY;
  return `translate3d(${x}px, ${y}px, 0) rotate(-2deg) scale(1.05)`;
}

export function useCardDrag({ resolveTarget, onDrop }) {
  // drag: { cardId, width, height, offsetX, offsetY, hover } | null
  const [drag, setDrag] = useState(null);

  const ghostRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const sessionRef = useRef(null);
  const latestRef = useRef({ resolveTarget, onDrop });

  useEffect(() => {
    latestRef.current = { resolveTarget, onDrop };
  });

  // 언마운트 시 남아 있는 리스너 정리
  useEffect(() => () => sessionRef.current?.cleanup(), []);

  /**
   * 카드의 onPointerDown 에 연결한다.
   * @param event      React PointerEvent
   * @param cardId     카드 id
   * @param options    { lockVertical: 터치일 때 가로 스와이프를 스크롤에 양보할지 }
   */
  const startDrag = useCallback((event, cardId, { lockVertical = false } = {}) => {
    if (sessionRef.current) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const session = {
      cardId,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      lockVertical: lockVertical && event.pointerType !== 'mouse',
      started: false,
      hover: null,
      cleanup: null,
    };

    const onTouchMove = (e) => {
      // 드래그 중에는 화면이 같이 스크롤되지 않도록 막는다.
      if (session.started && e.cancelable) e.preventDefault();
    };

    const onMove = (e) => {
      if (e.pointerId !== session.pointerId) return;

      if (!session.started) {
        const dx = e.clientX - session.startX;
        const dy = e.clientY - session.startY;

        if (session.pointerType === 'mouse') {
          if (Math.hypot(dx, dy) < MOUSE_START_DISTANCE) return;
        } else if (session.lockVertical) {
          // 가로로 더 많이 움직이면 트레이 스크롤로 보고 드래그를 포기한다.
          if (Math.abs(dx) > TOUCH_SCROLL_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
            session.cleanup();
            return;
          }
          if (Math.abs(dy) < TOUCH_START_DISTANCE) return;
        } else if (Math.hypot(dx, dy) < TOUCH_START_DISTANCE) {
          return;
        }

        session.started = true;
        positionRef.current = { x: e.clientX, y: e.clientY };
        session.hover = latestRef.current.resolveTarget(e.clientX, e.clientY);
        setDrag({
          cardId,
          width: session.width,
          height: session.height,
          offsetX: session.offsetX,
          offsetY: session.offsetY,
          hover: session.hover,
        });
        return;
      }

      positionRef.current = { x: e.clientX, y: e.clientY };
      if (ghostRef.current) {
        ghostRef.current.style.transform = ghostTransform(positionRef.current, session);
      }

      const hover = latestRef.current.resolveTarget(e.clientX, e.clientY);
      if (hover !== session.hover) {
        session.hover = hover;
        setDrag((prev) => (prev ? { ...prev, hover } : prev));
      }
    };

    const onUp = (e) => {
      if (e.pointerId !== session.pointerId) return;
      const wasDragging = session.started;
      const target = wasDragging ? latestRef.current.resolveTarget(e.clientX, e.clientY) : null;
      session.cleanup();
      if (wasDragging) latestRef.current.onDrop(cardId, target);
    };

    const onCancel = (e) => {
      if (e.pointerId !== session.pointerId) return;
      session.cleanup();
    };

    session.cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('touchmove', onTouchMove);
      sessionRef.current = null;
      setDrag(null);
    };

    sessionRef.current = session;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
  }, []);

  return { drag, ghostRef, positionRef, startDrag };
}
