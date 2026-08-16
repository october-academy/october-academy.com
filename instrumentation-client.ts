import posthog from 'posthog-js'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',

    // Product Analytics
    capture_pageview: true,
    capture_pageleave: true,

    // Session Replay
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },

    // Web Analytics - 자동 속성 캡처
    autocapture: true,

    // Performance
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    },
  })
}
