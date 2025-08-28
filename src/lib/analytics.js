export const track = (event, payload = {}) => {
  // Swap this console.log with your analytics (GA4/PostHog/Vercel Analytics)
  // eslint-disable-next-line no-console
  console.log("[analytics]", event, payload);
};
