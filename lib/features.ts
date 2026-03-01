// Feature Flag — 기본 ON, Vercel에서 "false"로 끌 수 있음
// 롤백: Vercel > Settings > Environment Variables에서 해당 값을 "false"로 변경 후 Redeploy

export const features = {
  forge: process.env.NEXT_PUBLIC_FEATURE_FORGE !== "false",
  templates: process.env.NEXT_PUBLIC_FEATURE_TEMPLATES !== "false",
  deploy: process.env.NEXT_PUBLIC_FEATURE_DEPLOY !== "false",
  bamIntegration: process.env.NEXT_PUBLIC_FEATURE_BAM_INTEGRATION !== "false",
  showConnect: process.env.NEXT_PUBLIC_SHOW_CONNECT !== "false",
  showTokenInfo: process.env.NEXT_PUBLIC_SHOW_TOKEN_INFO !== "false",
};
