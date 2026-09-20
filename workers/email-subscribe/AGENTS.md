# 이메일 구독 Worker

[루트 지침](../../AGENTS.md)을 따른다. 이 파일은 구독 처리·이메일·Worker 설정 작업에 적용한다.
Cloudflare Worker의 원본은 `src/index.ts`, 설정은 `wrangler.toml`, 명령은 이 디렉터리 `package.json`이다.

## 계약

- 허용 origin의 JSON POST를 받아 Google Sheets에 저장하고 Resend 이메일을 비동기로 보낸다.
  CORS·입력 검증·IP 제한·이메일 중복 처리와 오류 응답을 유지한다.
- `general`, `inflearn`, `league`는 서로 다른 Sheet·템플릿을 사용한다.
  허브에는 구독 폼이 없으며 `league`는 이전 대기자 데이터를 위한 기존 계약이다.
- 저장 성공 응답은 이메일 전달 성공의 증거가 아니다. 현재 발송은 `ctx.waitUntil`로 처리된다.
- Service Account·Resend 자격증명과 구독자 데이터는 저장소·로그·검증 산출물에 노출하지 않는다.

## 명령과 완료 기준

- 로컬 실행: `bun run dev`. 변경된 처리·오류 경로를 로컬 fixture와 mock으로 확인한다.
  이 package에는 별도 test 스크립트가 없으므로 실행하지 않은 테스트를 통과로 보고하지 않는다.
- 배포 요청이 있을 때: 대상 계정·Worker·환경을 확인하고 `bun run deploy`를 실행한다.
  `bun run tail`은 배포된 Worker 로그 열람이며 로컬 검증이 아니다.
- 운영 POST는 실제 Sheet 기록과 이메일을 만들 수 있다. 명시적인 발송 검증 요청이 있을 때만 실행한다.
- 로컬 결과, Worker 배포, Sheet 저장, 이메일 발송·전달 결과를 각각 확인한 범위로 보고한다.
