export const features = {
  forge: process.env.NEXT_PUBLIC_FEATURE_FORGE === "true",
  templates: process.env.NEXT_PUBLIC_FEATURE_TEMPLATES === "true",
  deploy: process.env.NEXT_PUBLIC_FEATURE_DEPLOY === "true",
  bamIntegration: process.env.NEXT_PUBLIC_FEATURE_BAM === "true",
};
