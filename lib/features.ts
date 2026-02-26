// Phase별 점진적 기능 공개를 위한 Feature Flag
// Vercel 환경변수에서 "true" 문자열일 때만 활성화
// 롤백: Vercel > Settings > Environment Variables에서 해당 값을 "false"로 변경 후 Redeploy

export const features = {
  // Phase 2: Rule Forge 캔버스 접근
  forge: process.env.NEXT_PUBLIC_FEATURE_FORGE === "true",

  // Phase 4: 템플릿 마켓플레이스
  templates: process.env.NEXT_PUBLIC_FEATURE_TEMPLATES === "true",

  // Phase 5: 온체인 배포 버튼
  deploy: process.env.NEXT_PUBLIC_FEATURE_DEPLOY === "true",

  // Phase 5: Jito BAM 실배포 연계
  bamIntegration:
    process.env.NEXT_PUBLIC_FEATURE_BAM_INTEGRATION === "true",

  // Phase 3: 지갑 연결 버튼 표시
  showConnect: process.env.NEXT_PUBLIC_SHOW_CONNECT === "true",

  // Phase 1: 토큰 정보 / CA 표시
  showTokenInfo: process.env.NEXT_PUBLIC_SHOW_TOKEN_INFO === "true",
};
