import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  },
  {
    id: "white",
    label: "Soft White",
    swatch: "#fff8f0",
    image: "/White Listing Image 1.jpg",
  },
];

const FEATURES = [
  {
    icon: "check",
    title: "Adjustable Stretchy Waistband",
    text: "Made to fit all sizes with a soft flexible band.",
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
    text: "USB-C rechargeable warmth without wall cords.",
  },
];

const HOW_STEPS = [
  {
    number: "01",
    title: "Wrap",
    text: "Fasten the soft adjustable belt over your lower belly or back.",
  },
  {
    number: "02",
    title: "Warm",
    text: "Choose one of five heat levels and let comfort build quickly.",
  },
  {
    number: "03",
    title: "Move",
    text: "Go cordless at home, work, in the car, or while resting.",
  },
];

const LIFESTYLE_CARDS = [
  {
    icon: "home",
    title: "At Home",
    text: "Relax on the couch, clean up, cook, or wind down with targeted warmth.",
    image: "/product-hero.png",
  },
  {
    icon: "briefcase",
    title: "At Work",
    text: "Low-profile comfort that sits under loose layers without cords.",
    image: "/Listing Image 5.jpg",
  },
  {
    icon: "moon",
    title: "While Resting",
    text: "A calmer way to settle in when cramps interrupt your evening.",
    image: "/1.png",
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

const KIT_ITEMS = [
  { icon: "package", title: "Heating Belt", text: "Adjustable wearable warmer" },
  { icon: "battery", title: "USB-C Cable", text: "Fast charging cord included" },
  { icon: "gift", title: "Storage Pouch", text: "Soft pouch for travel" },
  { icon: "shield", title: "Quick Guide", text: "Simple setup and care" },
];

const REVIEWS = [
  {
    name: "Jessica M.",
    title: "A lifesaver on day one",
    body: "The heat comes on fast and the massage makes it easier to keep working instead of curling up in bed. I love that I can walk around with it.",
    color: "Blush Pink",
    date: "April 18, 2026",
    helpful: 214,
    image: "/product-hero.png",
  },
  {
    name: "Amanda R.",
    title: "Finally cordless comfort",
    body: "I bought this for cramps and now use it for back tension too. The strap is comfortable, it stays in place, and the battery lasted through my evening.",
    color: "Soft White",
    date: "April 12, 2026",
    helpful: 179,
    image: "/comfywon-white-variant.png",
  },
  {
    name: "Olivia T.",
    title: "Soft, warm, and easy",
    body: "The plush side feels really gentle. The controls are simple and the auto shut-off lets me relax without checking the timer every few minutes.",
    color: "Blush Pink",
    date: "April 8, 2026",
    helpful: 136,
    image: "/Listing Image 7.jpg",
  },
  {
    name: "Nina P.",
    title: "Great for my office days",
    body: "This is the first warmer I can actually use at my desk. It fits under a cardigan and does not need to stay plugged into the wall.",
    color: "Blush Pink",
    date: "March 31, 2026",
    helpful: 118,
    image: "/Listing Image 5.jpg",
  },
  {
    name: "Carmen L.",
    title: "Gifted one to my sister",
    body: "I got one for myself and ordered another for my sister after she tried it. It feels much more premium than the heating pads I used before.",
    color: "Soft White",
    date: "March 23, 2026",
    helpful: 94,
    image: "/Listing Image 9.jpg",
  },
  {
    name: "Brianna S.",
    title: "Worth it at the sale price",
    body: "The 5 heat settings make a real difference because I can start warmer and turn it down later. Shipping was quick and the pouch is useful.",
    color: "Blush Pink",
    date: "March 16, 2026",
    helpful: 88,
    image: "/Listing Image 1.jpg",
  },
];

const REVIEW_MEDIA = [
  { type: "image", src: "/product-hero.png", label: "Customer photo" },
  { type: "video", src: "/Listing Image 2.jpg", label: "Relief demo" },
  { type: "image", src: "/Listing Image 7.jpg", label: "Soft fabric" },
  { type: "video", src: "/Listing Image 5.jpg", label: "Workday use" },
  { type: "image", src: "/comfywon-white-variant.png", label: "White color" },
  { type: "image", src: "/Listing Image 1.jpg", label: "Pink color" },
];

const TRUST_BADGES = [
  { icon: "truck", text: "Fast free shipping" },
  { icon: "rotate", text: "30-day money-back guarantee" },
  { icon: "shield", text: "1-year warranty" },
  { icon: "lock", text: "Secure checkout" },
];

function getInitialRoute() {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#", "");
  return ["home", "product", "reviews"].includes(hash) ? hash : "home";
}

function useCountdown(totalSeconds = 2 * 60 * 60 + 20 * 60) {
  const [targetTime] = useState(() => Date.now() + totalSeconds * 1000);
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const tick = () => {
      setRemaining(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)));
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [targetTime]);

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

function Stars({ size = 17 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label="5 star rating">
      {[1, 2, 3, 4, 5].map((item) => (
        <Icon key={item} name="star" size={size} fill="currentColor" strokeWidth={0} />
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
              Shop ComfyWon - $30
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
              Cordless Heating Belt
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

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <Stars size={20} />
                <span className="text-[17px] font-black text-stone-900">4.9/5</span>
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
                <span className="text-stone-400 line-through">$60</span>{" "}
                <span className="text-[#bd003f]">$30</span>
              </span>
              <span className="rounded-full bg-white/75 px-3 py-1 text-[#bd003f]">
                Ends in {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </span>
            </div>

            <button
              className="mt-4 flex h-[56px] w-full max-w-[520px] items-center justify-center gap-4 rounded-full bg-gradient-to-r from-[#e65478] to-[#c40042] text-[19px] font-black text-white shadow-[0_16px_32px_rgba(190,52,89,0.32)] active:scale-[0.99] sm:h-[62px] sm:text-[22px]"
              onClick={() => navigate("product")}
            >
              Buy Now - $30
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70">
                <Icon name="arrow" size={23} />
              </span>
            </button>

            <button
              className="mt-3 flex h-[54px] w-full max-w-[520px] items-center justify-center gap-3 rounded-full border-2 border-rose-300/70 bg-white/70 text-[18px] font-black text-[#bd003f] shadow-sm backdrop-blur active:scale-[0.99] sm:h-[58px] sm:text-[20px]"
              onClick={() => goToSection("how-it-works")}
            >
              How It Works <Icon name="play" size={22} />
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
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border border-rose-100 bg-white/78 p-4 shadow-[0_18px_45px_rgba(175,64,94,0.10)] lg:p-7">
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="Comfort in three taps."
            text="Simple controls make it easy to get the warmth you want without cords or bulky pads."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {HOW_STEPS.map((step) => (
              <div key={step.number} className="rounded-[22px] bg-[#fff6f3] p-4">
                <p className="text-[12px] font-black text-rose-400">{step.number}</p>
                <h3 className="mt-1 text-[20px] font-black text-[#bd003f]">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-snug text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>
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
        title="Relief that fits real life."
        text="Wear it when your day will not pause for cramps, tension, or that heavy lower-belly ache."
      />

      <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
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
        <span className="absolute left-4 top-4 rounded-full bg-[#bd003f] px-3 py-1 text-[12px] font-black text-white shadow-lg">
          {label}
        </span>
        <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#e65478] text-white shadow-lg">
          <Icon name="play" size={18} fill="currentColor" strokeWidth={0} />
        </span>
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
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Targeted warmth"
        title={
          <>
            <span className="glow-3s block sm:inline">3s Heating</span>{" "}
            <span className="block sm:inline">Rapid Pain Relief</span>{" "}
            {/* <span className="block sm:inline">kind of rough day.</span> */}
          </>
        }
        text="Swipe on phone to scan the three most common ways women use ComfyWon, or compare them side by side on desktop."
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
            title="2000mAh rechargeable battery."
            text="Charge with USB-C, then take your heat with you. No outlet hunting, no cord across the couch, no bulky plug pack."
          />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["battery", "Long-life battery"],
              ["clock", "30-min auto off"],
              ["truck", "Portable"],
              ["shield", "Safe timer"],
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
    ["Auto shut-off timer", "No safety timer"],
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
            text="Make the comparison easy before the customer has time to wonder if a basic pad is enough."
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

function KitSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border border-rose-100 bg-white/80 p-4 shadow-[0_18px_45px_rgba(178,75,98,0.10)] lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KIT_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-[22px] bg-[#fff7f4] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm">
                <Icon name={item.icon} size={23} />
              </div>
              <div>
                <h3 className="text-[15px] font-black text-stone-900">{item.title}</h3>
                <p className="text-[13px] text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewMiniCard({ review }) {
  return (
    <article className="min-w-[82%] snap-start rounded-[24px] border border-rose-100 bg-white p-4 shadow-[0_16px_40px_rgba(178,75,98,0.11)] sm:min-w-[340px] lg:min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe4ea] font-black text-[#bd003f]">
          {review.name.charAt(0)}
        </div>
        <div>
          <Stars size={16} />
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
        <button
          className="w-fit rounded-full border border-[#bd003f] bg-white px-5 py-3 text-[14px] font-black text-[#bd003f] shadow-sm"
          onClick={() => navigate("reviews")}
        >
          See more reviews
        </button>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
        {REVIEWS.slice(0, 3).map((review) => (
          <ReviewMiniCard key={review.name} review={review} />
        ))}
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
            Limited launch offer: wearable heating belt, USB-C cable, storage pouch,
            quick guide, and free shipping included.
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
            Get Mine Now - $30
            <Icon name="arrow" size={22} />
          </button>

          <div className="mx-auto mt-4 grid max-w-[560px] grid-cols-3 gap-2 text-[11px] font-black sm:text-[13px]">
            {["Free shipping", "Auto shut-off", "USB-C"].map((item) => (
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
      <KitSection />
      <ReviewsPreview navigate={navigate} />
      <OfferBox navigate={navigate} />
      <TrustBar />
      <MobileStickyBar navigate={navigate} />
    </>
  );
}

function MobileStickyBar({ navigate }) {
  const countdown = useCountdown();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/92 px-4 py-3 shadow-[0_-16px_40px_rgba(120,42,64,0.14)] backdrop-blur lg:hidden">
      <button
        className="mx-auto flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-full bg-white text-[14px] font-black text-stone-900 shadow-sm"
        onClick={() => navigate("product")}
      >
        <span className="text-rose-500">50% off</span>
        <span className="text-[12px] text-stone-500">{countdown.hours}:{countdown.minutes}:{countdown.seconds}</span>
        <span>
          <span className="text-stone-400 line-through">$60</span> $30
        </span>
        <span className="flex items-center gap-1 text-[#bd003f]">
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
    return [colorAsset, ...rest.slice(0, 8)];
  }, [colorAsset, selectedGallery]);
  const [active, setActive] = useState(gallery[0]);

  useEffect(() => {
    setActive(gallery[0]);
  }, [gallery]);

  return (
    <div className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
      <div className="overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_18px_45px_rgba(178,75,98,0.12)]">
        <img src={active} alt="ComfyWon product view" className="aspect-[4/3] w-full object-contain p-2 sm:aspect-square" />
      </div>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
        {gallery.map((image) => (
          <button
            key={image}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border-2 bg-white ${
              active === image ? "border-[#bd003f]" : "border-rose-100"
            }`}
            onClick={() => setActive(image)}
            aria-label="View product image"
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function BuyBox({ selectedColor, setSelectedColor, onAddToCart }) {
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
          ComfyWon Cordless Heating Belt
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Stars size={17} />
          <span className="text-[14px] font-black text-stone-800">4.9</span>
          <span className="text-[13px] text-stone-500">10,000+ happy customers</span>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-[42px] font-black leading-none text-[#bd003f]">$30</span>
          <span className="pb-1 text-[20px] font-bold text-stone-400 line-through">$60</span>
          <span className="pb-1 text-[13px] font-black text-[#2d7b59]">You save $30</span>
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
          "Fast and free shipping today",
          "30-day money-back guarantee",
          "Auto shut-off safety timer",
          "USB-C cable and pouch included",
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

function CartConfirmationModal({ isOpen, cartCount, lastAdded, view, onClose, onCheckout, onShop }) {
  const isEmpty = cartCount === 0 || view === "empty";
  const isAdded = !isEmpty && view === "added";
  const itemWord = cartCount === 1 ? "item" : "items";
  const subtotal = cartCount * 30;
  const eyebrow = isEmpty ? "Cart" : isAdded ? "Added to cart" : "Your cart";
  const title = isEmpty ? "Your cart is empty." : isAdded ? "Your ComfyWon is in the cart." : "Your cart is ready.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-[#3b0718]/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm"
                  onClick={onClose}
                  aria-label="Close cart popup"
                >
                  <Icon name="x" size={21} />
                </button>
              </div>

              <div className="mt-5 rounded-[22px] border border-rose-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-black text-stone-900">ComfyWon Cordless Heating Belt</p>
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
                    <p className="text-[21px] font-black text-stone-950">${subtotal}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-stone-600">
                  {["Free shipping", "USB-C", "30-day guarantee"].map((item) => (
                    <span key={item} className="rounded-full bg-rose-50 px-2 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {!isEmpty && (
                <p className="mt-4 rounded-[18px] bg-white p-3 text-[13px] font-bold leading-snug text-stone-600">
                  Your sale price, free shipping, and 30-day guarantee are saved in the cart.
                </p>
              )}
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <button
                className="h-[52px] rounded-[18px] border-2 border-[#bd003f] bg-white px-4 py-3 text-[15px] font-black text-[#bd003f]"
                onClick={onClose}
              >
                Continue Shopping
              </button>
              <button
                className="h-[52px] rounded-[18px] bg-[#bd003f] px-4 py-3 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(182,63,98,0.28)]"
                onClick={isEmpty ? onShop : onCheckout}
              >
                {isEmpty ? "Shop ComfyWon" : "Go to Checkout"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CheckoutPlaceholderModal({ isOpen, cartCount, onClose, onBackToCart }) {
  const itemWord = cartCount === 1 ? "item" : "items";
  const subtotal = cartCount * 30;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-[#3b0718]/40 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-placeholder-title"
            className="w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-[0_28px_90px_rgba(70,8,29,0.30)]"
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-[linear-gradient(135deg,#bd003f,#e65478)] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/18 text-white shadow-lg">
                    <Icon name="lock" size={24} />
                  </span>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/75">
                      Shopify checkout
                    </p>
                    <h2 id="checkout-placeholder-title" className="text-[25px] font-black leading-tight">
                      Checkout placeholder
                    </h2>
                  </div>
                </div>
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#bd003f] shadow-sm"
                  onClick={onClose}
                  aria-label="Close checkout placeholder"
                >
                  <Icon name="x" size={21} />
                </button>
              </div>
              <p className="mt-4 text-[14px] font-bold leading-relaxed text-white/90">
                This is where customers will be sent to the Shopify cart once the store checkout is connected.
              </p>
            </div>

            <div className="p-5">
              <div className="rounded-[22px] border border-rose-100 bg-[#fff7f4] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-black text-stone-900">Cart total</p>
                    <p className="mt-1 text-[13px] font-bold text-stone-500">
                      {cartCount} {itemWord} ready for checkout
                    </p>
                  </div>
                  <p className="text-[26px] font-black text-[#bd003f]">${subtotal}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  className="h-[52px] rounded-[18px] border-2 border-[#bd003f] bg-white px-4 py-3 text-[15px] font-black text-[#bd003f]"
                  onClick={onBackToCart}
                >
                  Back to Cart
                </button>
                <button
                  className="h-[52px] rounded-[18px] bg-[#bd003f] px-4 py-3 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(182,63,98,0.28)]"
                  onClick={onClose}
                >
                  Keep Placeholder
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
        <BuyBox selectedColor={selectedColor} setSelectedColor={setSelectedColor} onAddToCart={onAddToCart} />
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
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

      <section className="mt-10 rounded-[30px] border border-rose-100 bg-white p-4 shadow-sm lg:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Real reviews</p>
            <h2 className="mt-1 text-[28px] font-black text-[#bd003f]">4.9 out of 5 from ComfyWon customers</h2>
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
    ["5 star", "92%", "92%"],
    ["4 star", "6%", "6%"],
    ["3 star", "2%", "2%"],
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
  return (
    <button className="relative min-w-[150px] snap-start overflow-hidden rounded-[18px] bg-white shadow-sm sm:min-w-[190px]">
      <img src={item.src} alt={item.label} className="aspect-square w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-left text-[12px] font-black text-white">
        {item.label}
      </div>
      {item.type === "video" && (
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#bd003f] shadow-lg">
          <Icon name="play" size={19} fill="currentColor" strokeWidth={0} />
        </span>
      )}
    </button>
  );
}

function FullReview({ review }) {
  return (
    <article className="border-b border-stone-200 py-6 last:border-0">
      <div className="flex gap-4">
        <img src={review.image} alt="" className="h-16 w-16 shrink-0 rounded-[18px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Stars size={16} />
            <h3 className="text-[16px] font-black text-stone-900">{review.title}</h3>
          </div>
          <p className="mt-1 text-[13px] text-stone-500">
            By <span className="font-bold text-stone-700">{review.name}</span> on {review.date}
          </p>
          <p className="mt-1 text-[13px] font-bold text-[#2d7b59]">Verified purchase - {review.color}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-stone-700">{review.body}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-stone-500">
            <span>{review.helpful} people found this helpful</span>
            <button className="rounded-full border border-stone-200 px-4 py-2 font-bold text-stone-700">Helpful</button>
            <button className="font-bold text-stone-500">Report</button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReviewsPage({ navigate }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <button className="mb-5 text-[14px] font-black text-[#bd003f]" onClick={() => navigate("home")}>
        Back to home
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <aside className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_20px_60px_rgba(145,50,78,0.12)] lg:sticky lg:top-24 lg:max-w-none">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-rose-500">Customer reviews</p>
          <h1 className="mt-2 text-[34px] font-black text-stone-950">4.9 out of 5</h1>
          <div className="mt-2 flex items-center gap-3">
            <Stars size={20} />
            <span className="text-[14px] font-bold text-stone-500">10,000+ ratings</span>
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
          <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bd003f] font-black text-white" onClick={() => navigate("product")}>
            Buy the sale offer
            <Icon name="cart" size={18} />
          </button>
        </aside>

        <section className="mobile-card-bound min-w-0 w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
          <div className="rounded-[28px] border border-rose-100 bg-white p-4 shadow-sm lg:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[22px] font-black text-stone-950">Reviews with images and videos</h2>
              <Icon name="image" size={24} className="text-[#bd003f]" />
            </div>
            <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
              {REVIEW_MEDIA.map((item) => (
                <ReviewMediaCard key={item.src + item.label} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-rose-100 bg-white p-4 shadow-sm lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[22px] font-black text-stone-950">Top reviews</h2>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {["All", "Cramps", "Back pain", "Battery", "Soft fabric"].map((chip) => (
                  <button key={chip} className="shrink-0 rounded-full border border-stone-200 px-4 py-2 text-[13px] font-black text-stone-700">
                    {chip}
                  </button>
                ))}
                <button className="flex shrink-0 items-center gap-1 rounded-full bg-stone-900 px-4 py-2 text-[13px] font-black text-white">
                  <Icon name="filter" size={15} />
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-2">
              {REVIEWS.slice(0, 6).map((review) => (
                <FullReview key={review.name} review={review} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Footer({ navigate }) {
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
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [cartCount, setCartCount] = useState(0);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartModalView, setCartModalView] = useState("empty");
  const [checkoutPlaceholderOpen, setCheckoutPlaceholderOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    const onHashChange = () => setRoute(getInitialRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

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
    setCartCount((count) => count + quantity);
    setLastAdded({ quantity, colorLabel: color?.label || "ComfyWon" });
    setCartModalView("added");
    setCartModalOpen(true);
  };

  const handleCartClick = () => {
    setCartModalView(cartCount > 0 ? "cart" : "empty");
    setCartModalOpen(true);
  };

  const handleShopFromCart = () => {
    setCartModalOpen(false);
    navigate("product");
  };

  const openCheckoutPlaceholder = () => {
    // Shopify cart redirect placeholder: replace this modal with the real Shopify cart or checkout URL later.
    setCartModalOpen(false);
    setCheckoutPlaceholderOpen(true);
  };

  const returnToCartFromPlaceholder = () => {
    setCheckoutPlaceholderOpen(false);
    setCartModalView(cartCount > 0 ? "cart" : "empty");
    setCartModalOpen(true);
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
          cartCount={cartCount}
          lastAdded={lastAdded}
          view={cartModalView}
          onClose={() => setCartModalOpen(false)}
          onCheckout={openCheckoutPlaceholder}
          onShop={handleShopFromCart}
        />
        <CheckoutPlaceholderModal
          isOpen={checkoutPlaceholderOpen}
          cartCount={cartCount}
          onClose={() => setCheckoutPlaceholderOpen(false)}
          onBackToCart={returnToCartFromPlaceholder}
        />
        <Footer navigate={navigate} />
      </div>
    </div>
  );
}
