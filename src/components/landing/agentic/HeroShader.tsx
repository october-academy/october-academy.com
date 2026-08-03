"use client";

import { useEffect, useRef } from "react";

// ── AGENTIC WebGL 셰이더 v2 — unicorn.studio 'Shattered Nebula' 파이프라인 이식 ──
// 구조: 타일 마스크(고정) + 내부 네뷸라(마우스 추적 0.2/모멘텀) + 회전 색수차
//       + 갓레이(decay 0.9275) + ACES + 콘트라스트 1.16 + IGN 디더 + 픽셀레이트 등장
export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      cv.style.display = "none";
      return;
    }
    const frag = `
precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec2 uM; uniform float uPix;
const float TAU = 6.28318530718;

uniform sampler2D uLogo;
/* October Academy 빈 로고 마크를 마스크로 사용 (unicorn의 image mask 레이어 방식) */
vec2 logoUV(vec2 p) {
  vec2 q = (p - vec2(0., .0)) / vec2(.4774 * 1.042, .4774); /* 그리드 정합: 로고 높이 = 바깥 원 지름(.4774H) — 상하변이 접선 레일에 닿음 */
  return vec2(q.x, -q.y) + .5;
}
float covS(vec2 p, float bias) {
  vec2 u = logoUV(p);
  float e = smoothstep(0., .06, u.x) * smoothstep(1., .94, u.x)
          * smoothstep(0., .06, u.y) * smoothstep(1., .94, u.y);
  if (e <= 0.) return 0.;
  return texture2D(uLogo, u, min(bias, 3.4)).a * e;
}
/* 실루엣 본체 + 타이트 블러 + 유리 에지 림 (스펙트럼 샘플용 스칼라 필드) */
float maskField(vec2 p) {
  float c0 = smoothstep(.30, .72, covS(p, 0.));   /* 하드 에지 리맵 — 글래스 실루엣 */
  float c1 = covS(p, 1.2);
  float rim = max(c1 - c0 * c0, 0.);
  return c0 * 1.75 + c1 * .16 + rim * .8;
}

/* 값 노이즈 fbm — 네뷸라 내부 구조 */
float vhash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 q) {
  vec2 i = floor(q), f = fract(q); f = f * f * (3. - 2. * f);
  return mix(mix(vhash(i), vhash(i + vec2(1, 0)), f.x),
             mix(vhash(i + vec2(0, 1)), vhash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 q) {
  float a = .5, s = 0.;
  for (int i = 0; i < 3; i++) { s += a * vnoise(q); q = q * 2.03 + 17.7; a *= .5; }
  return s;
}
/* oklab 보간 — 원본 oklab_mix 이식 (오렌지↔블루가 회갈색 사점을 피해감) */
vec3 okmix(vec3 A, vec3 B, float a) {
  const mat3 toL = mat3(.4121656120, .2118591070, .0883097947,
                        .5362752080, .6807189584, .2818474174,
                        .0514575653, .1074065790, .6302613616);
  const mat3 toC = mat3( 4.0767245293, -1.2681437731, -.0041119885,
                        -3.3072168827,  2.6093323231, -.7034763098,
                         .2307590544, -.3411344290,  1.7068625689);
  vec3 la = pow(toL * A, vec3(1. / 3.)), lb = pow(toL * B, vec3(1. / 3.));
  vec3 lm = mix(la, lb, a);
  lm *= 1. + .025 * a * (1. - a);   /* 원본 크로마 부스트 */
  return toC * (lm * lm * lm);
}
/* 내부 네뷸라 — 마스크는 고정, 빛은 마우스를 따라 흐름 (trackMouse 0.2) */
vec3 nebColor(vec2 p, float t, vec2 m) {
  vec2 q = p * 2.6 + vec2(2.7, -1.9) + m * .20;   /* 고정 위상 — 좋은 노이즈 슬라이스 선택 */      /* 광류 (원본 nebula speed .3) */
  float n  = fbm(q);
  float n2 = fbm(q * 1.9 + 4.7);    /* 역방향 유동 — 간섭 포켓 */
  vec3 warm = vec3(1., .96, .90), orange = vec3(1., .53, .02), blue = vec3(.44, .66, 1.);
  float iw = smoothstep(2.5, 5.5, t);                          /* 인트로 워밍업과 동기화 */
  vec3 c = okmix(orange, warm, smoothstep(.48, .88, n) * (.22 + .78 * iw)); /* 초반 웜화이트 억제 — 오렌지로 점등 */
  c = okmix(c, blue, smoothstep(.50, .92, n2) * .6);
  c = okmix(c, blue,  smoothstep(.05, .30, p.x) * .30);   /* 우측 블루 */
  c = okmix(c, orange, smoothstep(-.05, -.30, p.x) * .35); /* 좌측 오렌지 */
  float a2 = .6;                                               /* 고정 — 상시 회전 제거 */
  mat2 rt = mat2(cos(a2), -sin(a2), sin(a2), cos(a2));
  float st = fbm((rt * p) * vec2(1.6, 7.0) + m * .12); /* 내부 스트릭 광 (정적) */
  /* 셀 플레어 — 저속·저진폭 (상태변화 ~4초, 저점 45% 플로어: 은은한 숨쉬기) */
  float f1 = fbm(p * 2.2 + vec2(t * .17, -t * .12));
  float f2 = vnoise(p * 4.6 + vec2(-t * .21, t * .15));
  float flare = smoothstep(.30, .78, f1 * .62 + f2 * .52);
  flare = .45 + .55 * flare;
  float dive = mix(1., clamp(.18 + flare * 1.05, 0., 1.), iw);  /* 인트로엔 다이브 없음 — 순수 오렌지 점등 */
  c = okmix(vec3(.07, .12, .40), c, dive);                      /* 저상태 딥블루 */
  float lum = (.16 + 2.8 * pow(max(n * .52 + n2 * .46 + st * .42 - .30, 0.), 1.8)) * (.30 + 1.75 * flare);
  return c * lum;
}

float ign(vec2 st) { return fract(52.9829189 * fract(dot(st, vec2(0.06711056, 0.00583715)))); }
vec3 aces(vec3 x) { return (x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv - .5; p.x *= uRes.x / uRes.y;
  vec2 cc = vec2(0., .0);                                     /* 로고 마크 중심 = 뷰포트 중심 */

  /* 픽셀레이트 등장 (unicorn pixelate2: amount*0.083) */
  if (uPix > .003) {
    float cell = uPix * .083;
    p = (floor(p / cell) + .5) * cell;
  }

  /* 회전 크로마 — 원본 chromab 3탭: R=-측, G=고정, B=+측 (시안·블루 프린지의 핵심) */
  float caAng = .25 * TAU;                /* 고정 각도 — 상시 회전 제거 (hover 세기 반응은 유지) */
  float mNear = smoothstep(.9, .0, distance(p, uM * .5 + cc));
  float caEnv = max(0., 1. - length(p - cc) * 1.92);        /* 원본 중심거리 falloff */
  float caAmt = .0066 * (1. + .5 * mNear) * caEnv;
  vec2 caDir = vec2(sin(caAng), cos(caAng));                /* 원본 (sin,cos) 위상 */
  vec3 neb = nebColor(p, uT, uM);
  vec3 col = vec3(maskField(p - caDir * caAmt),
                  maskField(p),
                  maskField(p + caDir * caAmt));
  col *= neb;                                        /* 네뷸라 착색 */
  /* 코어 블로우아웃 — 원본: 고휘도 무채색 수렴 + ACES 화이트 클립 (3채널 동시 도달) */
  float core = smoothstep(.45, .95, covS(p, .8));
  col *= 1. + core * 1.35;
  float introW = smoothstep(2.5, 5.5, uT);                 /* 인트로 워밍업 — 초반은 순수 오렌지, 이후 화이트 코어 점등 */
  float Lw = dot(col, vec3(.2126, .7152, .0722));
  col = mix(col, vec3(Lw), smoothstep(1.05, 2.3, Lw) * .85 * introW); /* 플레어 피크에서만 무채색 수렴 — 본체는 오렌지 */
  col += vec3(7.) * core * smoothstep(.60, 1.35, dot(neb, vec3(.333))) * introW;  /* 플레어 피크 코어만 화이트 클립 */
  /* 순수 분광 프린지 — 네뷸라 틴트와 무관하게 에지에서 시안/블루·레드 유지 (원본 chromab) */
  float rimB = max(covS(p + caDir * caAmt * 2.0, 1.2) - covS(p, 0.), 0.);
  float rimR = max(covS(p - caDir * caAmt * 2.0, 1.2) - covS(p, 0.), 0.);
  col += vec3(.05, .45, 1.) * rimB * .36 + vec3(1., .30, .04) * rimR * .26;
  col += neb * (covS(p, 3.4) * .13 + .008);          /* 헤일로 절감 — 순흑 배경 */

  /* 갓레이 — 원본: 32스텝 선형 누적, decay .9275, 루프 내 perp 지터(니들 샤프트), pow/감쇠 없음 */
  vec2 rpos = cc + uM * .08;                    /* 광원이 커서를 따라감 (원본 부호) */
  vec2 stp = (rpos - p) / 32. * .5625;          /* 원본 (0.25+min(1.,0.5))*0.75 */
  float n0 = ign(gl_FragCoord.xy);
  vec2 q = p + stp * n0;
  vec2 perp = vec2(-stp.y, stp.x);
  float w = 1., rays = 0.;
  for (int i = 0; i < 32; i++) {
    float th = float(i) / 32.;
    float s = covS(q, 1.);
    /* 레이도 영역 플레어에 연동 — 원본: 켜진 타일에서만 빔이 솟음 */
    rays += s * s * w * (.60 + .75 * vnoise(q * 3.1 + vec2(uT * .19, -uT * .14)));
    w *= .9275;
    q += stp + perp * th * sin((n0 * .25) * (1. + th) * 50.) * .25;   /* 원본 니들 지터 */
  }
  col += vec3(.812, .847, .996) * (rays * (1.96 / 32.)) * .55;

  /* (링은 원본과 동일하게 DOM SVG 오버레이로 이동 — 셰이더에서 제거) */

  /* 커서 블롭 글로우 */
  col += vec3(1., .58, .10) * exp(-length(p - uM * .5 - cc) * 4.) * .10 * min(length(uM) * 3., 1.);

  /* 배경 리프트 + 비네트 (순흑 유지 — 확정된 디자인 결정) */
  vec3 preCol = col;                                /* 리프트 전 신호 — 그레인 게이팅용 */
  col += vec3(.007, .007, .008);
  float vig = smoothstep(1.30, .35, length((uv - .5) * vec2(1.6, 1.2)));
  col *= mix(.26, 1., vig);

  /* ACES → 새추레이션 ×2 (원본 coloration HSL S×2) → 콘트라스트 1.16 → 그레인 */
  col = aces(col * 1.05);
  vec3 gLum = vec3(dot(col, vec3(.299, .587, .114)));
  col = clamp(gLum + (col - gLum) * 2.0, 0., 1.);   /* 화이트 코어(S≈0) 불변, 림만 선명 */
  col = 1.16 * (col - .5) + .5;
  /* 그레인 — 정적 IGN(원본), 신호 게이팅: 빈 배경은 그레인 0 */
  float sig = smoothstep(.0, .05, dot(preCol, vec3(.333)));
  float lum1 = clamp(dot(col, vec3(.333)), 0., 1.);
  col += (ign(gl_FragCoord.xy) - .5) * mix(.014, .006, lum1) * sig;
  gl_FragColor = vec4(max(col, 0.), 1.);
}`;
    const vert = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }";
    function sh(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      cv.style.display = "none";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uT = U("uT"), uM = U("uM"), uPix = U("uPix");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let logoTextureReady = false;

    function drawStaticFrame() {
      gl!.uniform2f(uM, 0, 0);
      gl!.uniform1f(uPix, 0);
      gl!.uniform1f(uT, 12);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    /* 로고 마크 → 마스크 텍스처 (헤더 로고와 동일한 원본 사용) */
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    const logoImg = new Image();
    logoImg.onload = () => {
      const c2 = document.createElement("canvas");
      c2.width = c2.height = 512;
      const x2 = c2.getContext("2d");
      if (!x2) return;
      const s = Math.min(512 / logoImg.width, 512 / logoImg.height) * 0.62;
      x2.drawImage(logoImg, (512 - logoImg.width * s) / 2, (512 - logoImg.height * s) / 2, logoImg.width * s, logoImg.height * s);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c2);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      logoTextureReady = true;
      if (reducedMotion) drawStaticFrame();
    };
    logoImg.src = "/assets/logo-mark.png";
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(U("uLogo"), 0);
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.5); /* unicorn dpi 1.5, 모바일 1.25 */
      cv!.width = cv!.clientWidth * dpr;
      cv!.height = cv!.clientHeight * dpr;
      gl!.viewport(0, 0, cv!.width, cv!.height);
      gl!.uniform2f(uRes, cv!.width, cv!.height);
      if (reducedMotion && logoTextureReady) drawStaticFrame();
    }
    resize();
    window.addEventListener("resize", resize);

    /* 마우스 — 스프링 + 모멘텀 (unicorn trackMouse 0.2 / momentum 0.3 느낌) */
    const hero = cv.closest<HTMLElement>(".hero");
    let tx = 0, ty = 0, mx = 0, my = 0, vx = 0, vy = 0, lastPtr = -1e9;
    function setPtr(cx: number, cy: number) {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      tx = ((cx - r.left) / r.width - 0.5) * (r.width / r.height);
      ty = 0.5 - (cy - r.top) / r.height;
      lastPtr = performance.now();
    }
    const onMouseMove = (e: MouseEvent) => setPtr(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setPtr(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onMouseLeave = () => { lastPtr = -1e9; };
    const onTouchEnd = () => { lastPtr = performance.now() - 2200; };
    if (hero) {
      hero.addEventListener("mousemove", onMouseMove);
      hero.addEventListener("touchmove", onTouchMove, { passive: true });
      hero.addEventListener("mouseleave", onMouseLeave);
      hero.addEventListener("touchend", onTouchEnd);
    }

    let visible = true;
    const t0 = performance.now();
    let raf = 0;
    let io: IntersectionObserver | null = null;
    function frame(now: number) {
      if (visible) {
        const t = (now - t0) / 1000;
        if (now - lastPtr > 3000) {                     /* 포인터 없으면 자율 드리프트 (모바일) */
          tx = 0; ty = 0;   /* 아이들 드리프트 제거 — 정지 상태 유지 */
        }
        vx = vx * 0.88 + (tx - mx) * 0.016; vy = vy * 0.88 + (ty - my) * 0.016;  /* 모멘텀 스프링 */
        mx += vx; my += vy;
        const pix = Math.max(0, Math.min(1, 1 - (t - 0.4) / 1.0));            /* 픽셀레이트 등장 */
        gl!.uniform1f(uPix, pix * pix);                                       /* easeOutQuad */
        gl!.uniform2f(uM, mx, my);
        gl!.uniform1f(uT, t);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      }
      if (!reducedMotion) raf = requestAnimationFrame(frame);
    }
    if (reducedMotion) {
      drawStaticFrame();
    } else {
      io = new IntersectionObserver(es => { visible = es[0].isIntersecting; });
      io.observe(cv);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (hero) {
        hero.removeEventListener("mousemove", onMouseMove);
        hero.removeEventListener("touchmove", onTouchMove);
        hero.removeEventListener("mouseleave", onMouseLeave);
        hero.removeEventListener("touchend", onTouchEnd);
      }
      io?.disconnect();
      logoImg.onload = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas id="agShader" aria-hidden="true" ref={canvasRef} />;
}
