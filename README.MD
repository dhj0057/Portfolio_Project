# 0/1 LOGIC — Integrated Developer Identity System

> **"Zero Sentiment, Absolute Logic."**
> 감정을 배제한 데이터 중심 분석과 정확한 로직을 지향하는 개발자 도형준의 통합 포트폴리오 시스템입니다.

부팅되는 시스템 콘솔을 컨셉으로, JavaScript와 jQuery를 사용해 **동적이고 상호작용 가능한** 단일 페이지 포트폴리오로 구현했습니다.

---

## 1. 프로젝트 개요
* **프로젝트명:** 0/1 LOGIC (Integrated Developer Identity)
* **목적:** 1학년 1학기부터 졸업까지의 기술 자산을 아카이브하고, AI 소프트웨어 엔지니어로서의 역량을 증명하는 통합 대시보드 구축.
* **핵심 가치:** Clarity(명확한 정보 위계) · Efficiency(미니멀 아키텍처) · Scalability(확장 가능한 구조).

## 2. 기술 스택
* **Markup / Style:** HTML5 (Semantic), CSS3 (Flexbox/Grid, 3D Transform, CSS Variables, `@keyframes`, `prefers-reduced-motion`)
* **Interactivity:** JavaScript (ES6+, 이벤트 모델, IntersectionObserver, requestAnimationFrame), jQuery 3.7.1
* **Tooling:** Git, GitHub, GitHub Pages

## 3. 주요 인터랙션 (동적/상호작용 기능)
1. **Boot Sequence** — 진입 시 터미널 부팅 시퀀스가 타이핑되며 시스템이 "온라인"되는 연출.
2. **Hero Typewriter** — 메인 헤드라인을 한 글자씩 타이핑하고 깜빡이는 커서 표시.
3. **System HUD** — 실시간 시계 · 스크롤 진행률 · 현재 섹션을 좌하단 계기판에 표시.
4. **Scroll Reveal** — IntersectionObserver로 섹션·카드가 스크롤 진입 시 페이드인.
5. **Skill Gauges** — 스킬 섹션 진입 시 게이지 바가 0%→목표치로 채워지며 수치 카운트업.
6. **Scrollspy + Progress Bar** — 스크롤 위치에 따라 네비 활성화 및 상단 진행 바 갱신.
7. **Project Filter** — 카테고리 버튼(jQuery) 클릭으로 프로젝트 카드 필터링.
8. **Project Modal** — 카드 클릭 시 상세 모달 오픈, ESC/오버레이로 닫기.
9. **Theme Toggle** — 라이트/다크 모드 전환(jQuery `toggleClass`), 선택값 로컬 저장.
10. **Mobile Nav** — 반응형 햄버거 메뉴 토글.

## 4. 디렉토리 구조
```text
/
├── index.html        # 메인 단일 페이지
├── dhj.css           # 테마 변수 기반 메인 스타일
├── script.js         # 인터랙션 로직 (Vanilla JS + jQuery)
├── jquery.min.js     # jQuery 3.7.1 (로컬 번들)
└── README.MD
```

## 5. 실행
저장소를 GitHub Pages로 배포하거나, `index.html`을 브라우저에서 직접 열면 됩니다.

---
© 2026 DO HYEONG JUN
