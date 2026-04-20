# October Academy Landing

옥토버 아카데미의 랜딩 페이지와 구독 워커를 포함한 저장소입니다.

## Stack

- Next.js 16
- React 19
- TypeScript
- Cloudflare Pages
- Cloudflare Workers
- PostHog

## Development

```bash
bun install
bun dev
```

기본 프런트엔드 개발 서버는 `http://localhost:3000` 에서 실행됩니다.

워커 개발은 `workers/email-subscribe` 디렉터리에서 실행합니다.

```bash
cd workers/email-subscribe
bun install
bun run dev
```

## Build

```bash
bun run build
```

정적 빌드 결과물은 `out/` 에 생성됩니다.

## License

이 저장소의 코드, 카피, 브랜드 자산, 이미지, 스크린샷은 별도 표기가 없는 한 오픈소스로 제공되지 않습니다.

재사용 조건은 [LICENSE](./LICENSE)를 따릅니다.
