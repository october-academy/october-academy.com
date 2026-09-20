# October Academy

한국어 제품 허브(`/`)가 1:1 멘토링(`/mentoring`), Agentic30, Agentic Garage로 연결된다.
Next.js App Router의 정적 사이트이며 이메일 구독 Worker는 별도 서비스다.

## 개발과 검증

- 패키지 관리는 **Bun**을 사용한다. 명령 원본은 루트 `package.json`이다.
- 화면 확인: `bun dev`. 프론트엔드 코드·콘텐츠 변경: `bun run lint`, `bun run build`.
  정적 결과는 `next.config.ts`의 `output: "export"`에 따라 `out/`에 생성된다.
- 일반 지침·문서 수정은 링크와 diff를 확인한다. 통과한 제품 빌드를 문구 수정마다 반복하지 않는다.
- 사용자에게 보이는 화면·상호작용은 Aside로 확인하고 로컬 빌드와 실제 배포 결과를 구분한다.
- 승인된 범위의 구현·관련 검증·실패 수정까지 이어간다. 명령·의존성이 불분명하면 설정을 확인하고 원인을 명시한다.

## 변경할 원본

- 콘텐츠·가격·설정은 `src/lib/constants.ts`의 기존 항목을 우선 사용한다. 항목이 없는 화면 문구는 해당 컴포넌트에서 확인한다.
- 랜딩 섹션은 `src/components/landing/sections.tsx`, 공용 UI는 `ui.tsx`, 허브는 `src/app/page.tsx`다.
- 시각·컴포넌트 변경에는 [디자인 시스템](docs/design-system.md)과 `src/app/globals.css`의 관련 토큰을 따른다.
  기존 디자인을 유지하고 `prefers-reduced-motion`을 존중한다.
- PostHog는 `instrumentation-client.ts`와 `src/app/posthog-provider.tsx`에서 초기화한다.
  분석·수집 설정 변경은 두 초기화 경로와 이벤트 사용처를 함께 확인한다.
- `@/*`는 `src/*`다. 생성된 `out/`을 직접 고쳐 소스 변경을 대신하지 않는다.

## 구독·배포 작업

구독 처리·이메일·Worker 설정·Worker 배포 작업을 할 때만
[이메일 Worker 지침](workers/email-subscribe/AGENTS.md)을 읽는다. 루트 세션도 해당 작업 전에 직접 읽는다.
일반 페이지 문구·지침 변경에 운영 구독 제출·이메일 발송·Worker 배포를 실행하지 않는다.
제품 API·수집 데이터·가격 변경은 요청 범위와 기존 계약을 확인한다.
