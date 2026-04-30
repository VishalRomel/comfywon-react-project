import React from "react";
import { motion } from "framer-motion";

// No lucide-react imports are used here.
// The preview environment was failing to fetch lucide icon modules from the CDN,
// so these tiny inline SVG icons keep the component self-contained and build-safe.
const ICON_PATHS = {
  menu: (
    <>
      <path d="M4 7h24" />
      <path d="M4 16h24" />
      <path d="M4 25h24" />
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
      <rect x="7" y="9" width="16" height="16" rx="3" />
      <path d="M12 6h6" />
      <path d="M17 12l-5 7h5l-2 5 6-8h-5l1-4z" />
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
};

function Icon({ name, size = 24, className = "", fill = "none", strokeWidth = 2.3 }) {
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

const FEATURES = [
  {
    icon: "battery",
    title: "Cordless & Rechargeable",
    text: "2000mAh battery for hours of soothing warmth",
  },
  {
    icon: "thermometer",
    title: "5 Heat Levels",
    text: "Adjust from 45°C to 60°C (113°F–140°F)",
  },
  {
    icon: "waves",
    title: "Massage Vibration",
    text: "Gentle vibration eases tension and discomfort",
  },
  {
    icon: "power",
    title: "Auto Shut-Off",
    text: "Safety auto-off after 30 minutes of use",
  },
];

const LIFESTYLE_CARDS = [
  {
    icon: "home",
    title: "At Home",
    text: "Relax and unwind with cozy, targeted warmth.",
    variant: "bg-[linear-gradient(135deg,#fff7f0,#ffdbe4)]",
  },
  {
    icon: "briefcase",
    title: "At Work",
    text: "Stay comfortable and productive without being plugged in.",
    variant: "bg-[linear-gradient(135deg,#fffaf8,#ffe2ec)]",
  },
  {
    icon: "moon",
    title: "While Resting",
    text: "Enjoy gentle warmth while lying down or winding down.",
    variant: "bg-[linear-gradient(135deg,#fff7fb,#ffe0e9)]",
  },
];

// Small smoke tests for the data this page depends on.
// They run safely in the browser console and do not affect the UI.
function runContentSmokeTests() {
  console.assert(FEATURES.length === 4, "Expected 4 feature cards");
  console.assert(LIFESTYLE_CARDS.length === 3, "Expected 3 lifestyle cards");
  console.assert(FEATURES.every((item) => item.title && item.text && ICON_PATHS[item.icon]), "Every feature needs title, text, and icon");
  console.assert(LIFESTYLE_CARDS.every((item) => item.title && item.text && ICON_PATHS[item.icon]), "Every lifestyle card needs title, text, and icon");
}

runContentSmokeTests();

const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    className="flex flex-col items-center justify-center rounded-[28px] border border-rose-100 bg-white/75 p-5 text-center shadow-[0_18px_45px_rgba(218,91,121,0.12)] backdrop-blur"
  >
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-lg shadow-rose-200/70">
      <Icon name={icon} size={25} strokeWidth={2.2} />
    </div>
    <h3 className="text-[16px] font-extrabold leading-tight text-stone-900">{title}</h3>
    <p className="mt-2 max-w-[155px] text-[13px] leading-snug text-stone-600">{text}</p>
  </motion.div>
);

const LifestyleCard = ({ icon, title, text, variant }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_55px_rgba(210,98,120,0.14)]"
  >
    <div className={`relative h-48 ${variant}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.52),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,216,225,0.28))]" />
      <div className="absolute left-1/2 top-8 h-24 w-20 -translate-x-1/2 rounded-full bg-[#f5d0c8] shadow-[0_0_0_18px_rgba(255,255,255,0.25)]" />
      <div className="absolute left-1/2 top-24 h-32 w-44 -translate-x-1/2 rounded-t-[55px] bg-white/90 shadow-xl" />
      <div className="absolute left-1/2 top-[118px] h-12 w-32 -translate-x-1/2 rounded-[999px] bg-[#f7a8b9] shadow-[0_0_35px_rgba(247,96,103,0.32)]">
        <div className="absolute inset-x-5 top-2 h-8 rounded-[999px] bg-[#f6c7d1]" />
        <div className="absolute left-1/2 top-3 h-6 w-10 -translate-x-1/2 rounded-full bg-stone-900 text-center text-[10px] font-bold leading-6 text-white">55°</div>
        <div className="absolute inset-x-0 -bottom-4 h-10 rounded-full bg-orange-300/45 blur-xl" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </div>
    <div className="flex gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
        <Icon name={icon} size={24} />
      </div>
      <div>
        <h3 className="text-[18px] font-extrabold text-rose-600">{title}</h3>
        <p className="mt-1 text-[14px] leading-snug text-stone-600">{text}</p>
      </div>
    </div>
  </motion.div>
);

function ProductHeroImageBox() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="relative mx-auto h-[255px] w-full max-w-[520px] overflow-hidden rounded-[34px] border border-white/80 bg-[radial-gradient(circle_at_30%_20%,#fff,transparent_35%),linear-gradient(135deg,#ffeaf0_0%,#fff8f3_55%,#ffdce7_100%)] shadow-[0_24px_70px_rgba(220,80,115,0.22)] sm:h-[340px] lg:h-[520px] lg:max-w-none lg:rounded-[48px]"
    >
      <div className="absolute -left-10 top-5 text-[95px] opacity-35 lg:text-[140px]">
        🌸
      </div>

      <div className="absolute -right-8 bottom-0 text-[110px] opacity-45 lg:text-[170px]">
        🌸
      </div>

      <div className="absolute inset-4 overflow-hidden rounded-[28px] bg-white/45 shadow-inner lg:inset-6 lg:rounded-[38px]">
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.2em] text-rose-400">
              Image Placeholder
            </p>
            <p className="mt-2 text-[20px] font-black text-rose-600 lg:text-[34px]">
              Add your product image here
            </p>
            <p className="mx-auto mt-2 max-w-[260px] text-[13px] text-stone-500 lg:text-[16px]">
              Save your image as <b>public/product-hero.png</b>
            </p>
          </div>
        </div>

        <img
          src="/product-hero.png"
          alt="ComfyWon wearable heating pad"
          className="relative z-10 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="absolute bottom-5 left-5 rounded-3xl bg-white/85 px-4 py-3 shadow-xl backdrop-blur lg:bottom-8 lg:left-8">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-400">
          Quick Heat
        </p>
        <p className="text-[22px] font-black text-rose-600 lg:text-[30px]">
          5 Levels
        </p>
      </div>
    </motion.div>
  );
}

export default function ComfyWonMobileLandingPage() {
  return (
    <div className="min-h-screen bg-[#fff7f4] text-stone-900">
      <div className="min-h-screen w-full overflow-hidden bg-[linear-gradient(180deg,#fff9f6_0%,#ffe8ee_55%,#fff6f1_100%)]">
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-5 lg:px-8">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full text-rose-900 lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" size={31} strokeWidth={2.4} />
            </button>

            <div className="font-serif text-[28px] font-black tracking-tight text-rose-600 lg:text-[34px]">
              ComfyWon
            </div>

            <nav className="hidden items-center gap-8 text-[15px] font-bold text-stone-700 lg:flex">
              <a href="#features" className="hover:text-rose-600">
                Features
              </a>
              <a href="#comfort" className="hover:text-rose-600">
                Comfort
              </a>
              <a href="#shop" className="hover:text-rose-600">
                Shop
              </a>
            </nav>

            <button className="flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 px-4 text-[15px] font-extrabold text-white shadow-lg shadow-rose-300/55 lg:px-6">
              <Icon name="cart" size={18} />
              Buy
            </button>
          </div>
        </header>

        <main>
          <section
            id="shop"
            className="relative overflow-hidden px-4 pb-4 pt-3 sm:px-6 lg:px-8"
          >
            <div className="relative mx-auto w-full max-w-7xl">
              <div className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[720px]">
                {/* Right-side image area — no visible box */}
                {/* Right-side image area — full image shows, no visible box */}
                <div className="absolute right-0 z-10 flex w-[64%] items-center justify-end sm:w-[58%] lg:w-[54%]">
                  {/* Placeholder only if image is missing */}
                  <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.18em] text-rose-400">
                        Image Placeholder
                      </p>
                      <p className="mt-2 text-[18px] font-black text-rose-600 lg:text-[28px]">
                        Add your product image
                      </p>
                      <p className="mx-auto mt-2 max-w-[220px] text-[12px] text-stone-500 lg:max-w-[260px] lg:text-[14px]">
                        Save it as <b>public/product-hero.png</b>
                      </p>
                    </div>
                  </div>

                  <img
                    src="/product-hero.png"
                    alt="ComfyWon wearable heating pad"
                    className="relative z-10 h-full w-full object-contain object-right"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Soft readability gradient only on the left */}
                <div className="absolute inset-y-0 left-0 z-20 w-[78%] bg-[linear-gradient(90deg,rgba(255,247,244,0.98)_0%,rgba(255,247,244,0.93)_48%,rgba(255,247,244,0.62)_74%,rgba(255,247,244,0.05)_100%)] sm:w-[70%] lg:w-[58%]" />

                {/* Mobile bottom fade for CTA clarity */}
                <div className="absolute inset-x-0 bottom-0 z-20 h-[150px] bg-[linear-gradient(180deg,rgba(255,247,244,0)_0%,rgba(255,247,244,0.72)_58%,rgba(255,247,244,0.96)_100%)] lg:hidden" />

                {/* Decorative flowers */}
                <div className="pointer-events-none absolute left-[42%] top-4 z-20 text-[34px] opacity-30 lg:text-[42px]">
                  🌸
                </div>
                <div className="pointer-events-none absolute bottom-6 right-0 z-20 text-[110px] opacity-55 lg:text-[160px]">
                  🌸
                </div>

                {/* Hero content */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="relative z-30 flex min-h-[560px] flex-col justify-start px-1 pb-4 pt-6 sm:pt-8 lg:min-h-[720px] lg:w-[56%] lg:justify-center lg:pb-10"
                >
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-[13px] font-extrabold text-rose-500 shadow-sm backdrop-blur">
                    <span>🌸</span> Cordless Heating Belt
                  </div>

                  <h1 className="max-w-[330px] font-serif text-[34px] font-black leading-[0.94] tracking-[-0.05em] text-rose-700 sm:max-w-[420px] sm:text-[54px] lg:max-w-[620px] lg:text-[82px]">
                    Warm Relief,
                    <br />
                    Wherever You
                    <br />
                    Need It
                  </h1>

                  <p className="mt-3 max-w-[300px] text-[14px] leading-[1.5] text-stone-700 sm:max-w-[390px] sm:text-[17px] lg:max-w-[500px] lg:text-[20px]">
                    Soothing heat and gentle vibration for period cramps and lower
                    abdominal comfort. Cordless freedom. All-day comfort.
                  </p>

                  {/* Reviews */}
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {["A", "J", "M", "S"].map((letter) => (
                          <div
                            key={letter}
                            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-rose-300 text-sm font-black text-rose-700 shadow-md"
                          >
                            {letter}
                          </div>
                        ))}
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-rose-100 text-rose-500 shadow-md">
                          <Icon name="plus" size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Icon
                            key={i}
                            name="star"
                            size={20}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <span className="text-[17px] font-black text-stone-900">4.9/5</span>
                    </div>

                    <p className="mt-1 text-[13px] font-medium text-stone-700 sm:text-[14px]">
                      Loved by 10,000+ Women
                    </p>
                  </div>

                  {/* CTA buttons */}
                  <button className="mt-4 flex h-[56px] w-full max-w-[520px] items-center justify-center gap-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 text-[20px] font-black text-white shadow-[0_16px_32px_rgba(222,79,113,0.32)] active:scale-[0.99] sm:h-[62px] sm:text-[22px]">
                    Shop Now
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70">
                      <Icon name="arrow" size={23} />
                    </span>
                  </button>

                  <button className="mt-3 flex h-[54px] w-full max-w-[520px] items-center justify-center gap-3 rounded-full border-2 border-rose-300/70 bg-white/65 text-[18px] font-black text-rose-600 shadow-sm backdrop-blur active:scale-[0.99] sm:h-[58px] sm:text-[20px]">
                    See How It Works <Icon name="play" size={22} />
                  </button>
                </motion.div>
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 rounded-[36px] border border-white/80 bg-white/55 p-4 shadow-[0_22px_60px_rgba(205,88,117,0.16)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>

          <section id="comfort" className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -left-16 top-8 text-[125px] opacity-30">
              🌸
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative z-10 text-center"
            >
              <p className="text-[14px] font-black uppercase tracking-[0.22em] text-rose-400">
                Comfort that moves with you
              </p>

              <h2 className="mt-2 font-serif text-[36px] font-black leading-tight tracking-[-0.035em] text-rose-700 lg:text-[56px]">
                Feel Better Wherever Your Day Takes You
              </h2>

              <p className="mx-auto mt-3 max-w-[520px] text-[17px] leading-snug text-stone-700 lg:text-[20px]">
                Wear it at home, at work, or while you rest.
              </p>
            </motion.div>

            <div className="relative z-10 mt-6 grid gap-5 lg:grid-cols-3">
              {LIFESTYLE_CARDS.map((card) => (
                <LifestyleCard key={card.title} {...card} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}