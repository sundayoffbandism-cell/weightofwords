# THE WEIGHT OF WORDS

단어와 물체에 무게를 부여하고, 관객이 카드를 시소 좌우에 올리면 실제 무게에 따라 시소가 기울어지는 인터랙티브 웹아트.
(1단계: 시소 기본 화면 + 무게에 따른 기울기 + 카드 드래그 배치)

## 실행 방법

필요한 것: Node.js 20.19 이상 (또는 22.12 이상)

```bash
cd weight-of-words
npm install
npm run dev
```

터미널에 표시되는 주소(보통 http://localhost:5173)를 브라우저에서 열면 된다.
`Network:` 주소도 같이 표시되는데, 같은 와이파이의 스마트폰으로 접속하면 터치 동작을 바로 확인할 수 있다.

```bash
npm run build     # dist/ 에 배포용 파일 생성
npm run preview   # 빌드 결과 미리보기
```

## 폴더 구조

```
weight-of-words/
├─ index.html                  진입 HTML (한글 폰트 Pretendard 로드)
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                 React 시작점, 스타일 import
   ├─ App.jsx                  전체 상태(카드 배치)와 드래그 판정을 관리하는 최상위 컴포넌트
   ├─ data/
   │  └─ cards.js              단어/물체 카드와 무게 데이터
   ├─ utils/
   │  ├─ physics.js            무게 합계, 기울기 각도 계산 (순수 함수)
   │  └─ shuffle.js            트레이 카드 순서 섞기
   ├─ hooks/
   │  └─ useCardDrag.js        마우스/터치 공용 드래그 로직
   ├─ components/
   │  ├─ Seesaw.jsx            삼각형 받침대 + 회전하는 상판
   │  ├─ SeesawZone.jsx        상판 위 좌/우 카드 배치 영역
   │  ├─ Card.jsx              카드 1장 (tray / placed / ghost 형태)
   │  ├─ CardTray.jsx          하단 카드 목록 (가로 스크롤)
   │  └─ DragGhost.jsx         드래그 중 포인터를 따라다니는 카드 복제본
   └─ styles/
      ├─ variables.css         색상, 시소 크기, 애니메이션 시간
      ├─ global.css            기본 스타일, 레이아웃
      ├─ seesaw.css            시소 스타일
      ├─ card.css              카드 스타일
      └─ tray.css              트레이 스타일
```

## 동작 방식

- **드래그**: 트레이의 카드를 끌어 시소의 왼쪽/오른쪽 절반에 놓는다. 화면 중앙선을 기준으로 좌우가 판정된다.
- **쌓기**: 같은 쪽에 여러 장을 놓으면 아래에서 위로 쌓인다.
- **이동/제거**: 시소 위 카드를 다시 끌어 반대쪽에 놓거나, 트레이에 놓으면 내려온다. 카드를 집는 순간 기울기가 즉시 다시 계산된다.
- **모바일**: 트레이에서 가로 스와이프는 목록 스크롤, 위로 끌어올리면 카드 드래그다. 데스크톱에서는 마우스 휠로도 목록이 가로로 넘어간다.
- **무게 비공개**: 무게는 `physics.js` 계산에만 쓰이고 화면과 DOM 어디에도 출력하지 않는다.

## 기울기 조절

`src/utils/physics.js` 상단 상수만 바꾸면 된다.

| 상수 | 의미 | 기본값 |
| --- | --- | --- |
| `MAX_TILT_DEG` | 최대 기울기(도) | 15 |
| `MIN_TILT_DEG` | 무게가 조금이라도 다를 때의 최소 기울기 | 1.5 |
| `SENSITIVITY_G` | 클수록 큰 무게 차이가 있어야 최대 기울기에 도달 | 800 |

움직임의 속도와 탄성은 `src/styles/variables.css`의 `--tilt-duration`과 `src/styles/seesaw.css`의 `transition` 곡선으로 조절한다.
트레이 순서를 섞지 않고 데이터 순서대로 보여주려면 `App.jsx`의 `SHUFFLE_TRAY`를 `false`로 바꾼다.

## 다음 단계에서 붙이기 쉬운 지점

- 참여 기록, DB: `App.jsx`의 `handleDrop` 에서 카드가 놓일 때마다 기록을 남기면 된다.
- 카드 추가/수정: `src/data/cards.js` 만 고치면 된다.
- 로그인, 관리자 페이지: `App.jsx` 위에 라우터를 얹고 현재 화면을 `/` 페이지로 두면 된다.
