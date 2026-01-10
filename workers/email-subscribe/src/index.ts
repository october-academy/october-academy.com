interface Env {
  RESEND_API_KEY: string;
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  GOOGLE_SHEET_ID: string;
  INFLEARN_GOOGLE_SHEET_ID: string;
  ALLOWED_ORIGINS: string;
  KAKAO_CHAT_URL: string;
  TEMPLATES_URL: string;
}

type SubscriptionType = "general" | "inflearn";

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

// =============================================================================
// CORS 처리
// =============================================================================

function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = env.ALLOWED_ORIGINS.split(",");

  const isAllowed = allowedOrigins.some((allowed) =>
    origin.startsWith(allowed.trim())
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// =============================================================================
// JWT 생성 (Google Service Account 인증용)
// =============================================================================

function base64UrlEncode(data: ArrayBuffer | string): string {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createJWT(
  credentials: ServiceAccountCredentials
): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // PEM 형식의 private key를 PKCS8 형식으로 변환
  const pemContents = credentials.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  return `${unsignedToken}.${base64UrlEncode(signature)}`;
}

async function getAccessToken(jwt: string): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// =============================================================================
// Google Sheets 저장
// =============================================================================

async function appendToSheet(
  email: string,
  sheetId: string,
  accessToken: string
): Promise<void> {
  const timestamp = new Date().toISOString();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:B:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [[email, timestamp]],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to append to sheet: ${error}`);
  }
}

// =============================================================================
// Resend 이메일 발송
// =============================================================================

function getEmailHtml(templatesUrl: string, kakaoUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0a0a0a; border: 3px solid #ffffff; box-shadow: 6px 6px 0px #333333;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 3px solid #333;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: #FF6B35; color: #000; font-size: 11px; font-weight: 800; padding: 6px 12px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #000;">무료 제공</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                      환영합니다! 🎉
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <p style="margin: 0; font-size: 15px; color: #9ca3af; line-height: 1.6;">
                      옥토버 코드 커뮤니티에 가입해주셔서 감사합니다.<br>
                      약속드린 자료를 보내드립니다.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Template Section -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.05); border: 3px solid #fff; box-shadow: 4px 4px 0px #333;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 28px;">📄</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                            이력서 템플릿 + 포트폴리오 샘플
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                            면접관 시점에서 만든 템플릿입니다.<br>
                            바로 다운로드해서 사용하세요.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <a href="${templatesUrl}" style="display: inline-block; background: #FF6B35; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 28px; text-decoration: none; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
                            템플릿 다운로드 →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- KakaoTalk Section -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.05); border: 3px solid #fff; box-shadow: 4px 4px 0px #333;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 28px;">💬</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                            멘토 Q&A 단톡방
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                            취준 관련 질문, 정보 공유,<br>
                            서로 응원하는 커뮤니티입니다.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <a href="${kakaoUrl}" style="display: inline-block; background: #FEE500; color: #000000; font-size: 14px; font-weight: 700; padding: 14px 28px; text-decoration: none; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
                            오픈채팅 참여하기 →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mentor Info -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #333;">
                <tr>
                  <td style="padding-top: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #FF6B35, #e55a2b); border: 2px solid #fff; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #fff; font-size: 18px; font-weight: 800;">유</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                            유호균 멘토
                          </p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280; line-height: 1.4;">
                            전 네이버 기술 면접관 · 현 SW마에스트로 멘토
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: rgba(255,255,255,0.03); border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.5;">
                이 이메일은 october-academy.com에서 발송되었습니다.<br>
                문의: admin@october-academy.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function getInflearnEmailHtml(templatesUrl: string, kakaoUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0a0a0a; border: 3px solid #ffffff; box-shadow: 6px 6px 0px #333333;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 3px solid #333;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: #FF6B35; color: #000; font-size: 11px; font-weight: 800; padding: 6px 12px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #000;">50% 할인 예약</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                      대기 등록 완료! 🎉
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <p style="margin: 0; font-size: 15px; color: #9ca3af; line-height: 1.6;">
                      [인프런] 이력서 강의 대기 등록이 완료되었습니다.<br>
                      강의 오픈 시 <strong style="color: #FF6B35;">50% 할인 코드</strong>를 이메일로 보내드립니다.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Discount Info Section -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,107,53,0.1); border: 3px solid #FF6B35; box-shadow: 4px 4px 0px #333;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 28px;">🎫</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                            대기 등록 혜택
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                            • 강의 오픈 시 50% 할인 코드 발송<br>
                            • 오픈 알림 가장 먼저 받기<br>
                            • 대기자 전용 추가 혜택 예정
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Template Section -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.05); border: 3px solid #fff; box-shadow: 4px 4px 0px #333;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 28px;">📄</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                            이력서 템플릿 + 포트폴리오 샘플
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                            대기 등록 감사 선물로 드립니다.<br>
                            바로 다운로드해서 사용하세요.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <a href="${templatesUrl}" style="display: inline-block; background: #FF6B35; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 28px; text-decoration: none; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
                            템플릿 다운로드 →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- KakaoTalk Section -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.05); border: 3px solid #fff; box-shadow: 4px 4px 0px #333;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 28px;">💬</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                            멘토 Q&A 단톡방
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                            취준 관련 질문, 정보 공유,<br>
                            서로 응원하는 커뮤니티입니다.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <a href="${kakaoUrl}" style="display: inline-block; background: #FEE500; color: #000000; font-size: 14px; font-weight: 700; padding: 14px 28px; text-decoration: none; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
                            오픈채팅 참여하기 →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mentor Info -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #333;">
                <tr>
                  <td style="padding-top: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #FF6B35, #e55a2b); border: 2px solid #fff; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #fff; font-size: 18px; font-weight: 800;">유</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                            유호균 멘토
                          </p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280; line-height: 1.4;">
                            전 네이버 기술 면접관 · 현 SW마에스트로 멘토
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: rgba(255,255,255,0.03); border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.5;">
                이 이메일은 october-academy.com에서 발송되었습니다.<br>
                문의: admin@october-academy.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

async function sendEmail(
  to: string,
  apiKey: string,
  templatesUrl: string,
  kakaoUrl: string,
  type: SubscriptionType = "general"
): Promise<void> {
  const isInflearnType = type === "inflearn";
  const subject = isInflearnType
    ? "[옥토버 코드] 인프런 이력서 강의 대기 등록 완료"
    : "[옥토버 코드] 이력서 템플릿 & 단톡방 링크";
  const html = isInflearnType
    ? getInflearnEmailHtml(templatesUrl, kakaoUrl)
    : getEmailHtml(templatesUrl, kakaoUrl);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "옥토버 코드 <noreply@notifications.october-academy.com>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Email send failed: ${error}`);
    // 이메일 발송 실패는 throw하지 않음 (저장은 성공했으므로)
  }
}

