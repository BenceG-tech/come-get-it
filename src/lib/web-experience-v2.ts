// Supplied web-refresh v2 media; immutable CDN pointers.
// The local Vite preview does not proxy /__l5e/assets-v1, so resolve through the live brand domain.
const media = (url: string) => `https://come-get-it.app${url}`;
import asset0 from "@/assets/web-experience-v2/bg-1-desktop.webp.asset.json";
import asset1 from "@/assets/web-experience-v2/bg-1-mobile.webp.asset.json";
import asset2 from "@/assets/web-experience-v2/bg-2-desktop.webp.asset.json";
import asset3 from "@/assets/web-experience-v2/bg-2-mobile.webp.asset.json";
import asset4 from "@/assets/web-experience-v2/bg-3-desktop.webp.asset.json";
import asset5 from "@/assets/web-experience-v2/bg-3-mobile.webp.asset.json";
import asset6 from "@/assets/web-experience-v2/bg-4-desktop.webp.asset.json";
import asset7 from "@/assets/web-experience-v2/bg-4-mobile.webp.asset.json";
import asset8 from "@/assets/web-experience-v2/consumer-list.webp.asset.json";
import asset9 from "@/assets/web-experience-v2/drink-isolated.webp.asset.json";
import asset10 from "@/assets/web-experience-v2/drink-shadow.webp.asset.json";
import asset11 from "@/assets/web-experience-v2/earn-balance.webp.asset.json";
import asset12 from "@/assets/web-experience-v2/feat-drink-bg-desktop.webp.asset.json";
import asset13 from "@/assets/web-experience-v2/feat-drink-bg-mobile.webp.asset.json";
import asset14 from "@/assets/web-experience-v2/feat-give-bg-desktop.webp.asset.json";
import asset15 from "@/assets/web-experience-v2/feat-give-bg-mobile.webp.asset.json";
import asset16 from "@/assets/web-experience-v2/fg-offer-venue.webp.asset.json";
import asset17 from "@/assets/web-experience-v2/fg-redeem-steps.webp.asset.json";
import asset18 from "@/assets/web-experience-v2/hero-desktop-poster.webp.asset.json";
import asset19 from "@/assets/web-experience-v2/hero-desktop.mp4.asset.json";
import asset20 from "@/assets/web-experience-v2/hero-desktop.webm.asset.json";
import asset21 from "@/assets/web-experience-v2/hero-mobile-poster.webp.asset.json";
import asset22 from "@/assets/web-experience-v2/hero-mobile.mp4.asset.json";
import asset23 from "@/assets/web-experience-v2/hero-mobile.webm.asset.json";
import asset24 from "@/assets/web-experience-v2/redeem-arrival.webp.asset.json";
import asset25 from "@/assets/web-experience-v2/redeem-confirm.webp.asset.json";
import asset26 from "@/assets/web-experience-v2/redeem-show.webp.asset.json";
import asset27 from "@/assets/web-experience-v2/redeem-success.webp.asset.json";
import asset28 from "@/assets/web-experience-v2/reward-detail.webp.asset.json";
import asset29 from "@/assets/web-experience-v2/rewards-experiences.webp.asset.json";
import asset30 from "@/assets/web-experience-v2/rewards-list.webp.asset.json";
import asset31 from "@/assets/web-experience-v2/screen-1.webp.asset.json";
import asset32 from "@/assets/web-experience-v2/screen-2.webp.asset.json";
import asset33 from "@/assets/web-experience-v2/screen-3.webp.asset.json";
import asset34 from "@/assets/web-experience-v2/screen-4.webp.asset.json";
import asset35 from "@/assets/web-experience-v2/ui-loops/phone-step-1-map-v2.mp4.asset.json";
import asset36 from "@/assets/web-experience-v2/ui-loops/phone-step-3-redeem-v2.mp4.asset.json";
import asset37 from "@/assets/web-experience-v2/venue-detail.webp.asset.json";
import asset38 from "@/assets/web-experience-v2/venue-offer.webp.asset.json";
export const v2 = {
  "bg-1-desktop.webp": media(asset0.url),
  "bg-1-mobile.webp": media(asset1.url),
  "bg-2-desktop.webp": media(asset2.url),
  "bg-2-mobile.webp": media(asset3.url),
  "bg-3-desktop.webp": media(asset4.url),
  "bg-3-mobile.webp": media(asset5.url),
  "bg-4-desktop.webp": media(asset6.url),
  "bg-4-mobile.webp": media(asset7.url),
  "consumer-list.webp": media(asset8.url),
  "drink-isolated.webp": media(asset9.url),
  "drink-shadow.webp": media(asset10.url),
  "earn-balance.webp": media(asset11.url),
  "feat-drink-bg-desktop.webp": media(asset12.url),
  "feat-drink-bg-mobile.webp": media(asset13.url),
  "feat-give-bg-desktop.webp": media(asset14.url),
  "feat-give-bg-mobile.webp": media(asset15.url),
  "fg-offer-venue.webp": media(asset16.url),
  "fg-redeem-steps.webp": media(asset17.url),
  "hero-desktop-poster.webp": media(asset18.url),
  "hero-desktop.mp4": media(asset19.url),
  "hero-desktop.webm": media(asset20.url),
  "hero-mobile-poster.webp": media(asset21.url),
  "hero-mobile.mp4": media(asset22.url),
  "hero-mobile.webm": media(asset23.url),
  "redeem-arrival.webp": media(asset24.url),
  "redeem-confirm.webp": media(asset25.url),
  "redeem-show.webp": media(asset26.url),
  "redeem-success.webp": media(asset27.url),
  "reward-detail.webp": media(asset28.url),
  "rewards-experiences.webp": media(asset29.url),
  "rewards-list.webp": media(asset30.url),
  "screen-1.webp": media(asset31.url),
  "screen-2.webp": media(asset32.url),
  "screen-3.webp": media(asset33.url),
  "screen-4.webp": media(asset34.url),
  "ui-phone-step-1-map-v2.mp4": media(asset35.url),
  "ui-phone-step-3-redeem-v2.mp4": media(asset36.url),
  "venue-detail.webp": media(asset37.url),
  "venue-offer.webp": media(asset38.url),
} as const;
