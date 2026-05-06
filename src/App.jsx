import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createCheckout } from "./api/checkout";

const CART_STORAGE_KEY = "comfywon.cart.v1";
const SHOPIFY_STORE_HOST = "comfywon.myshopify.com";
const CUSTOMER_VIDEO_SRC = "https://psy6pii52jnn4obo.public.blob.vercel-storage.com/Customer%20Video.mp4";
const CUSTOMER_VIDEO_THUMBNAIL = "/Video Thumbnail.png";

function isSafeCheckoutUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === SHOPIFY_STORE_HOST;
  } catch {
    return false;
  }
}

const ICON_PATHS = {
  menu: (
    <>
      <path d="M4 8h24" />
      <path d="M4 16h24" />
      <path d="M4 24h24" />
    </>
  ),
  x: (
    <>
      <path d="M8 8l16 16" />
      <path d="M24 8L8 24" />
    </>
  ),
  cart: (
    <>
      <path d="M6 7h3l2.2 12.5a2 2 0 0 0 2 1.6h10.6a2 2 0 0 0 1.9-1.4L29 10H11" />
      <circle cx="14" cy="26" r="2" />
      <circle cx="25" cy="26" r="2" />
    </>
  ),
  battery: (
    <>
      <rect x="7" y="10" width="17" height="13" rx="3" />
      <path d="M24 14h2.5v5H24" />
      <path d="M12 16h7" />
    </>
  ),
  thermometer: (
    <>
      <path d="M16 5a4 4 0 0 0-4 4v9.5a7 7 0 1 0 8 0V9a4 4 0 0 0-4-4z" />
      <path d="M16 11v10" />
      <path d="M22 8h4" />
      <path d="M22 13h3" />
    </>
  ),
  waves: (
    <>
      <path d="M11 6c-4 4 4 6 0 10s4 6 0 10" />
      <path d="M21 6c-4 4 4 6 0 10s4 6 0 10" />
    </>
  ),
  power: (
    <>
      <path d="M16 5v12" />
      <path d="M10 9a10 10 0 1 0 12 0" />
    </>
  ),
  home: (
    <>
      <path d="M5 15L16 6l11 9" />
      <path d="M8 14v13h6v-7h4v7h6V14" />
    </>
  ),
  briefcase: (
    <>
      <rect x="5" y="11" width="22" height="15" rx="3" />
      <path d="M12 11V8h8v3" />
      <path d="M5 17h22" />
      <path d="M16 16v3" />
    </>
  ),
  moon: <path d="M23 22.5A10.5 10.5 0 0 1 12.2 7.1 10.5 10.5 0 1 0 23 22.5z" />,
  star: <path d="M16 4.5l3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.8-7-3.7-7 3.7 1.3-7.8-5.6-5.5 7.8-1.1L16 4.5z" />,
  arrow: (
    <>
      <path d="M7 16h17" />
      <path d="M17 9l7 7-7 7" />
    </>
  ),
  play: <path d="M11 8l13 8-13 8V8z" />,
  plus: (
    <>
      <path d="M16 7v18" />
      <path d="M7 16h18" />
    </>
  ),
  check: (
    <>
      <path d="M26 9L13.5 22 7 15.5" />
    </>
  ),
  shield: (
    <>
      <path d="M16 5l10 4v7c0 6-4.2 10-10 12-5.8-2-10-6-10-12V9l10-4z" />
      <path d="M11 16l3.2 3.2L21 12" />
    </>
  ),
  truck: (
    <>
      <path d="M4 9h15v12H4z" />
      <path d="M19 13h4l5 5v3h-9z" />
      <circle cx="10" cy="24" r="2" />
      <circle cx="23" cy="24" r="2" />
    </>
  ),
  rotate: (
    <>
      <path d="M24 10a9 9 0 1 0 1 10" />
      <path d="M24 4v6h-6" />
    </>
  ),
  lock: (
    <>
      <rect x="7" y="14" width="18" height="13" rx="3" />
      <path d="M11 14v-3a5 5 0 0 1 10 0v3" />
    </>
  ),
  gift: (
    <>
      <rect x="5" y="13" width="22" height="14" rx="2" />
      <path d="M16 13v14" />
      <path d="M5 18h22" />
      <path d="M16 13c-4-6-9-3.5-7 0" />
      <path d="M16 13c4-6 9-3.5 7 0" />
    </>
  ),
  flame: (
    <>
      <path d="M18 4c1.5 4-2.5 5.5-2.5 9 0 1.3.8 2.5 2 3-4 .3-7-2.4-7-6.4C7.5 12.3 5 16 5 20a11 11 0 0 0 22 0c0-5.2-3-9.2-9-16z" />
    </>
  ),
  clock: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9v8l5 3" />
    </>
  ),
  package: (
    <>
      <path d="M6 10l10-5 10 5v12l-10 5-10-5V10z" />
      <path d="M6 10l10 5 10-5" />
      <path d="M16 15v12" />
    </>
  ),
  heart: (
    <path d="M16 27S5 20.7 5 12.8C5 8.8 7.8 6 11.5 6c2 0 3.6 1 4.5 2.4C16.9 7 18.5 6 20.5 6 24.2 6 27 8.8 27 12.8 27 20.7 16 27 16 27z" />
  ),
  image: (
    <>
      <rect x="5" y="7" width="22" height="18" rx="3" />
      <path d="M9 21l5-5 4 4 3-3 6 6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  filter: (
    <>
      <path d="M6 8h20" />
      <path d="M10 16h12" />
      <path d="M14 24h4" />
    </>
  ),
};