// =============================================================================
// 이메일 유효성 검사
// =============================================================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// =============================================================================
// 메인 핸들러
// =============================================================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = getCorsHeaders(request, env);

    // Preflight 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // POST만 허용
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const body = (await request.json()) as { email?: string; type?: SubscriptionType };
      const email = body.email?.trim().toLowerCase();
      const subscriptionType: SubscriptionType = body.type === "inflearn" ? "inflearn" : "general";

      // 이메일 검증
      if (!email || !isValidEmail(email)) {
        return new Response(
          JSON.stringify({
            error: "invalid_email",
            message: "올바른 이메일 주소를 입력하세요",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // type에 따라 다른 Google Sheet에 저장
      const sheetId = subscriptionType === "inflearn"
        ? env.INFLEARN_GOOGLE_SHEET_ID
        : env.GOOGLE_SHEET_ID;

      // Google Sheets에 저장
      const credentials = JSON.parse(
        env.GOOGLE_SERVICE_ACCOUNT_JSON
      ) as ServiceAccountCredentials;
      const jwt = await createJWT(credentials);
      const accessToken = await getAccessToken(jwt);
      await appendToSheet(email, sheetId, accessToken);

      // 이메일 발송 (비동기, 응답을 기다리지 않음)
      ctx.waitUntil(
        sendEmail(email, env.RESEND_API_KEY, env.TEMPLATES_URL, env.KAKAO_CHAT_URL, subscriptionType)
      );

      const successMessage = subscriptionType === "inflearn"
        ? "대기 등록이 완료되었습니다"
        : "구독이 완료되었습니다";

      return new Response(
        JSON.stringify({ success: true, message: successMessage }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Subscription error:", error);

      return new Response(
        JSON.stringify({
          error: "server_error",
          message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};