function Icon({ name, size = 24, className = "", fill = "none", strokeWidth = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const LISTING_IMAGES = [
  "/Listing Image 1.jpg",
  "/Listing Image 2.jpg",
  "/Listing Image 3.jpg",
  "/Listing Image 4.jpg",
  "/Listing Image 5.jpg",
  "/Listing Image 6.jpg",
  "/Listing Image 7.jpg",
  "/Listing Image 8.jpg",
  "/Listing Image 9.jpg",
];

const WHITE_LISTING_IMAGES = [
  "/White Listing Image 1.jpg",
  "/White Listing Image 2.jpg",
  "/White Listing Image 3.jpg",
  "/White Listing Image 4.jpg",
  "/White Listing Image 5.jpg",
  "/White Listing Image 6.jpg",
  "/White Listing Image 7.jpg",
  "/White Listing Image 8.jpg",
  "/White Listing Image 9.jpg",
];

const PRODUCT_COLORS = [
  {
    id: "pink",
    label: "Blush Pink",
    swatch: "#f7a6b8",
    image: "/Listing Image 1.jpg",
    variantId: "gid://shopify/ProductVariant/42387049185315",
  },
  {
    id: "white",
    label: "Soft White",
    swatch: "#fff8f0",
    image: "/White Listing Image 1.jpg",
    variantId: "gid://shopify/ProductVariant/42387049218083",
  },
];

const REVIEW_TOTAL = 2932;
const REVIEW_RATING = "4.8";
const PRODUCT_PRICE_CENTS = 3299;
const RETAIL_PRICE_CENTS = 6599;
const PRODUCT_PRICE_LABEL = `$${(PRODUCT_PRICE_CENTS / 100).toFixed(2)}`;
const RETAIL_PRICE_LABEL = `$${(RETAIL_PRICE_CENTS / 100).toFixed(2)}`;

function formatPriceFromCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

const FEATURES = [
  {
    icon: "check",
    title: "Stretchy Waistband",
    text: "Soft, flexible comfort made to move with your body.",
  },
  {
    icon: "thermometer",
    title: "5 Heat Levels",
    text: "Adjustable warmth from 113F to 140F.",
  },
  {
    icon: "waves",
    title: "Massage Vibration",
    text: "Gentle vibration helps ease tension.",
  },
  {
    icon: "battery",
    title: "Cordless & Rechargeable",
    text: "Rechargeable warmth without wall cords.",
  },
];

const HOW_STEPS = [
  {
    number: "01",
    title: "Hold power 3 seconds",
    text: "Press and hold the power button for 3 seconds to turn ComfyWon on.",
  },
  {
    number: "02",
    title: "Increase heat",
    text: "Press the heating button to move through the warmth levels until it feels right.",
  },
  {
    number: "03",
    title: "Switch massage",
    text: "Press the massage button to change vibration modes for extra cramp comfort.",
  },
];

const LIFESTYLE_CARDS = [
  {
    icon: "briefcase",
    title: "Working",
    text: "Low-profile warmth you can wear at your desk, during study time, or between meetings.",
    image: "/Working.png",
  },
  {
    icon: "truck",
    title: "Driving",
    text: "Cordless comfort for commutes, errands, and long rides when cramps do not wait.",
    image: "/Driving.png",
  },
  {
    icon: "package",
    title: "Travelling",
    text: "Easy to pack and keep close in a bag, suitcase, or hotel room when your cycle starts.",
    image: "/Travelling.png",
  },
  {
    icon: "heart",
    title: "Exercising",
    text: "Wear gentle heat before or after light movement when your lower belly feels tight.",
    image: "/Excersice.png",
  },
  {
    icon: "moon",
    title: "Relaxing",
    text: "Settle into the couch, bed, or a quiet night with soothing heat and massage.",
    image: "/Relaxing.png",
  },
];

const PAIN_RELIEF = [
  {
    label: "Cramps",
    title: "Period Cramp Pain",
    text: "Fast soothing warmth helps ease period cramps within minutes.",
    image: "/Period Cramp Pain.png",
  },
  {
    label: "Back Pain",
    title: "Lower Back Relief",
    text: "Targeted heat helps loosen tight lower-back tension fast.",
    image: "/Back pain.png",
  },
  {
    label: "Stomach Pain",
    title: "Stomach Pain Relief",
    text: "Gentle 3-second heat helps calm belly aches and discomfort.",
    image: "/Stomach Pain.png",
  },
];

const REVIEWS = [
  {
    name: "Jessica M.",
    title: "A lifesaver on day one",
    body: "The heat comes on fast and the massage makes it easier to keep working instead of curling up in bed. I love that I can walk around with it.",
    rating: 5,
    color: "Blush Pink",
    date: "April 18, 2026",
    helpful: 214,
    image: "/product-hero.png",
  },
  {
    name: "Amanda R.",
    title: "Finally cordless comfort",
    body: "I bought this for cramps and now use it for back tension too. The strap is comfortable, it stays in place, and the battery lasted through my evening.",
    rating: 5,
    color: "Soft White",
    date: "April 12, 2026",
    helpful: 179,
    image: "/comfywon-white-variant.png",
  },
  {
    name: "Olivia T.",
    title: "Soft, warm, and easy",
    body: "The plush side feels really gentle. The controls are simple and the heat feels steady without being too bulky.",
    rating: 5,
    color: "Blush Pink",
    date: "April 8, 2026",
    helpful: 136,
    image: "/Listing Image 7.jpg",
  },
  {
    name: "Nina P.",
    title: "Easy to move around with",
    body: "Love the product, works exactly as described. It is a little smaller than I thought, but that is actually good because it is easy to move around with.",
    rating: 4,
    color: "Blush Pink",
    date: "March 31, 2026",
    helpful: 118,
    image: "/Listing Image 5.jpg",
  },
  {
    name: "Carmen L.",
    title: "Gifted one to my sister",
    body: "I got one for myself and ordered another for my sister after she tried it. It feels much more comfortable than the heating pads I used before.",
    rating: 5,
    color: "Soft White",
    date: "March 23, 2026",
    helpful: 94,
    image: "/Listing Image 9.jpg",
  },
  {
    name: "Brianna S.",
    title: "Worth it at the sale price",
    body: "The 5 heat settings make a real difference because I can start warmer and turn it down later. Shipping was quick too.",
    rating: 5,
    color: "Blush Pink",
    date: "March 16, 2026",
    helpful: 88,
    image: "/Listing Image 1.jpg",
  },
  {
    name: "Maya K.",
    title: "Perfect for cramps",
    body: "I use it on the first two days of my cycle and it helps me stay comfortable.",
    rating: 5,
    color: "Soft White",
    date: "March 10, 2026",
    helpful: 76,
    image: "/White Listing Image 2.jpg",
  },
  {
    name: "Sofia G.",
    title: "Great warmth",
    body: "It heats quickly and the strap stays put while I am walking around.",
    rating: 5,
    color: "Blush Pink",
    date: "March 5, 2026",
    helpful: 69,
    image: "/Listing Image 3.jpg",
  },
  {
    name: "Kayla D.",
    title: "Small but helpful",
    body: "The size makes it easy to wear under loose clothes and the heat feels focused.",
    rating: 4,
    color: "Soft White",
    date: "February 28, 2026",
    helpful: 61,
    image: "/White Listing Image 4.jpg",
  },
  {
    name: "Tiana B.",
    title: "My desk drawer essential",
    body: "I keep it at work now because it is much easier than using a plug-in pad.",
    rating: 5,
    color: "Blush Pink",
    date: "February 21, 2026",
    helpful: 57,
    image: "/Listing Image 5.jpg",
  },
  {
    name: "Rachel N.",
    title: "Comfortable strap",
    body: "The waistband stretches nicely and does not dig into my stomach.",
    rating: 5,
    color: "Soft White",
    date: "February 18, 2026",
    helpful: 52,
    image: "/White Listing Image 5.jpg",
  },
  {
    name: "Jada W.",
    title: "Really easy controls",
    body: "Power, heat, massage, done. I did not need to read much to use it.",
    rating: 5,
    color: "Blush Pink",
    date: "February 11, 2026",
    helpful: 48,
    image: "/Listing Image 2.jpg",
  },
  {
    name: "Emily C.",
    title: "Good for travel",
    body: "I packed it for a weekend trip and it was easy to charge and wear.",
    rating: 5,
    color: "Soft White",
    date: "February 4, 2026",
    helpful: 43,
    image: "/White Listing Image 8.jpg",
  },
  {
    name: "Ari L.",
    title: "Strong heat options",
    body: "I like that there are lower settings for resting and higher ones for rough cramps.",
    rating: 5,
    color: "Blush Pink",
    date: "January 29, 2026",
    helpful: 39,
    image: "/Listing Image 6.jpg",
  },
  {
    name: "Leah F.",
    title: "Nice for back tension",
    body: "I bought it for cramps but use it on my lower back after long shifts.",
    rating: 5,
    color: "Soft White",
    date: "January 22, 2026",
    helpful: 35,
    image: "/White Listing Image 6.jpg",
  },
  {
    name: "Vanessa R.",
    title: "Comfort without cords",
    body: "Being cordless is the whole reason I reach for this instead of my old pad.",
    rating: 5,
    color: "Blush Pink",
    date: "January 16, 2026",
    helpful: 31,
    image: "/Listing Image 4.jpg",
  },
  {
    name: "Priya S.",
    title: "A little snug at first",
    body: "It took a minute to adjust the strap, but once it was set it felt great.",
    rating: 4,
    color: "Soft White",
    date: "January 9, 2026",
    helpful: 27,
    image: "/White Listing Image 7.jpg",
  },
  {
    name: "Lauren H.",
    title: "Fast shipping",
    body: "It arrived quickly and was ready to use after charging.",
    rating: 5,
    color: "Blush Pink",
    date: "January 3, 2026",
    helpful: 24,
    image: "/Listing Image 1.jpg",
  },
  {
    name: "Monica P.",
    title: "Soft fabric",
    body: "The part that touches your skin is soft and comfortable for long wear.",
    rating: 5,
    color: "Soft White",
    date: "December 28, 2025",
    helpful: 22,
    image: "/White Listing Image 3.jpg",
  },
  {
    name: "Grace E.",
    title: "Helpful on busy days",
    body: "I can do chores and still get heat where I need it.",
    rating: 5,
    color: "Blush Pink",
    date: "December 20, 2025",
    helpful: 19,
    image: "/Listing Image 8.jpg",
  },
  {
    name: "Dani A.",
    title: "Exactly what I needed",
    body: "Simple, warm, and easy to wear around the house.",
    rating: 5,
    color: "Soft White",
    date: "December 13, 2025",
    helpful: 17,
    image: "/White Listing Image 1.jpg",
  },
  {
    name: "Kara V.",
    title: "Good heat coverage",
    body: "The warmth lands right where my cramps usually hit.",
    rating: 5,
    color: "Blush Pink",
    date: "December 7, 2025",
    helpful: 15,
    image: "/Period Cramp Pain.png",
  },
  {
    name: "Hannah J.",
    title: "Worth buying",
    body: "The massage mode is gentle and makes the heat feel even better.",
    rating: 5,
    color: "Soft White",
    date: "November 30, 2025",
    helpful: 12,
    image: "/White Listing Image 9.jpg",
  },
  {
    name: "Ivy M.",
    title: "Great little warmer",
    body: "It is lightweight and easy to carry from room to room.",
    rating: 5,
    color: "Blush Pink",
    date: "November 22, 2025",
    helpful: 11,
    image: "/Listing Image 9.jpg",
  },
  {
    name: "Noelle T.",
    title: "My period bag staple",
    body: "I keep it charged before my cycle and it has made rough mornings easier.",
    rating: 5,
    color: "Soft White",
    date: "November 15, 2025",
    helpful: 9,
    image: "/White Listing Image 2.jpg",
  },
  {
    name: "Selena Q.",
    title: "Very convenient",
    body: "No cord means I can make tea, sit down, and move around without unplugging.",
    rating: 5,
    color: "Blush Pink",
    date: "November 8, 2025",
    helpful: 8,
    image: "/Listing Image 7.jpg",
  },
];

const REVIEW_MEDIA = [
  { type: "image", src: "/Customer reviews 1.jpg", label: "Customer review" },
  { type: "image", src: "/Customer reviews 2.jpg", label: "Customer review" },
  { type: "video", src: CUSTOMER_VIDEO_SRC, label: "Customer video" },
  { type: "image", src: "/Customer reviews 3.jpg", label: "Customer review" },
  { type: "image", src: "/Customer reviews 4.jpg", label: "Customer review" },
  { type: "image", src: "/Customer reviews 5.jpg", label: "Customer review" },
  { type: "image", src: "/Customer reviews 6.jpeg", label: "Customer review" },
  { type: "image", src: "/Customer reviews 7.jpeg", label: "Customer review" },
];

const TRUST_BADGES = [
  { icon: "truck", text: "Free shipping" },
  { icon: "rotate", text: "30 day refund or replacement" },
  { icon: "clock", text: "2 day shipping" },
  { icon: "gift", text: "Huge sale" },
];

const PRODUCT_ABOUT_ITEMS = [
  {
    title: "Cordless, rechargeable comfort",
    text: "Designed for period cramps, lower abdominal tension, winter warmth, and everyday comfort without staying plugged into a wall.",
  },
  {
    title: "Wearable fit",
    text: "A slim, lightweight body and stretchy waistband keep targeted warmth close to the lower belly or back while you rest, work, or move around.",
  },
  {
    title: "5 heat levels plus vibration",
    text: "Choose from five heat levels up to about 140F and switch massage modes when you want extra relaxation.",
  },
  {
    title: "Soft flannel contact",
    text: "The skin-friendly flannel surface feels gentle against the body for comfortable wear during cramps or daily routines.",
  },
  {
    title: "Portable for home, work, or travel",
    text: "Compact enough for a bag, desk drawer, suitcase, or bedside table so warmth is close when your period starts.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What if my item arrives damaged or does not work?",
    answer: "Reach out with your order details and a photo or short description of the issue. Damaged or non-working arrivals can be replaced or refunded under the refund and replacement policy.",
  },
  {
    question: "How do I turn ComfyWon on?",
    answer: "Press and hold the power button for 3 seconds. Then press the heating button to increase heat or the massage button to switch vibration modes.",
  },
  {
    question: "How long does the battery last?",
    answer: "Battery life depends on the heat and massage settings, but it can run up to 3 hours on a charge.",
  },
  {
    question: "Can I wear it while walking around?",
    answer: "Yes. The cordless design and stretchy waistband are made for light movement at home, work, school, errands, or travel.",
  },
  {
    question: "Is shipping free?",
    answer: "Yes. The current sale includes free shipping and the site highlights 2 day shipping where available.",
  },
];

function getInitialRoute() {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#", "");
  return ["home", "product", "reviews"].includes(hash) ? hash : "home";
}

function getDealSecondsRemaining() {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setMinutes(0, 0, 0);
  nextReset.setHours(Math.floor(now.getHours() / 2) * 2 + 2);
  return Math.max(0, Math.floor((nextReset.getTime() - now.getTime()) / 1000));
}

function useCountdown() {
  const [remaining, setRemaining] = useState(getDealSecondsRemaining);

  useEffect(() => {
    const tick = () => setRemaining(getDealSecondsRemaining());

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function Reveal({ as = "div", children, className = "", delay = 0 }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0.96, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

function Stars({ size = 17, rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} star rating`}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Icon
          key={item}
          name="star"
          size={size}
          fill={item <= Math.floor(rating) ? "currentColor" : "none"}
          strokeWidth={item <= Math.floor(rating) ? 0 : 2}
        />
      ))}
    </div>
  );
}

function ReviewFaces({ size = "md" }) {
  const initials = ["J", "A", "O", "N"];
  const avatarClass = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-[12px]";

  return (
    <div className="flex -space-x-2" aria-hidden="true">
      {initials.map((initial) => (
        <span
          key={initial}
          className={`${avatarClass} flex items-center justify-center rounded-full border-2 border-white bg-[#bd003f] font-black text-white shadow-sm`}
        >
          {initial}
        </span>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, align = "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className="text-[12px] font-black uppercase tracking-[0.22em] text-rose-500 sm:text-[13px]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-serif text-[31px] font-black leading-[0.98] tracking-tight text-[#bd003f] sm:text-[44px] lg:text-[54px]">
        {title}
      </h2>
      {text && <p className="mt-3 text-[15px] leading-relaxed text-stone-700 sm:text-[18px]">{text}</p>}
    </div>
  );
}

function Header({ route, navigate, goToSection, cartCount, onCartClick }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "How it works", action: () => goToSection("how-it-works") },
    { label: "Benefits", action: () => goToSection("benefits") },
    { label: "Reviews", action: () => navigate("reviews") },
  ];

  const runNav = (action) => {
    setOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto grid h-[64px] w-full max-w-7xl grid-cols-[44px_1fr_auto] items-center px-4 sm:px-6 lg:flex lg:h-[74px] lg:justify-between lg:px-8">
        <button
          className="flex h-11 w-11 items-center justify-center justify-self-start rounded-full text-[#930033] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "x" : "menu"} size={28} />
        </button>

        <button
          className="justify-self-center font-serif text-[26px] font-black tracking-tight text-[#bd003f] sm:text-[28px] lg:justify-self-auto lg:text-[34px]"
          onClick={() => navigate("home")}
        >
          ComfyWon
        </button>

        <nav className="hidden items-center gap-8 text-[15px] font-bold text-stone-700 lg:flex">
          {navItems.map((item) => (
            <button key={item.label} className="hover:text-rose-600" onClick={item.action}>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="relative flex h-11 w-11 items-center justify-center justify-self-end rounded-full bg-gradient-to-r from-[#e65478] to-[#c40042] text-white shadow-lg shadow-rose-300/50 sm:h-12 sm:w-auto sm:gap-2 sm:px-5 sm:text-[15px]"
          onClick={onCartClick}
          aria-label={cartCount > 0 ? `Open cart with ${cartCount} items` : "Open empty cart"}
        >
          <Icon name="cart" size={19} />
          <span className="hidden font-black sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#ffb703] px-1 text-[11px] font-black text-[#7a0030]">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-rose-100 bg-white px-4 py-3 shadow-xl lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="rounded-full bg-rose-50 px-4 py-3 text-left text-[15px] font-black text-[#930033]"
                onClick={() => runNav(item.action)}
              >
                {item.label}
              </button>
            ))}
            <button
              className="rounded-full bg-[#bd003f] px-4 py-3 text-left text-[15px] font-black text-white"
              onClick={() => runNav(() => navigate("product"))}
            >
              Shop ComfyWon - {PRODUCT_PRICE_LABEL}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ navigate, goToSection }) {
  const countdown = useCountdown();

  return (
    <section className="relative overflow-hidden px-4 pb-0 pt-3 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative min-h-[510px] sm:min-h-[610px] lg:min-h-[700px]">
          <div className="absolute right-[-10%] top-4 z-10 flex w-[78%] items-center justify-end sm:right-[-4%] sm:w-[64%] lg:right-0 lg:top-0 lg:w-[55%]">
            <img
              src="/product-hero.png"
              alt="ComfyWon wearable heating belt in use"
              className="h-full max-h-[540px] w-full object-contain object-right lg:max-h-[720px]"
            />
          </div>

          <div className="absolute inset-y-0 left-0 z-20 w-[86%] bg-[linear-gradient(90deg,rgba(255,247,244,0.99)_0%,rgba(255,247,244,0.94)_49%,rgba(255,247,244,0.58)_77%,rgba(255,247,244,0)_100%)] sm:w-[74%] lg:w-[58%]" />
          <div className="absolute inset-x-0 bottom-0 z-20 h-[170px] bg-[linear-gradient(180deg,rgba(255,247,244,0)_0%,rgba(255,247,244,0.82)_58%,rgba(255,247,244,0.98)_100%)] lg:hidden" />
          <div className="petal-field pointer-events-none absolute inset-0 z-20 opacity-70" />

          <div className="relative z-30 flex min-h-[510px] flex-col justify-start px-1 pb-4 pt-6 sm:pt-8 lg:min-h-[700px] lg:w-[56%] lg:justify-center lg:pb-10">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/75 px-4 py-2 text-[13px] font-extrabold text-rose-500 shadow-sm backdrop-blur">
              <Icon name="flame" size={16} />
              Cordless Period Heating Pad
            </div>

            <h1 className="max-w-[335px] font-serif text-[38px] font-black leading-[0.94] tracking-tight text-[#bd003f] sm:max-w-[475px] sm:text-[57px] lg:max-w-[640px] lg:text-[82px]">
              Warm Relief,
              <br />
              Wherever You
              <br />
              Need It
            </h1>

            <p className="mt-3 max-w-[310px] text-[14px] leading-[1.5] text-stone-700 sm:max-w-[405px] sm:text-[17px] lg:max-w-[505px] lg:text-[20px]">
              Soothing heat and gentle vibration for period cramps and lower abdominal comfort.
              Cordless freedom. All-day comfort.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-black text-stone-700 sm:text-[13px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
                <Icon name="truck" size={15} className="text-[#bd003f]" />
                Free shipping
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
                <Icon name="clock" size={15} className="text-[#bd003f]" />
                2 day shipping
              </span>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <ReviewFaces />
                <Stars size={20} />
                <span className="text-[17px] font-black text-stone-900">
                  {REVIEW_RATING}/5 | {REVIEW_TOTAL.toLocaleString()} reviews
                </span>
              </div>
              <button
                className="mt-2 rounded-full bg-white/75 px-3 py-1.5 text-[13px] font-black text-[#bd003f] underline-offset-4 shadow-sm hover:underline"
                onClick={() => navigate("reviews")}
              >
                See more reviews
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-bold text-stone-700 sm:text-[14px]">
              <span className="rounded-full bg-[#fce7b1] px-3 py-1 text-[#7a4b00]">50% off</span>
              <span>
                <span className="text-stone-400 line-through">{RETAIL_PRICE_LABEL}</span>{" "}
                <span className="text-[#bd003f]">{PRODUCT_PRICE_LABEL}</span>
              </span>
              <span className="rounded-full bg-white/75 px-3 py-1 text-[#bd003f]">
                Ends in {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </span>
            </div>

            <button
              className="mt-4 flex h-[56px] w-full max-w-[520px] items-center justify-center gap-4 rounded-full bg-gradient-to-r from-[#e65478] to-[#c40042] text-[19px] font-black text-white shadow-[0_16px_32px_rgba(190,52,89,0.32)] active:scale-[0.99] sm:h-[62px] sm:text-[22px]"
              onClick={() => navigate("product")}
            >
              Buy Now - {PRODUCT_PRICE_LABEL}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70">
                <Icon name="arrow" size={23} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <Reveal className="flex min-h-[172px] flex-col items-center justify-center rounded-[24px] border border-rose-100 bg-white/80 p-5 text-center shadow-[0_18px_45px_rgba(218,91,121,0.12)] backdrop-blur">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ef9aac] to-[#bd003f] text-white shadow-lg shadow-rose-200/70">
        <Icon name={icon} size={25} />
      </div>
      <h3 className="text-[16px] font-extrabold leading-tight text-stone-900">{title}</h3>
      <p className="mt-2 max-w-[170px] text-[13px] leading-snug text-stone-600">{text}</p>
    </Reveal>
  );
}

function FeaturesStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 rounded-[30px] border border-white/80 bg-white/60 p-3 shadow-[0_22px_60px_rgba(205,88,117,0.16)] backdrop-blur lg:grid-cols-4 lg:gap-4 lg:p-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const customerVideoRef = React.useRef(null);
  const [customerVideoStarted, setCustomerVideoStarted] = useState(false);

  const playCustomerVideo = () => {
    setCustomerVideoStarted(true);
    customerVideoRef.current?.play?.();
  };

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#9b0035,#e65478)] p-5 text-white shadow-[0_26px_70px_rgba(168,23,73,0.26)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.18em] text-white/80">How it works</p>
            <h2 className="mt-2 font-serif text-[34px] font-black leading-[0.98] tracking-tight sm:text-[50px]">
              Heat and massage where cramps hit.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] font-semibold leading-relaxed text-white/88 sm:text-[18px]">
              Targeted warmth helps relax the lower belly while gentle vibration adds another layer of comfort when cramps start to interrupt your day.
            </p>
          </div>

          <div className="rounded-[26px] bg-white/12 p-3 backdrop-blur">
            <p className="px-2 pb-3 text-[14px] font-black text-white">
              See the product from a customer perspective
            </p>
            <div className="relative aspect-video overflow-hidden rounded-[22px] bg-stone-950">
              <video
                ref={customerVideoRef}
                src={CUSTOMER_VIDEO_SRC}
                poster={CUSTOMER_VIDEO_THUMBNAIL}
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
                onPlay={() => setCustomerVideoStarted(true)}
              />
              {!customerVideoStarted && (
                <button
                  className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#bd003f] shadow-xl"
                  onClick={playCustomerVideo}
                  aria-label="Play customer video"
                >
                  <Icon name="play" size={19} fill="currentColor" strokeWidth={0} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {HOW_STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              className="rounded-[22px] bg-white/13 p-4 backdrop-blur"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[12px] font-black text-[#bd003f] shadow-sm">
                {step.number}
              </span>
              <h3 className="mt-3 text-[18px] font-black text-white">{step.title}</h3>
              <p className="mt-2 text-[14px] font-semibold leading-snug text-white/82">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LifestyleCard({ icon, title, text, image }) {
  return (
    <Reveal as="article" className="min-w-[76%] snap-start overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_20px_55px_rgba(210,98,120,0.14)] sm:min-w-[330px] lg:min-w-0">
      <div className="h-48 overflow-hidden bg-rose-50 lg:h-56">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-rose-50 text-[#bd003f]">
          <Icon name={icon} size={24} />
        </div>
        <div>
          <h3 className="text-[18px] font-extrabold text-[#bd003f]">{title}</h3>
          <p className="mt-1 text-[14px] leading-snug text-stone-600">{text}</p>
        </div>
      </div>
    </Reveal>
  );
}

function ComfortSection() {
  return (
    <section id="benefits" className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Comfort that moves with you"
        title="Carry on your day pain free."
        text="Wear it when your day will not pause for cramps, tension, or that heavy lower-belly ache."
      />

      <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {LIFESTYLE_CARDS.map((card) => (
          <LifestyleCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

function PainCard({ label, title, text, image }) {
  return (
    <Reveal as="article" className="min-w-[76%] snap-start overflow-hidden rounded-[24px] border border-rose-100 bg-white shadow-[0_18px_42px_rgba(178,75,98,0.13)] sm:min-w-[310px] lg:min-w-0">
      <div className="relative h-52 overflow-hidden bg-rose-50 sm:h-56 lg:h-60">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-[18px] font-black text-[#bd003f]">{title}</h3>
        <p className="mt-2 text-[14px] leading-snug text-stone-600">{text}</p>
      </div>
    </Reveal>
  );
}

function PainReliefSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Targeted warmth"
        title={
          <>
            <span className="pulse-3s inline-block text-[#bd003f]">
              3s Heating
            </span>{" "}
            <span className="block sm:inline">Rapid Pain Relief</span>{" "}
            {/* <span className="block sm:inline">kind of rough day.</span> */}
          </>
        }
        text="Choose the spot that needs comfort most, then let fast heat and gentle vibration help you get through cramps, belly aches, or lower-back tension."
      />
      <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
        {PAIN_RELIEF.map((card) => (
          <PainCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

function ComfortFabricSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 overflow-hidden rounded-[30px] border border-rose-100 bg-[linear-gradient(135deg,#fff7f4,#fffdf9_45%,#ffe6ec)] p-4 shadow-[0_22px_60px_rgba(178,75,98,0.13)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-8">
        <div className="overflow-hidden rounded-[24px] bg-white">
          <img src="/Listing Image 7.jpg" alt="Soft plush ComfyWon fabric" className="h-full min-h-[280px] w-full object-cover" />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Soft flannel comfort"
            title="Warmth without the scratchy pad feeling."
            text="The plush curved panel hugs your body so the heat stays close, even when you are sitting, stretching, or moving around."
          />
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["heart", "Soft touch"],
              ["waves", "Gentle massage"],
              ["check", "Curved fit"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-[20px] bg-white/80 p-3 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e65478] text-white">
                  <Icon name={icon} size={21} />
                </div>
                <p className="mt-2 text-[12px] font-black text-[#bd003f] sm:text-[14px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BatterySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 overflow-hidden rounded-[30px] border border-[#d7eadb] bg-[linear-gradient(135deg,#fffaf7,#f5fff8)] p-4 shadow-[0_20px_55px_rgba(48,111,83,0.10)] lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Power that lasts"
            title="Up to 3hrs battery."
            text="Recharge with the included USB-C to USB-A cable, then take your heat with you. No outlet hunting, no cord across the couch, no bulky plug pack."
          />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["battery", "Up to 3hrs"],
              ["clock", "Quick recharge"],
              ["truck", "Portable"],
              ["power", "Cordless use"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-[20px] bg-white p-4 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf7ef] text-[#2d7b59]">
                  <Icon name={icon} size={22} />
                </div>
                <p className="mt-2 text-[13px] font-black text-stone-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[24px]">
          <img src="/Listing Image 4.jpg" alt="ComfyWon 2000mAh battery" className="h-full min-h-[270px] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    ["5 heat levels", "3 levels or less"],
    ["5 gentle massage modes", "Limited vibration"],
    ["Soft flannel cushion", "Rough plastic pad"],
    ["Cordless and wearable", "Corded or bulky"],
    ["Up to 3hrs battery", "Short corded sessions"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 rounded-[30px] border border-rose-100 bg-white/80 p-4 shadow-[0_20px_55px_rgba(178,75,98,0.12)] lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:p-8">
        <div className="overflow-hidden rounded-[24px] bg-rose-50">
          <img src="/Listing Image 6.jpg" alt="Why choose ComfyWon" className="h-full min-h-[315px] w-full object-cover" />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Why choose ComfyWon"
            title="Small comfort upgrades add up."
            text="You get targeted heat, gentle vibration, and cordless comfort in one soft wearable pad, so you can keep moving instead of waiting beside an outlet."
          />
          <div className="mt-5 overflow-hidden rounded-[24px] border border-rose-100">
            <div className="grid grid-cols-2 bg-[#bd003f] text-center text-[15px] font-black text-white">
              <div className="p-3">ComfyWon</div>
              <div className="border-l border-white/30 p-3">Others</div>
            </div>
            {rows.map(([ours, theirs]) => (
              <div key={ours} className="grid grid-cols-2 border-t border-rose-100 bg-white text-[14px] sm:text-[16px]">
                <div className="flex items-center gap-2 p-3 font-black text-stone-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e65478] text-white">
                    <Icon name="check" size={17} />
                  </span>
                  {ours}
                </div>
                <div className="flex items-center gap-2 border-l border-rose-100 p-3 text-stone-500">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                    <Icon name="x" size={16} />
                  </span>
                  {theirs}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewMiniCard({ review }) {
  return (
    <article className="min-w-[82%] snap-start rounded-[24px] border border-rose-100 bg-white p-4 shadow-[0_16px_40px_rgba(178,75,98,0.11)] sm:min-w-[340px] lg:min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe4ea] text-[14px] font-black text-[#bd003f]">
          {review.name.charAt(0)}
        </div>
        <div>
          <Stars size={16} rating={review.rating || 5} />
          <p className="mt-1 text-[13px] font-black text-stone-800">{review.name}</p>
        </div>
      </div>
      <h3 className="mt-3 text-[16px] font-black text-stone-900">{review.title}</h3>
      <p className="mt-2 text-[14px] leading-snug text-stone-600">"{review.body}"</p>
    </article>
  );
}

function ReviewsPreview({ navigate }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading align="left" eyebrow="Customer proof" title="Loved by thousands of women." />
        <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-3 text-[13px] font-black text-stone-700 shadow-sm">
          <ReviewFaces size="sm" />
          <span>{REVIEW_TOTAL.toLocaleString()} reviews | {REVIEW_RATING}/5</span>
        </div>
        <button
          className="w-fit rounded-full border border-[#bd003f] bg-white px-5 py-3 text-[14px] font-black text-[#bd003f] shadow-sm"
          onClick={() => navigate("reviews")}
        >
          See more reviews
        </button>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {REVIEWS.slice(0, 4).map((review) => (
          <ReviewMiniCard key={review.name} review={review} />
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-[30px] border border-rose-100 bg-white/85 p-4 shadow-[0_18px_45px_rgba(178,75,98,0.10)] lg:grid-cols-[0.75fr_1.25fr] lg:p-7">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Quick answers before you order."
          text="Everything most customers want to know about shipping, use, battery life, and damaged arrivals."
        />
        <div className="grid gap-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="overflow-hidden rounded-[22px] border border-rose-100 bg-[#fff7f4]">
                <button
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-black leading-snug text-stone-950">{item.question}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm">
                    <Icon name={isOpen ? "x" : "plus"} size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <p className="border-t border-rose-100 bg-white px-4 py-4 text-[14px] leading-relaxed text-stone-600">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OfferBox({ navigate }) {
  const countdown = useCountdown();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#9b0035,#e65478)] p-5 text-white shadow-[0_26px_70px_rgba(168,23,73,0.28)] lg:p-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-white/85">
            50% off - offer ends in {countdown.hours} hours {countdown.minutes} mins
          </p>
          <h2 className="mx-auto mt-3 max-w-[720px] font-serif text-[35px] font-black leading-[0.98] tracking-tight sm:text-[50px] lg:text-[64px]">
            Feel better before the cramps take over.
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[15px] font-semibold leading-relaxed text-white/90 sm:text-[18px]">
            Limited launch offer: cordless period heating pad, charging cable,
            2 day shipping, and free shipping included.
          </p>

          <div className="mx-auto mt-6 grid max-w-[560px] grid-cols-3 gap-3 text-center">
            {[
              [countdown.hours, "Hours"],
              [countdown.minutes, "Minutes"],
              [countdown.seconds, "Seconds"],
            ].map(([number, label]) => (
              <div key={label} className="rounded-[20px] bg-white/12 p-3 backdrop-blur">
                <p className="text-[27px] font-black sm:text-[35px]">{number}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80">{label}</p>
              </div>
            ))}
          </div>

          <button
            className="mx-auto mt-6 flex h-[58px] w-full max-w-[560px] items-center justify-center gap-3 rounded-[18px] bg-white text-[18px] font-black text-[#bd003f] shadow-xl sm:text-[20px]"
            onClick={() => navigate("product")}
          >
            Get Mine Now - {PRODUCT_PRICE_LABEL}
            <Icon name="arrow" size={22} />
          </button>

          <div className="mx-auto mt-4 grid max-w-[560px] grid-cols-3 gap-2 text-[11px] font-black sm:text-[13px]">
            {["Free shipping", "2 day shipping", "Huge sale"].map((item) => (
              <span key={item} className="flex items-center justify-center gap-1">
                <Icon name="check" size={15} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-9 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 rounded-[26px] bg-white/80 p-3 text-[12px] font-black text-stone-700 shadow-sm sm:grid-cols-4 sm:text-[13px]">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.text} className="flex items-center justify-center gap-2 rounded-[18px] bg-[#fff7f4] px-3 py-3">
            <Icon name={badge.icon} size={18} className="text-[#bd003f]" />
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({ navigate, goToSection }) {
  return (
    <>
      <Hero navigate={navigate} goToSection={goToSection} />
      <FeaturesStrip />
      <PainReliefSection />
      <HowItWorks />
      <ComfortSection />
      <ComfortFabricSection />
      <BatterySection />
      <ComparisonSection />
      <ReviewsPreview navigate={navigate} />
      <FAQSection />
      <OfferBox navigate={navigate} />
      <TrustBar />
      <MobileStickyBar navigate={navigate} />
    </>
  );
}

function MobileStickyBar({ navigate }) {
  const countdown = useCountdown();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-white/35 px-4 py-3 shadow-[0_-18px_44px_rgba(120,42,64,0.18)] backdrop-blur-xl lg:hidden">
      <button
        className="mx-auto flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e65478] to-[#bd003f] text-[14px] font-black text-white shadow-[0_16px_34px_rgba(189,0,63,0.32)]"
        onClick={() => navigate("product")}
      >
        <span>50% off</span>
        <span className="text-[12px] text-white/80">{countdown.hours}:{countdown.minutes}:{countdown.seconds}</span>
        <span>
          <span className="text-white/55 line-through">{RETAIL_PRICE_LABEL}</span> {PRODUCT_PRICE_LABEL}
        </span>
        <span className="flex items-center gap-1">
          Buy <Icon name="arrow" size={17} />
        </span>
      </button>
    </div>
  );
}

function ProductGallery({ selectedColor }) {
  const selectedGallery = selectedColor === "white" ? WHITE_LISTING_IMAGES : LISTING_IMAGES;
  const colorAsset = PRODUCT_COLORS.find((item) => item.id === selectedColor)?.image || selectedGallery[0];
  const gallery = useMemo(() => {
    const rest = selectedGallery.filter((image) => image !== colorAsset);
    const imageItems = [colorAsset, ...rest.slice(0, 8)].map((src) => ({
      type: "image",
      src,
      label: "ComfyWon product view",
    }));
    return [
      ...imageItems.slice(0, 3),
      { type: "video", src: CUSTOMER_VIDEO_SRC, label: "Customer video" },
      ...imageItems.slice(3),
    ];
  }, [colorAsset, selectedGallery]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = gallery[activeIndex] || gallery[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [gallery]);

  const goToImage = (direction) => {
    setActiveIndex((current) => (current + direction + gallery.length) % gallery.length);
  };
  const touchStartX = React.useRef(0);
  const didSwipe = React.useRef(false);
  const lightboxTouchStartX = React.useRef(0);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX || 0;
    didSwipe.current = false;
  };

  const handleTouchEnd = (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) < 45) return;
    didSwipe.current = true;
    goToImage(delta > 0 ? -1 : 1);
  };

  const handleMainClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setLightboxOpen(true);
  };

  const handleLightboxTouchStart = (event) => {
    lightboxTouchStartX.current = event.touches[0]?.clientX || 0;
  };

  const handleLightboxTouchEnd = (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const delta = endX - lightboxTouchStartX.current;
    if (Math.abs(delta) < 45) return;
    goToImage(delta > 0 ? -1 : 1);
  };

  return (
    <div className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
      <button
        className="block w-full overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_18px_45px_rgba(178,75,98,0.12)]"
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={active?.type === "video" ? "Expand customer video" : "Expand product image"}
      >
        {active?.type === "video" ? (
          <div className="relative bg-stone-950">
            <video
              src={active.src}
              poster={CUSTOMER_VIDEO_THUMBNAIL}
              className="aspect-[4/3] w-full object-contain p-2 sm:aspect-square"
              muted
              playsInline
              preload="metadata"
            />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#bd003f] shadow-xl">
              <Icon name="play" size={22} fill="currentColor" strokeWidth={0} />
            </span>
          </div>
        ) : (
          <img src={active?.src} alt="ComfyWon product view" className="aspect-[4/3] w-full object-contain p-2 sm:aspect-square" />
        )}
      </button>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
        {gallery.map((item, index) => (
          <button
            key={`${item.type}-${item.src}`}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border-2 bg-white ${
              activeIndex === index ? "border-[#bd003f]" : "border-rose-100"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={item.type === "video" ? "View customer video" : "View product image"}
          >
            {item.type === "video" ? (
              <div className="relative h-full w-full bg-stone-950">
                <video
                  src={item.src}
                  poster={CUSTOMER_VIDEO_THUMBNAIL}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/18 text-white">
                  <Icon name="play" size={19} fill="currentColor" strokeWidth={0} />
                </span>
              </div>
            ) : (
              <img src={item.src} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {gallery.map((item, index) => (
          <button
            key={`gallery-dot-${item.type}-${item.src}`}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-7 bg-[#bd003f]" : "w-2.5 bg-rose-200"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to product media ${index + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#2b0614]/85 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="relative flex h-full w-full max-w-6xl items-center justify-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleLightboxTouchStart}
              onTouchEnd={handleLightboxTouchEnd}
            >
              <button
                className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-lg"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close expanded product image"
              >
                <Icon name="x" size={22} />
              </button>
              {active?.type === "video" ? (
                <video
                  src={active.src}
                  poster={CUSTOMER_VIDEO_THUMBNAIL}
                  className="max-h-[88vh] w-full max-w-[92vw] rounded-[22px] bg-black object-contain shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={active?.src}
                  alt="Expanded ComfyWon product view"
                  className="max-h-[88vh] w-full max-w-[92vw] rounded-[22px] bg-white object-contain p-2 shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                />
              )}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/88 px-3 py-2 shadow-lg backdrop-blur">
                {gallery.map((item, index) => (
                  <button
                    key={`lightbox-dot-${item.type}-${item.src}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === index ? "w-7 bg-[#bd003f]" : "w-2.5 bg-rose-200"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to expanded media ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BuyBox({ selectedColor, setSelectedColor, onAddToCart, onSeeReviews }) {
  const [quantity, setQuantity] = useState(1);
  const selected = PRODUCT_COLORS.find((item) => item.id === selectedColor);
  const countdown = useCountdown();

  return (
    <aside className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-rose-100 bg-white p-4 shadow-[0_20px_60px_rgba(145,50,78,0.15)] lg:sticky lg:top-24 lg:max-w-none lg:p-5">
      <div className="rounded-[22px] bg-[#fff7f4] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#fce7b1] px-3 py-1 text-[12px] font-black text-[#7a4b00]">50% OFF</span>
          <span className="text-[13px] font-black text-[#2d7b59]">In stock</span>
        </div>
        <h1 className="mt-3 text-[27px] font-black leading-tight text-stone-950 sm:text-[34px]">
          ComfyWon Cordless Period Heating Pad
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Stars size={17} />
          <span className="text-[14px] font-black text-stone-800">{REVIEW_RATING}</span>
          <span className="text-[13px] text-stone-500">{REVIEW_TOTAL.toLocaleString()} reviews</span>
          <button
            className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[12px] font-black text-[#bd003f] shadow-sm"
            onClick={onSeeReviews}
          >
            See reviews
          </button>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-[42px] font-black leading-none text-[#bd003f]">{PRODUCT_PRICE_LABEL}</span>
          <span className="pb-1 text-[20px] font-bold text-stone-400 line-through">{RETAIL_PRICE_LABEL}</span>
          <span className="pb-1 text-[13px] font-black text-[#2d7b59]">
            You save {formatPriceFromCents(RETAIL_PRICE_CENTS - PRODUCT_PRICE_CENTS)}
          </span>
        </div>
        <p className="mt-3 rounded-full bg-white px-3 py-2 text-center text-[13px] font-black text-[#bd003f]">
          Offer ends in {countdown.hours}:{countdown.minutes}:{countdown.seconds}
        </p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-black text-stone-900">Color</p>
          <p className="text-[13px] font-bold text-stone-500">{selected?.label}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {PRODUCT_COLORS.map((color) => (
            <button
              key={color.id}
              className={`flex items-center gap-3 rounded-[20px] border p-3 text-left ${
                selectedColor === color.id ? "border-[#bd003f] bg-rose-50" : "border-rose-100 bg-white"
              }`}
              onClick={() => setSelectedColor(color.id)}
            >
              <span
                className="h-8 w-8 rounded-full border border-rose-100 shadow-inner"
                style={{ background: color.swatch }}
              />
              <span className="text-[13px] font-black text-stone-800">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[14px] font-black text-stone-900">Quantity</p>
        <div className="mt-2 flex w-fit items-center rounded-full border border-rose-100 bg-white p-1">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 font-black text-[#bd003f]"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            -
          </button>
          <span className="w-12 text-center text-[16px] font-black">{quantity}</span>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 font-black text-[#bd003f]"
            onClick={() => setQuantity((value) => Math.min(5, value + 1))}
          >
            +
          </button>
        </div>
      </div>

      <button
        className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-[18px] bg-[#bd003f] py-3 text-[18px] font-black text-white shadow-[0_16px_35px_rgba(182,63,98,0.30)]"
        onClick={() => onAddToCart({ quantity, color: selected })}
      >
        Add to Cart
        <Icon name="cart" size={20} />
      </button>

      <div className="mt-5 grid gap-2 text-[13px] font-bold text-stone-700">
        {[
          "15 day refund or replacement guarantee",
          "2 day shipping",
          "Free shipping",
          "Big sale today",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf7ef] text-[#2d7b59]">
              <Icon name="check" size={15} />
            </span>
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProductAboutSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mt-10 rounded-[30px] border border-rose-100 bg-white/85 p-4 shadow-[0_18px_45px_rgba(178,75,98,0.10)] lg:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Product details</p>
          <h2 className="mt-1 text-[28px] font-black text-[#bd003f]">About this item</h2>
        </div>
        <p className="max-w-xl text-[14px] font-semibold leading-relaxed text-stone-600">
          Tap each detail to see what makes ComfyWon useful for period cramps, lower abdominal comfort, and everyday warmth.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {PRODUCT_ABOUT_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.title} className="overflow-hidden rounded-[22px] border border-rose-100 bg-[#fff7f4]">
              <button
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span className="text-[16px] font-black text-stone-950">{item.title}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm">
                  <Icon name={isOpen ? "x" : "plus"} size={18} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <p className="border-t border-rose-100 bg-white px-4 py-4 text-[14px] leading-relaxed text-stone-600">
                      {item.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CartConfirmationModal({
  isOpen,
  cart = [],
  cartCount,
  lastAdded,
  view,
  onClose,
  onCheckout,
  onShop,
  onUpdateLineQuantity,
  onRemoveLine,
  checkoutLoading = false,
  checkoutError = "",
}) {
  const isEmpty = cartCount === 0 || view === "empty";
  const isAdded = !isEmpty && view === "added";
  const showLines = !isEmpty && view === "cart" && cart.length > 0;
  const itemWord = cartCount === 1 ? "item" : "items";
  const subtotal = cartCount * PRODUCT_PRICE_CENTS;
  const eyebrow = isEmpty ? "Cart" : isAdded ? "Added to cart" : "Your cart";
  const title = isEmpty ? "Your cart is empty." : isAdded ? "Your ComfyWon is in the cart." : "Your cart is ready.";
  const checkoutLabel = checkoutLoading
    ? "Redirecting to checkout..."
    : isEmpty
    ? "Shop ComfyWon"
    : "Go to Checkout";
  const primaryDisabled = !isEmpty && checkoutLoading;
  const handlePrimary = () => {
    if (primaryDisabled) return;
    if (isEmpty) onShop();
    else onCheckout();
  };
  const handleClose = () => {
    if (checkoutLoading) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-[#3b0718]/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-dialog-title"
            className="w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-[0_28px_90px_rgba(70,8,29,0.28)]"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-[linear-gradient(135deg,#fff1f5,#fff9f6)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bd003f] text-white shadow-lg shadow-rose-300/50">
                    <Icon name={isAdded ? "check" : "cart"} size={24} />
                  </span>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-rose-500">
                      {eyebrow}
                    </p>
                    <h2 id="cart-dialog-title" className="text-[24px] font-black leading-tight text-[#bd003f]">
                      {title}
                    </h2>
                  </div>
                </div>
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm disabled:opacity-50"
                  onClick={handleClose}
                  disabled={checkoutLoading}
                  aria-label="Close cart popup"
                >
                  <Icon name="x" size={21} />
                </button>
              </div>

              <div className="mt-5 rounded-[22px] border border-rose-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-black text-stone-900">ComfyWon Cordless Period Heating Pad</p>
                    <p className="mt-1 text-[13px] font-bold text-stone-500">
                      {isEmpty
                        ? "No items yet. Pick a color to start your cart."
                        : isAdded && lastAdded
                        ? `${lastAdded.quantity} ${lastAdded.colorLabel} added`
                        : `${cartCount} ${itemWord} in your cart`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-black text-rose-500">50% off</p>
                    <p className="text-[21px] font-black text-stone-950">{formatPriceFromCents(subtotal)}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-stone-600">
                  {["Free shipping", "2 day shipping", "Refund/replace"].map((item) => (
                    <span key={item} className="rounded-full bg-rose-50 px-2 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {showLines && (
                <ul className="mt-4 space-y-2">
                  {cart.map((line) => (
                    <li
                      key={line.variantId}
                      className="flex items-center justify-between gap-3 rounded-[18px] border border-rose-100 bg-white p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-black text-stone-900">{line.colorLabel}</p>
                        <p className="text-[12px] font-bold text-stone-500">
                          {formatPriceFromCents(line.quantity * PRODUCT_PRICE_CENTS)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-rose-100 bg-white p-0.5">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 font-black text-[#bd003f] disabled:opacity-50"
                            onClick={() => onUpdateLineQuantity(line.variantId, line.quantity - 1)}
                            disabled={checkoutLoading}
                            aria-label={`Decrease ${line.colorLabel}`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[14px] font-black">{line.quantity}</span>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 font-black text-[#bd003f] disabled:opacity-50"
                            onClick={() => onUpdateLineQuantity(line.variantId, line.quantity + 1)}
                            disabled={checkoutLoading || line.quantity >= 5}
                            aria-label={`Increase ${line.colorLabel}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm hover:text-[#bd003f] disabled:opacity-50"
                          onClick={() => onRemoveLine(line.variantId)}
                          disabled={checkoutLoading}
                          aria-label={`Remove ${line.colorLabel}`}
                        >
                          <Icon name="x" size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!isEmpty && (
                <p className="mt-4 rounded-[18px] bg-white p-3 text-[13px] font-bold leading-snug text-stone-600">
                  Your sale price, free shipping, and refund or replacement option are saved in the cart.
                </p>
              )}
            </div>

            <div className="p-5">
              {checkoutError && !checkoutLoading && (
                <p
                  role="alert"
                  className="mb-3 rounded-[14px] border border-rose-200 bg-rose-50 p-3 text-[13px] font-bold text-[#bd003f]"
                >
                  {checkoutError}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="h-[52px] rounded-[18px] border-2 border-[#bd003f] bg-white px-4 py-3 text-[15px] font-black text-[#bd003f] disabled:opacity-50"
                  onClick={handleClose}
                  disabled={checkoutLoading}
                >
                  Continue Shopping
                </button>
                <button
                  className="h-[52px] rounded-[18px] bg-[#bd003f] px-4 py-3 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(182,63,98,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handlePrimary}
                  disabled={primaryDisabled}
                  aria-busy={checkoutLoading}
                >
                  {checkoutLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductPage({ navigate, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState("pink");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <button className="mb-5 text-[14px] font-black text-[#bd003f]" onClick={() => navigate("home")}>
        Back to home
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ProductGallery selectedColor={selectedColor} />
        <BuyBox
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          onAddToCart={onAddToCart}
          onSeeReviews={() => document.getElementById("product-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      </div>

      <ProductAboutSection />

      <section className="mt-10 grid gap-4 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-[24px] bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#bd003f]">
              <Icon name={feature.icon} size={23} />
            </div>
            <h2 className="mt-3 text-[18px] font-black text-stone-900">{feature.title}</h2>
            <p className="mt-1 text-[14px] leading-snug text-stone-600">{feature.text}</p>
          </div>
        ))}
      </section>

      <section id="product-reviews" className="mt-10 rounded-[30px] border border-rose-100 bg-white p-4 shadow-sm lg:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Real reviews</p>
            <h2 className="mt-1 text-[28px] font-black text-[#bd003f]">
              {REVIEW_RATING} out of 5 | {REVIEW_TOTAL.toLocaleString()} ComfyWon reviews
            </h2>
          </div>
          <button className="w-fit rounded-full bg-[#bd003f] px-5 py-3 text-[14px] font-black text-white" onClick={() => navigate("reviews")}>
            Read reviews
          </button>
        </div>
        <div className="no-scrollbar -mx-4 mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {REVIEWS.slice(0, 3).map((review) => (
            <ReviewMiniCard key={review.name} review={review} />
          ))}
        </div>
      </section>
    </main>
  );
}

function RatingBars() {
  const rows = [
    ["5 star", "97%", "97%"],
    ["4 star", "3%", "3%"],
    ["3 star", "0%", "0%"],
    ["2 star", "0%", "0%"],
    ["1 star", "0%", "0%"],
  ];

  return (
    <div className="grid gap-2">
      {rows.map(([label, width, value]) => (
        <div key={label} className="grid grid-cols-[56px_1fr_40px] items-center gap-3 text-[13px]">
          <span className="font-bold text-stone-700">{label}</span>
          <div className="h-3 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-[#f6b23e]" style={{ width }} />
          </div>
          <span className="text-right font-bold text-stone-500">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewMediaCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="relative min-w-[150px] snap-start overflow-hidden rounded-[18px] bg-white shadow-sm sm:min-w-[190px] lg:min-w-0"
        onClick={() => setOpen(true)}
        aria-label={`Expand ${item.label}`}
      >
        {item.type === "video" ? (
          <video
            src={item.src}
            className="aspect-square w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={item.src} alt={item.label} className="aspect-square w-full object-cover" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-left text-[12px] font-black text-white">
          {item.label}
        </div>
        {item.type === "video" && (
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#bd003f] shadow-lg">
            <Icon name="play" size={19} fill="currentColor" strokeWidth={0} />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#2b0614]/85 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative flex h-full w-full max-w-5xl items-center justify-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-lg"
                onClick={() => setOpen(false)}
                aria-label="Close expanded review media"
              >
                <Icon name="x" size={22} />
              </button>
              {item.type === "video" ? (
                <video
                  src={item.src}
                  className="max-h-[88vh] w-full max-w-[92vw] rounded-[22px] bg-black object-contain shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.label}
                  className="max-h-[88vh] w-full max-w-[92vw] rounded-[22px] bg-white object-contain p-2 shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ReviewAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe4ea] text-[14px] font-black text-[#bd003f]">
      {(name || "C").charAt(0)}
    </div>
  );
}

function getDisplayedHelpfulCount(helpful = 0) {
  return helpful > 150 ? helpful - 50 : helpful;
}

function FullReview({ review }) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <article className="border-b border-stone-200 py-6 last:border-0">
      <div className="flex gap-4">
        <ReviewAvatar name={review.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Stars size={16} rating={review.rating || 5} />
            <h3 className="text-[16px] font-black text-stone-900">{review.title}</h3>
          </div>
          <p className="mt-1 text-[13px] text-stone-500">
            By <span className="font-bold text-stone-700">{review.name}</span> on {review.date}
          </p>
          <p className="mt-1 text-[13px] font-bold text-[#2d7b59]">
            {review.local ? "Posted in this browser" : `Verified purchase - ${review.color}`}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-stone-700">{review.body}</p>
          {review.imagePreview && (
            <img
              src={review.imagePreview}
              alt="Customer uploaded review"
              className="mt-4 max-h-64 w-full rounded-[18px] object-cover"
            />
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-stone-500">
            <span>{getDisplayedHelpfulCount(review.helpful)} people found this helpful</span>
            <motion.button
              className={`rounded-full px-4 py-2 font-bold shadow-sm ${
                helpfulClicked
                  ? "bg-[#bd003f] text-white"
                  : "border border-stone-200 bg-white text-stone-700"
              }`}
              onClick={() => setHelpfulClicked(true)}
              whileTap={{ scale: 0.94 }}
              animate={helpfulClicked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {helpfulClicked ? "+1" : "Helpful"}
            </motion.button>
            <motion.button
              className={`font-bold ${
                reported ? "rounded-full bg-rose-50 px-3 py-2 text-[#bd003f]" : "text-stone-500"
              }`}
              onClick={() => setReported(true)}
              whileTap={{ scale: 0.94 }}
              animate={reported ? { opacity: [0.65, 1], y: [2, 0] } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {reported ? "Reported" : "Report"}
            </motion.button>
          </div>
        </div>
      </div>
    </article>
  );
}

function WriteReviewForm({ isOpen, onClose, onPost }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState(null);
  const [posted, setPosted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim() || "Customer";
    const cleanBody = body.trim();
    if (!cleanBody) return;
    const imagePreview = imageFile ? URL.createObjectURL(imageFile) : "";
    onPost({
      name: cleanName,
      title: title.trim() || "Customer review",
      body: cleanBody,
      rating,
      color: "Customer choice",
      date: "Just now",
      helpful: 0,
      local: true,
      imagePreview,
    });
    setName("");
    setTitle("");
    setBody("");
    setRating(5);
    setImageFile(null);
    setPosted(true);
    window.setTimeout(() => {
      setPosted(false);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-[#3b0718]/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-[30px] bg-white p-5 shadow-[0_28px_90px_rgba(70,8,29,0.28)]"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Write a review</p>
                <h2 className="mt-1 text-[26px] font-black text-stone-950">Share your ComfyWon experience</h2>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#bd003f]"
                onClick={onClose}
                aria-label="Close write review form"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            {posted && <p className="mt-3 text-[13px] font-black text-[#2d7b59]">Posted for this visit.</p>}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                className="h-12 rounded-[18px] border border-rose-100 bg-[#fff7f4] px-4 text-[14px] font-bold outline-none focus:border-[#bd003f]"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
              />
              <input
                className="h-12 rounded-[18px] border border-rose-100 bg-[#fff7f4] px-4 text-[14px] font-bold outline-none focus:border-[#bd003f]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Review title"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[14px] font-black text-stone-900">Rating</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black ${
                    rating === value ? "bg-[#bd003f] text-white" : "border border-rose-100 bg-white text-stone-700"
                  }`}
                  onClick={() => setRating(value)}
                  aria-label={`${value} star review`}
                >
                  {value}
                </button>
              ))}
            </div>

            <label className="mt-3 flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[18px] border border-dashed border-rose-200 bg-[#fff7f4] px-4 py-3 text-[14px] font-bold text-stone-600">
              <span>{imageFile ? imageFile.name : "Upload an image"}</span>
              <span className="rounded-full bg-white px-3 py-2 text-[12px] font-black text-[#bd003f] shadow-sm">
                Choose
              </span>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              />
            </label>

            <textarea
              className="mt-3 min-h-[120px] w-full rounded-[18px] border border-rose-100 bg-[#fff7f4] p-4 text-[14px] font-semibold leading-relaxed outline-none focus:border-[#bd003f]"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your review"
            />

            <button className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-[#bd003f] text-[15px] font-black text-white">
              Post review
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReviewsPage({ navigate }) {
  const [page, setPage] = useState(1);
  const [localReviews, setLocalReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const allReviews = [...localReviews, ...REVIEWS];
  const pageCount = 5;
  const reviewsPerPage = 5;
  const visibleReviews = allReviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

  const handlePostReview = (review) => {
    setLocalReviews((current) => [review, ...current]);
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <button className="mb-5 text-[14px] font-black text-[#bd003f]" onClick={() => navigate("home")}>
        Back to home
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <aside className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_20px_60px_rgba(145,50,78,0.12)] lg:sticky lg:top-24 lg:max-w-none">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Customer reviews</p>
          <h1 className="mt-2 text-[34px] font-black text-stone-950">{REVIEW_RATING} out of 5</h1>
          <div className="mt-2 flex items-center gap-3">
            <Stars size={20} />
            <span className="text-[14px] font-bold text-stone-500">{REVIEW_TOTAL.toLocaleString()} reviews</span>
          </div>
          <div className="mt-5">
            <RatingBars />
          </div>
          <div className="mt-5 rounded-[22px] bg-[#fff7f4] p-4">
            <p className="text-[14px] font-black text-stone-900">Top positive review</p>
            <p className="mt-2 text-[14px] leading-snug text-stone-600">
              "The heat comes on fast and the massage makes it easier to keep working instead of curling up in bed."
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bd003f] px-4 font-black text-white" onClick={() => navigate("product")}>
              Buy the sale offer
              <Icon name="cart" size={18} />
            </button>
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#bd003f] bg-white px-4 font-black text-[#bd003f]"
              onClick={() => setReviewFormOpen(true)}
            >
              Write review
              <Icon name="plus" size={18} />
            </button>
          </div>
        </aside>

        <section className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
          <div className="rounded-[28px] border border-rose-100 bg-white p-4 shadow-sm lg:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[22px] font-black text-stone-950">Reviews with images and videos</h2>
              <Icon name="image" size={24} className="text-[#bd003f]" />
            </div>
            <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {REVIEW_MEDIA.map((item) => (
                <ReviewMediaCard key={item.src + item.label} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-rose-100 bg-white p-4 shadow-sm lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[22px] font-black text-stone-950">Top reviews</h2>
              <p className="text-[13px] font-bold text-stone-500">Showing customer reviews</p>
            </div>

            <div className="mt-2">
              {visibleReviews.map((review) => (
                <FullReview key={`${review.name}-${review.date}-${review.title}`} review={review} />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-black ${
                      page === number ? "bg-[#bd003f] text-white" : "border border-rose-100 bg-white text-stone-700"
                    }`}
                    onClick={() => setPage(number)}
                    aria-label={`Go to review page ${number}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button
                className="flex h-10 items-center gap-2 rounded-full bg-stone-950 px-5 text-[14px] font-black text-white disabled:opacity-40"
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                disabled={page === pageCount}
              >
                Next
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
      <WriteReviewForm
        isOpen={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        onPost={handlePostReview}
      />
    </main>
  );
}

function Footer({ navigate }) {
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <footer className="border-t border-rose-100 bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button className="font-serif text-[28px] font-black text-[#bd003f]" onClick={() => navigate("home")}>
            ComfyWon
          </button>
          <p className="mt-1 text-[13px] text-stone-500">Warm relief, wherever you need it.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[13px] font-black text-stone-600">
          <button onClick={() => navigate("product")}>Shop</button>
          <button onClick={() => navigate("reviews")}>Reviews</button>
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => setPolicyOpen(true)}>Refund Policy</button>
        </div>
      </div>

      <AnimatePresence>
        {policyOpen && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-end justify-center bg-[#3b0718]/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPolicyOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="refund-policy-title"
              className="w-full max-w-lg rounded-[30px] bg-white p-5 shadow-[0_28px_90px_rgba(70,8,29,0.28)]"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.18em] text-rose-500">ComfyWon</p>
                  <h2 id="refund-policy-title" className="mt-1 text-[28px] font-black text-[#bd003f]">
                    Refund Policy
                  </h2>
                </div>
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#bd003f]"
                  onClick={() => setPolicyOpen(false)}
                  aria-label="Close refund policy"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-stone-700">
                If your item arrives damaged or does not work, contact support with your order details and a short description of the problem. Eligible orders can receive a refund or replacement after the issue is reviewed.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-700">
                Items should be returned in the condition received when a return is requested. Shipping timing, refund approval, and replacement availability may depend on the order status and product condition.
              </p>
              <button
                className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#bd003f] text-[15px] font-black text-white"
                onClick={() => setPolicyOpen(false)}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && typeof line.variantId === "string" && Number.isFinite(line.quantity))
      .map((line) => ({
        variantId: line.variantId,
        quantity: Math.max(1, Math.min(5, Math.floor(line.quantity))),
        colorId: line.colorId || "",
        colorLabel: line.colorLabel || "ComfyWon",
      }));
  } catch {
    return [];
  }
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [cart, setCart] = useState(loadCartFromStorage);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartModalView, setCartModalView] = useState("empty");
  const [lastAdded, setLastAdded] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart],
  );

  useEffect(() => {
    const onHashChange = () => setRoute(getInitialRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0 && cartModalView === "cart") {
      setCartModalView("empty");
    }
  }, [cart, cartModalView]);

  const navigate = (nextRoute) => {
    setRoute(nextRoute);
    window.location.hash = nextRoute;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSection = (id) => {
    if (route !== "home") {
      setRoute("home");
      window.location.hash = "home";
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToCart = ({ quantity, color }) => {
    if (!color?.variantId) return;
    const safeQty = Math.max(1, Math.min(5, Math.floor(quantity) || 1));
    setCart((current) => {
      const existing = current.find((line) => line.variantId === color.variantId);
      if (existing) {
        return current.map((line) =>
          line.variantId === color.variantId
            ? { ...line, quantity: Math.min(5, line.quantity + safeQty) }
            : line,
        );
      }
      return [
        ...current,
        {
          variantId: color.variantId,
          quantity: safeQty,
          colorId: color.id,
          colorLabel: color.label,
        },
      ];
    });
    setLastAdded({ quantity: safeQty, colorLabel: color?.label || "ComfyWon" });
    setCheckoutError("");
    setCartModalView("added");
    setCartModalOpen(true);
  };

  const handleCartClick = () => {
    setCartModalView(cartCount > 0 ? "cart" : "empty");
    setCheckoutError("");
    setCartModalOpen(true);
  };

  const handleShopFromCart = () => {
    setCartModalOpen(false);
    navigate("product");
  };

  const handleUpdateLineQuantity = (variantId, nextQuantity) => {
    const clamped = Math.max(0, Math.min(5, Math.floor(nextQuantity) || 0));
    if (clamped === 0) {
      setCart((current) => current.filter((line) => line.variantId !== variantId));
      return;
    }
    setCart((current) =>
      current.map((line) =>
        line.variantId === variantId ? { ...line, quantity: clamped } : line,
      ),
    );
  };

  const handleRemoveLine = (variantId) => {
    setCart((current) => current.filter((line) => line.variantId !== variantId));
  };

  const handleCheckout = async () => {
    if (checkoutLoading) return;
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const items = cart.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      }));
      const data = await createCheckout(items);
      if (!data?.checkoutUrl || !isSafeCheckoutUrl(data.checkoutUrl)) {
        throw new Error("Checkout failed. Please try again.");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setCheckoutError(err?.message || "Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const handleCloseCartModal = () => {
    if (checkoutLoading) return;
    setCartModalOpen(false);
    setCheckoutError("");
  };

  return (
    <div className="min-h-screen bg-[#fff7f4] text-stone-900">
      <div className="min-h-screen w-full overflow-hidden bg-[linear-gradient(180deg,#fff9f6_0%,#ffe8ee_42%,#fffdf8_72%,#fff7f4_100%)]">
        <Header
          route={route}
          navigate={navigate}
          goToSection={goToSection}
          cartCount={cartCount}
          onCartClick={handleCartClick}
        />
        <motion.div
          key={route}
          initial={{ opacity: 0.98, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {route === "product" ? (
            <ProductPage navigate={navigate} onAddToCart={handleAddToCart} />
          ) : route === "reviews" ? (
            <ReviewsPage navigate={navigate} />
          ) : (
            <HomePage navigate={navigate} goToSection={goToSection} />
          )}
        </motion.div>
        <CartConfirmationModal
          isOpen={cartModalOpen}
          cart={cart}
          cartCount={cartCount}
          lastAdded={lastAdded}
          view={cartModalView}
          onClose={handleCloseCartModal}
          onCheckout={handleCheckout}
          onShop={handleShopFromCart}
          onUpdateLineQuantity={handleUpdateLineQuantity}
          onRemoveLine={handleRemoveLine}
          checkoutLoading={checkoutLoading}
          checkoutError={checkoutError}
        />
        <Footer navigate={navigate} />
      </div>
    </div>
  );
}
