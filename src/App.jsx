import React, { useEffect, useState } from "react";
import cityBeansLogoCream from "./assets/cream.png";
import cityBeansLogoDark from "./assets/dark.png";
import { useMenuData } from "./hooks/useMenuData";
import { useDeliveryZones } from "./hooks/useDeliveryZones";
import { useCreateOrder } from "./hooks/useCreateOrder";
import { useOrderTracking } from "./hooks/useOrderTracking";
import { usePaystackPayment } from "./hooks/usePaystackPayment";
import {
  ArrowRight,
  ChevronLeft,
  Heart,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
  CircleCheck,
} from "lucide-react";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  {
    id: "all",
    name: "All",
    blurb: "View all meals",
  },
  {
    id: "gob3",
    name: "Gob3",
    blurb: "Gari & Beans the City Beans way",
  },
  {
    id: "waakye",
    name: "Waakye",
    blurb: "Rice & beans, done right",
  },
  {
    id: "beans-stew",
    name: "Beans Stew",
    blurb: "Slow-cooked, deep flavour",
  },
  {
    id: "extras",
    name: "Extras",
    blurb: "Top up any pack",
  },
];

/* =========================================================
   BUSINESS INFO
========================================================= */

const PHONES = [
  "055 203 6497",
  "053 958 6389",
];

const LOCATION = "Kotei, Sunshine Academy";

const WHATSAPP_NUMBER = "233552036497";

// TODO: replace with City Beans' real handles
const INSTAGRAM_URL = "https://instagram.com/citybeans._";
const TIKTOK_URL = "https://tiktok.com/@city.beans";

/* =========================================================
   FOOD IMAGES
========================================================= */

const FOOD_IMAGES = {
  hero: [
    `${import.meta.env.BASE_URL}images/hero/hero-1.jpg`,
    `${import.meta.env.BASE_URL}images/hero/hero-2.jpg`,
    `${import.meta.env.BASE_URL}images/hero/hero-3.jpg`,
    `${import.meta.env.BASE_URL}images/hero/hero-4.jpg`,
  ],

  gob3:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",

  waakye:
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",

  stew:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
};

/* =========================================================
   THEME
========================================================= */

const T = {
  cream: "#F5EABD",
  cream2: "#E3D9AF",
  paper: "#FFFBEF",
  ink: "#1A1400",
  green: "#609223",
  greenDark: "#456919",
  brown: "#917138",
  gold: "#B7A27D",
  orange: "#F7A110",
  black: "#000000",
};

const money = (n) =>
  `GH₵${Number(n).toFixed(2).replace(/\.00$/, "")}`;

/* =========================================================
   LOGO
========================================================= */

function Logo({ dark = false }) {
  return (
    <img
      src={dark ? cityBeansLogoDark : cityBeansLogoCream}
      alt="City Beans"
      className="h-7 w-auto md:h-8 object-contain"
      style={{ display: "block" }}
    />
  );
}
/* =========================================================
   SOCIAL ICONS
   Lucide doesn't ship brand logos (dropped them to avoid
   trademark scope creep), so these are small hand-drawn
   line icons in the same stroke weight as the rest of the UI.
========================================================= */

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.18h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.55 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.17 1.73 2.65 4.2 3.71.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 2h-3.1v13.4a2.6 2.6 0 1 1-2.2-2.57v-3.15a5.75 5.75 0 1 0 5.3 5.73V8.9a7.7 7.7 0 0 0 4.4 1.38V7.2a4.6 4.6 0 0 1-4.4-4.3V2Z" />
    </svg>
  );
}



/* =========================================================
   BUTTON
========================================================= */

function Button({
  children,
  onClick,
  variant = "green",
  className = "",
  icon: Icon,
  disabled = false,
}) {
  const styles = {
    green: {
      background: T.green,
      color: T.paper,
    },

    dark: {
      background: T.ink,
      color: T.paper,
    },

    light: {
      background: T.paper,
      color: T.ink,
      border: "1px solid rgba(25,21,15,.14)",
    },

    orange: {
      background: T.orange,
      color: T.paper,
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full px-6 py-3.5
        font-bold text-sm tracking-wide
        transition
        hover:-translate-y-0.5
        active:scale-[.98]
        disabled:opacity-40
        disabled:pointer-events-none
        ${className}
      `}
      style={{
        ...styles[variant],
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {children}

      {Icon && <Icon size={17} />}
    </button>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ page, setPage, cartCount, setMobileOpen }) {
  return (
    <>
      {/* Top announcement */}
      <div className="absolute top-0 left-0 right-0 z-50 text-[#FFFBEF] text-[10px] sm:text-xs text-center py-2 tracking-[.14em] uppercase bg-black/20 backdrop-blur-sm">
        Freshly prepared • Delivery & pickup available • Kotei, Sunshine Academy
      </div>

      {/* Glass navbar */}
      <header className="absolute top-[38px] left-0 right-0 z-40 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          <div
            className="
              h-[68px]
              px-4 sm:px-6
              flex items-center justify-between
              gap-6
              rounded-2xl
              border border-white/20
              bg-black/20
              backdrop-blur-md
              shadow-[0_8px_30px_rgba(0,0,0,.18)]
            "
          >

            {/* Logo */}
            <button
              onClick={() => setPage("home")}
              className="shrink-0"
            >
              <Logo dark />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#FFFBEF]">

              <button
                onClick={() => setPage("home")}
                className={`relative py-2 transition ${
                  page === "home"
                    ? "text-[#FFFBEF]"
                    : "text-[#FFFBEF]/65 hover:text-[#FFFBEF]"
                }`}
              >
                HOME

                {page === "home" && (
                  <span
                    className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full"
                    style={{ background: T.gold }}
                  />
                )}
              </button>

              <button
                onClick={() => setPage("menu")}
                className={`relative py-2 transition ${
                  page === "menu"
                    ? "text-[#FFFBEF]"
                    : "text-[#FFFBEF]/65 hover:text-[#FFFBEF]"
                }`}
              >
                MENU

                {page === "menu" && (
                  <span
                    className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full"
                    style={{ background: T.gold }}
                  />
                )}
              </button>

              <button
                onClick={() => setPage("cart")}
                className={`relative py-2 transition ${
                  page === "cart"
                    ? "text-[#FFFBEF]"
                    : "text-[#FFFBEF]/65 hover:text-[#FFFBEF]"
                }`}
              >
                CART

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-5
                      -top-1
                      min-w-4
                      h-4
                      px-1
                      rounded-full
                      flex items-center justify-center
                      text-[9px]
                      font-bold
                    "
                    style={{
                      background: T.orange,
                      color: T.paper,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <button
                onClick={() => setPage("menu")}
                className="
                  hidden sm:flex
                  h-10 w-10
                  items-center justify-center
                  rounded-full
                  text-[#FFFBEF]/80
                  hover:text-[#FFFBEF]
                  hover:bg-[#FFFBEF]/10
                  transition
                "
                aria-label="Search menu"
              >
                <Search size={18} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setPage("cart")}
                className="
                  h-10
                  px-4
                  rounded-full
                  bg-[#FFFBEF]
                  text-[#1A1400]
                  flex items-center
                  gap-2
                  text-sm
                  font-bold
                  hover:bg-[#F5EABD]
                  transition
                "
              >
                <ShoppingBag size={17} />

                <span className="hidden sm:inline">
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="text-xs font-black">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(true)}
                className="
                  md:hidden
                  h-10 w-10
                  rounded-full
                  bg-[#FFFBEF]/15
                  border border-white/20
                  text-[#FFFBEF]
                  flex items-center justify-center
                  backdrop-blur-sm
                  hover:bg-[#FFFBEF]/25
                  transition
                "
                aria-label="Open menu"
              >
                <MenuIcon size={20} />
              </button>

            </div>
          </div>
        </div>
      </header>
    </>
  );
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function MobileNav({
  open,
  onClose,
  setPage,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[min(86vw,360px)] p-6 bg-[#F5EABD] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-[#FFFBEF] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-12 space-y-5">

          {[
            ["home", "Home"],
            ["menu", "Menu"],
            ["cart", "Cart"],
            ["checkout", "Checkout"],
            ["track", "Track order"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setPage(key);
                onClose();
              }}
              className="block text-3xl font-bold"
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {label}
            </button>
          ))}

        </div>

        <div className="absolute bottom-8 left-6 right-6 border-t border-black/10 pt-5">

          <p className="text-xs text-black/40 uppercase tracking-[.15em]">
            City Beans
          </p>

          <p className="mt-2 text-sm text-black/55">
            {LOCATION}
          </p>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   HERO SLIDESHOW
========================================================= */

function Hero({ setPage }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(
        (previous) =>
          (previous + 1) % FOOD_IMAGES.hero.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

   return (
    <section className="relative min-h-[760px] md:min-h-[850px] overflow-hidden bg-[#1A1400]">

      {/* Images */}

      {FOOD_IMAGES.hero.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[1500ms]
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Dark overlay */}

      <div className="absolute inset-0 bg-black/45" />

      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

      {/* Content */}

      <div className="relative z-10 max-w-7xl mx-auto min-h-[650px] md:min-h-[720px] px-5 md:px-8 pt-28 md:pt-32 flex items-center">

        <div className="max-w-3xl text-[#FFFBEF]">

          <p className="text-xs md:text-sm uppercase tracking-[.25em] font-bold mb-6" style={{ color: T.green }}>
            CITY BEANS
          </p>

          <h1
            className="text-[3.6rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-[.88] font-black tracking-[-.05em]"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Your favourite
            <br />

            <span
              style={{
                color: T.orange,
              }}
            >
              Ghanaian meals
            </span>

            <br />

            made fresh.
          </h1>

          <p className="mt-7 max-w-xl text-base md:text-lg leading-7 text-[#F5EABD]/85">
            Freshly prepared Gob3, Waakye and Beans Stew ,
            customized your way and delivered to your door.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            <Button
              onClick={() => setPage("menu")}
              variant="orange"
              icon={ArrowRight}
            >
              ORDER NOW
            </Button>

            <Button
              variant="green"
              onClick={() => setPage("menu")}
            >
              VIEW MENU
            </Button>

          </div>

        </div>
      </div>

      {/* Slide indicators */}

      <div className="absolute z-20 bottom-8 left-5 md:left-8 flex gap-2">

        {FOOD_IMAGES.hero.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Show slide ${index + 1}`}
            className={`
              h-1.5 rounded-full
              transition-all duration-500
              ${
                index === current
                  ? "w-10 bg-[#FFFBEF]"
                  : "w-5 bg-[#FFFBEF]/40"
              }
            `}
          />
        ))}

      </div>

      <div className="absolute bottom-7 right-5 md:right-8 hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#FFFBEF]/60">
        <span>Scroll</span>
        <div className="w-10 h-px bg-[#FFFBEF]/40" />
      </div>

    </section>
  );
}

/* =========================================================
   CATEGORY RAIL
========================================================= */

function CategoryRail({
  active,
  setActive,
}) {
  return (
    <div className="mt-10">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">

        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActive(category.id)}
            className="shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{
              background:
                active === category.id
                  ? T.green
                  : "transparent",

              color:
                active === category.id
                  ? T.paper
                  : T.ink,

              border:
                active === category.id
                  ? `1px solid ${T.green}`
                  : "1px solid rgba(25,21,15,.15)",
            }}
          >
            {category.name}
          </button>
        ))}

      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

function getProductImage(product) {
  if (product.imageUrl) {
    return product.imageUrl;
  }

  if (product.category === "gob3") {
    return FOOD_IMAGES.gob3;
  }

  if (product.category === "waakye") {
    return FOOD_IMAGES.waakye;
  }

  return FOOD_IMAGES.stew;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  onClick,
}) {
  const image = getProductImage(product);

  return (
    <button
      onClick={onClick}
      className="
        group text-left
        bg-[#FFFBEF]
        rounded-[1.5rem]
        overflow-hidden
        border border-black/[.06]
        shadow-[0_12px_35px_rgba(25,21,15,.07)]
        hover:shadow-[0_20px_45px_rgba(25,21,15,.13)]
        hover:-translate-y-1
        transition-all
      "
    >

      <div className="relative aspect-[1.12] overflow-hidden">

        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
        />

        {product.popular && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#FFFBEF]/90 backdrop-blur text-[10px] font-black uppercase tracking-wider">
            Popular
          </div>
        )}

        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#FFFBEF] flex items-center justify-center shadow-lg">
          <Plus size={19} />
        </div>

      </div>

      <div className="p-5">

        <div className="flex justify-between gap-3">

          <h3
            className="font-bold text-lg"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            {product.name}
          </h3>

          <span className="font-black whitespace-nowrap">
            {money(product.price)}
          </span>

        </div>

        <p className="mt-2 text-xs leading-5 text-black/50">
          {product.includes.join(" · ")}
        </p>

      </div>

    </button>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({
  products,
  setPage,
  openProduct,
}) {
  const popular = products.filter(
    (product) => product.popular
  );

  return (
    <>
      <Hero setPage={setPage} />

      {/* POPULAR */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">

        <div className="flex items-end justify-between mb-9">

          <div>

            <p
              className="text-xs uppercase tracking-[.2em] font-black mb-3"
              style={{
                color: T.green,
              }}
            >
              Customer favourites
            </p>

            <h2
              className="text-4xl md:text-5xl font-black"
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              <span style={{ color: T.black }}>Popular</span>{" "}
              <span style={{ color: T.green }}>right now</span>
            </h2>

          </div>

          <button
            onClick={() => setPage("menu")}
            className="hidden sm:flex items-center gap-2 font-bold text-sm"
          >
            View menu
            <ArrowRight size={16} />
          </button>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {popular.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openProduct(product)}
            />
          ))}

        </div>

      </section>

      {/* BRAND SECTION */}

      <section className="bg-[#1A1400] text-[#FFFBEF] py-20 md:py-28">

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div>

            <p
              className="text-xs uppercase tracking-[.2em] font-black mb-4"
              style={{
                color: T.gold,
              }}
            >
              The City Beans way
            </p>

            <h2
              className="text-4xl md:text-6xl font-black leading-[.95]"
              style={{
                fontFamily: "Georgia, serif",
                color: T.green,
              }}
            >
              Big flavour.
              <br />
              Zero fuss.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-[#F5EABD]/80">
              Choose a pack, customize it with your favourite
              extras, tell us where to send it, and we take care
              of the rest.
            </p>

            <Button
              variant="orange"
              className="mt-8"
              onClick={() => setPage("menu")}
              icon={ArrowRight}
            >
              START YOUR ORDER
            </Button>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-[2rem] overflow-hidden aspect-[.82]">
              <img
                src={FOOD_IMAGES.waakye}
                alt="Waakye"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="rounded-[2rem] overflow-hidden aspect-[.82] mt-12">
              <img
                src={FOOD_IMAGES.gob3}
                alt="Gob3"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

        </div>

      </section>

      {/* CATEGORY DISCOVERY */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">

        <div className="text-center max-w-2xl mx-auto">

          <p
            className="text-xs uppercase tracking-[.2em] font-black mb-3"
            style={{
              color: T.green,
            }}
          >
            Find your favourite
          </p>

          <h2
            className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            <span style={{ color: T.black }}>What are you</span>{" "}
            <span style={{ color: T.green }}>craving?</span>
          </h2>

          <p className="mt-4 text-black/55">
            Classic Ghanaian comfort food, built into packs
            that make ordering simple.
          </p>

        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-10">

          {CATEGORIES
            .filter((category) => category.id !== "extras")
            .map((category) => {

              const image =
                category.id === "gob3"
                  ? FOOD_IMAGES.gob3
                  : category.id === "waakye"
                  ? FOOD_IMAGES.waakye
                  : FOOD_IMAGES.stew;

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setPage({
                      name: "menu",
                      category: category.id,
                    })
                  }
                  className="
                    relative
                    aspect-[1.15]
                    rounded-[1.7rem]
                    overflow-hidden
                    text-left
                    group
                  "
                >

                  <img
                    src={image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/0" />

                  <div className="absolute bottom-5 left-5 text-[#FFFBEF]">

                    <div
                      className="text-2xl font-black"
                      style={{
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {category.name}
                    </div>

                    <div className="text-xs text-[#FFFBEF]/70 mt-1">
                      {category.blurb}
                    </div>

                  </div>

                </button>
              );
            })}

        </div>

      </section>
    </>
  );
}

/* =========================================================
   MENU PAGE
========================================================= */

function MenuPage({
  products,
  activeCategory,
  setActiveCategory,
  openProduct,
  addExtraToCart,
}) {
  const isExtras = activeCategory === "extras";

  const filtered =
    activeCategory === "all"
      ? products.filter((product) => product.category !== "extras")
      : products.filter(
          (product) =>
            product.category === activeCategory
        );

  return (
    <main className="min-h-[70vh] bg-[#F5EABD]">

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-12 md:pb-20">

        <div className="max-w-2xl">

          <p
            className="text-xs uppercase tracking-[.2em] font-black"
            style={{
              color: T.green,
            }}
          >
            Our menu
          </p>

          <h1
            className="text-5xl md:text-7xl font-black mt-3"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            <span style={{ color: T.black }}>Pick your</span>{" "}
            <span style={{ color: T.green }}>pack.</span>
          </h1>

          <p className="mt-5 text-black/55 max-w-xl">
            Choose your meal, customize it with extras,
            then checkout for delivery or pickup.
          </p>

        </div>

        <CategoryRail
          active={activeCategory}
          setActive={setActiveCategory}
        />

        {!isExtras ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProduct(product)}
              />
            ))}

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">

            {filtered.map((extra) => (

              <div
                key={extra.id}
                className="bg-[#FFFBEF] rounded-2xl p-5 border border-black/5"
              >

                <div className="text-3xl mb-2">
                  {extra.icon}
                </div>

                <h3 className="font-bold">
                  {extra.name}
                </h3>

                <div className="mt-1 font-black">
                  {money(extra.price)}
                </div>

                <button
                  onClick={() => addExtraToCart(extra)}
                  className="mt-4 w-full py-2.5 rounded-full text-xs font-black text-[#FFFBEF]"
                  style={{
                    background: T.green,
                  }}
                >
                  ADD
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

/* =========================================================
   PRODUCT MODAL
========================================================= */

function ProductModal({
  product,
  onClose,
  onAdd,
}) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState([]);

  if (!product) return null;

  const extras = product.extrasList || [];

  const extraTotal = selected.reduce(
    (sum, id) => sum + extras.find((e) => e.id === id).price,
    0
  );

  const total =
    (product.price + extraTotal) * qty;

  const toggle = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5">

      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-[#F5EABD] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl">

        <div className="sticky top-0 z-10 p-4 flex justify-between bg-[#F5EABD]/95 backdrop-blur border-b border-black/5">

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-[#FFFBEF] flex items-center justify-center"
            aria-label="Back"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-[#FFFBEF] flex items-center justify-center"
            aria-label="Close"
          >
            <X />
          </button>

        </div>

        <div className="p-5 md:p-8">

          <div className="aspect-[16/8] rounded-2xl overflow-hidden">

            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover"
            />

          </div>

          <div className="mt-6 flex justify-between gap-4">

            <div>

              <h2
                className="text-3xl font-black"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                {product.name}
              </h2>

              <p className="text-sm text-black/55 mt-2">
                Includes:{" "}
                {product.includes.join(", ")}
              </p>

            </div>

            <b className="text-xl">
              {money(product.price)}
            </b>

          </div>

          <div className="mt-7 flex justify-between items-center">

            <b>Quantity</b>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
                className="h-9 w-9 rounded-full bg-[#FFFBEF] border flex items-center justify-center"
              >
                <Minus size={15} />
              </button>

              <b>{qty}</b>

              <button
                onClick={() =>
                  setQty((q) => q + 1)
                }
                className="h-9 w-9 rounded-full text-[#FFFBEF] flex items-center justify-center"
                style={{
                  background: T.green,
                }}
              >
                <Plus size={15} />
              </button>

            </div>

          </div>

          <div className="mt-7">

            <b>Customize with extras</b>

            <div className="grid sm:grid-cols-2 gap-2 mt-3">

              {extras.map((extra) => (

                <label
                  key={extra.id}
                  className={`
                    p-3 rounded-xl bg-[#FFFBEF] border
                    flex items-center justify-between
                    cursor-pointer
                    ${
                      selected.includes(extra.id)
                        ? "border-[#609223] ring-1 ring-[#609223]"
                        : ""
                    }
                  `}
                >

                  <span className="flex gap-2 items-center">

                    <input
                      type="checkbox"
                      checked={selected.includes(
                        extra.id
                      )}
                      onChange={() =>
                        toggle(extra.id)
                      }
                    />

                    {extra.name}

                  </span>

                  <span className="text-sm font-bold">
                    +{money(extra.price)}
                  </span>

                </label>

              ))}

            </div>

          </div>

          <div className="mt-7 p-5 rounded-2xl bg-[#FFFBEF]">

            <div className="flex justify-between text-sm text-black/55">

              <span>Subtotal</span>

              <span>
                {money(product.price * qty)}
              </span>

            </div>

            <div className="flex justify-between text-sm text-black/55 mt-2">

              <span>Extras</span>

              <span>
                {money(extraTotal * qty)}
              </span>

            </div>

            <div className="flex justify-between font-black text-lg mt-4 pt-4 border-t border-dashed">

              <span>Total</span>

              <span>
                {money(total)}
              </span>

            </div>

          </div>

          <Button
            className="w-full mt-5"
            onClick={() => {

              onAdd({
                cartId: `${product.id}-${Date.now()}`,
                productId: product.id,
                name: product.name,
                basePrice: product.price,
                image: getProductImage(product),
                qty,
                extras: selected.map(
                  (id) => extras.find((e) => e.id === id)
                ),
                lineTotal: total,
              });

              onClose();

            }}
            icon={ShoppingBag}
          >
            ADD TO CART
          </Button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   CART
========================================================= */

function CartPage({
  cart,
  updateQty,
  removeItem,
  setPage,
}) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const delivery = cart.length ? 10 : 0;

  const total = subtotal + delivery;

  if (!cart.length) {

    return (
      <div className="max-w-xl mx-auto text-center py-28 px-5">

        <ShoppingBag
          size={45}
          className="mx-auto mb-5 opacity-40"
        />

        <h1
          className="text-4xl font-black"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Your cart is empty.
        </h1>

        <p className="mt-3 text-black/50">
          Pick something delicious from the menu.
        </p>

        <Button
          className="mt-7"
          onClick={() => setPage("menu")}
        >
          BROWSE MENU
        </Button>

      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">

      <h1
        className="text-5xl font-black"
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Your cart
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-9">

        <div className="space-y-3">

          {cart.map((item) => {

            return (
              <div
                key={item.cartId}
                className="bg-[#FFFBEF] rounded-2xl p-4 border border-black/5 flex gap-4"
              >

                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">

                  <img
                    src={item.image || FOOD_IMAGES.stew}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                </div>

                <div className="flex-1">

                  <div className="flex justify-between gap-3">

                    <div>

                      <b>{item.name}</b>

                      <p className="text-xs text-black/45 mt-1">

                        {item.extras?.length
                          ? "+ " +
                            item.extras
                              .map(
                                (extra) =>
                                  extra.name
                              )
                              .join(", ")
                          : "Standard pack"}

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.cartId)
                      }
                      aria-label="Remove item"
                    >
                      <Trash2
                        size={17}
                        className="opacity-50"
                      />
                    </button>

                  </div>

                  <div className="mt-4 flex justify-between items-center">

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          updateQty(
                            item.cartId,
                            -1
                          )
                        }
                        className="h-7 w-7 rounded-full border flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="text-sm font-bold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(
                            item.cartId,
                            1
                          )
                        }
                        className="h-7 w-7 rounded-full text-[#FFFBEF] flex items-center justify-center"
                        style={{
                          background: T.green,
                        }}
                      >
                        <Plus size={12} />
                      </button>

                    </div>

                    <b>
                      {money(item.lineTotal)}
                    </b>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        <div className="h-fit bg-[#E3D9AF] rounded-2xl p-6">

          <b className="text-lg">
            Order summary
          </b>

          <div className="flex justify-between text-sm mt-6">

            <span>Subtotal</span>

            <span>
              {money(subtotal)}
            </span>

          </div>

          <div className="flex justify-between text-sm mt-2">

            <span>Delivery</span>

            <span>
              {money(delivery)}
            </span>

          </div>

          <div className="border-t border-black/15 mt-4 pt-4 flex justify-between font-black text-xl">

            <span>Total</span>

            <span>
              {money(total)}
            </span>

          </div>

          <Button
            className="w-full mt-6"
            onClick={() => setPage("checkout")}
            icon={ArrowRight}
          >
            CHECKOUT
          </Button>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   TRACK ORDER
========================================================= */

const PICKUP_STEPS = [
  { key: "received", label: "Order received", statuses: ["PENDING", "CONFIRMED"] },
  { key: "preparing", label: "Preparing", statuses: ["PREPARING"] },
  { key: "ready", label: "Ready for pickup", statuses: ["READY_FOR_PICKUP"] },
  { key: "picked_up", label: "Picked up", statuses: ["PICKED_UP", "DELIVERED"] },
];

const DELIVERY_STEPS = [
  { key: "received", label: "Order received", statuses: ["PENDING", "CONFIRMED"] },
  { key: "preparing", label: "Preparing", statuses: ["PREPARING"] },
  { key: "rider", label: "Rider assigned", statuses: ["RIDER_ASSIGNED"] },
  { key: "picked_up", label: "Picked up", statuses: ["PICKED_UP"] },
  { key: "out", label: "Out for delivery", statuses: ["OUT_FOR_DELIVERY"] },
  { key: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
];

function TrackOrderPage({ setPage, prefill }) {
  const [orderNumber, setOrderNumber] = useState(prefill?.orderNumber || "");
  const [phone, setPhone] = useState(prefill?.phone || "");
  const { order, loading, error, trackOrder } = useOrderTracking();
  const autoSubmitted = React.useRef(false);

  React.useEffect(() => {
    if (prefill?.orderNumber && prefill?.phone && !autoSubmitted.current) {
      autoSubmitted.current = true;
      trackOrder(prefill.orderNumber, prefill.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    trackOrder(orderNumber, phone);
  };

  const steps = order?.method === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = order ? steps.findIndex((s) => s.statuses.includes(order.status)) : -1;
  const isCancelled = order?.status === "CANCELLED";

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
      <h1 className="text-4xl font-black" style={{ fontFamily: "Georgia, serif" }}>
        Track your order
      </h1>
      <p className="mt-3 text-black/55 text-sm">
        Enter your order number and the phone number you checked out with.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <Input
          label="Order number"
          placeholder="CB-1049"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <Input
          label="Phone number"
          placeholder="024 XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button type="submit" disabled={loading || !orderNumber.trim() || !phone.trim()}>
          {loading ? "Searching…" : "TRACK ORDER"}
        </Button>
      </form>

      {error && (
        <p className="mt-5 text-sm" style={{ color: "#C24A3D" }}>{error}</p>
      )}

      {order && (
        <div className="mt-8 bg-[#FFFBEF] rounded-2xl border border-black/10 p-6">
          <div className="font-black text-lg" style={{ fontFamily: "Georgia, serif" }}>
            {order.order_number}
          </div>
          <div className="text-xs text-black/50 mt-1">
            {order.guest_name} · {money(Number(order.total))}
            {order.area ? ` · ${order.area}` : ""}
          </div>

          {isCancelled ? (
            <div className="mt-5 rounded-xl p-4 text-sm font-semibold" style={{ background: "#F7E1DD", color: "#C24A3D" }}>
              This order was cancelled.
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {steps.map((step, i) => {
                const done = i < currentIndex;
                const current = i === currentIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        background: done || current ? T.green : "#E5DCC3",
                        color: done || current ? T.paper : "#8a7f5c",
                      }}
                    >
                      {done ? "✓" : ""}
                    </div>
                    <span
                      className={`text-sm ${current ? "font-bold" : done ? "" : "opacity-50"}`}
                      style={{ color: T.ink }}
                    >
                      {step.label}
                      {current ? " — current" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {order.items?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-dashed border-black/15 text-sm text-black/60">
              {order.items.map((it, idx) => (
                <div key={idx}>{it.quantity} × {it.name}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setPage("home")}
        className="mt-8 text-sm font-bold underline"
        style={{ color: T.ink }}
      >
        Back home
      </button>
    </main>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  ...props
}) {
  return (
    <label className="block">

      <span className="text-xs font-bold text-black/55">
        {label}
      </span>

      <input
        {...props}
        className="
          mt-1.5
          w-full
          rounded-xl
          bg-[#FFFBEF]
          border border-black/10
          px-4 py-3.5
          outline-none
          focus:ring-2
          focus:ring-[#609223]/25
        "
      />

    </label>
  );
}

/* =========================================================
   LOCATION SEARCH
   Curated to the areas City Beans actually delivers to
   (Kotei / around KNUST, Kumasi) — a searchable list rather
   than free-text address entry or a full maps API.
========================================================= */

function LocationSearchInput({ zones, zoneId, setZoneId, loading }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = zones.find((z) => z.id === zoneId);

  React.useEffect(() => {
    if (selected) setQuery(selected.name);
  }, [selected?.id]);

  const filtered =
    query.trim() === ""
      ? zones
      : zones.filter((z) =>
          z.name.toLowerCase().includes(query.trim().toLowerCase())
        );

  return (
    <div className="relative">
      <span className="text-xs font-bold text-black/55">
        Your area (Kumasi — around KNUST)
      </span>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setZoneId("");
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={loading ? "Loading areas…" : "Search — e.g. Ayeduase, Bomso, Kentinkrono"}
        className="mt-1.5 w-full rounded-xl bg-[#FFFBEF] border border-black/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#609223]/25"
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl bg-[#FFFBEF] border border-black/10 shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((z) => (
              <button
                key={z.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setZoneId(z.id);
                  setQuery(z.name);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5EABD] flex items-center justify-between"
              >
                <span>{z.name}</span>
                <span className="opacity-50 text-xs">{money(z.fee)}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-black/45">
              We don't deliver there yet — currently serving areas around KNUST, Kumasi.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CHECKOUT
========================================================= */

function CheckoutPage({
  cart,
  setPage,
  onClear,
}) {
  const [method, setMethod] =
    useState("delivery");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    ghanaPostGPS: "",
    houseDesc: "",
    instructions: "",
  });

  const [zoneId, setZoneId] = useState("");
  const { zones, loading: zonesLoading } = useDeliveryZones();
  const { createOrder, submitting, error: orderError } = useCreateOrder();
  const { phase, error: paymentError, payForOrder } = usePaystackPayment();

  const [orderResult, setOrderResult] = useState(null); // from create_order — has subtotal/fee/total for the receipt
  const [receiptItems, setReceiptItems] = useState([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const selectedZone = zones.find((z) => z.id === zoneId);
  const delivery =
    method === "delivery" ? (selectedZone?.fee ?? 0) : 0;

  const total = subtotal + delivery;

  const set = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
  };

  const can =
    form.fullName.trim() &&
    form.phone.trim() &&
    (
      method === "pickup" ||
      zoneId
    );

  const handlePlaceOrder = async () => {
    const result = await createOrder({
      cart,
      method,
      zoneId,
      zoneName: selectedZone?.name,
      form,
    });
    if (!result) return;

    setReceiptItems(cart); // snapshot before the cart gets cleared below
    setOrderResult(result);
    onClear();

    payForOrder({
      orderId: result.order_id,
      orderNumber: result.order_number,
      phone: form.phone,
      email: form.email,
    });
  };

  const retryPayment = () => {
    payForOrder({
      orderId: orderResult.order_id,
      orderNumber: orderResult.order_number,
      phone: form.phone,
      email: form.email,
    });
  };

  // ---- Payment in progress / not yet confirmed ----
  if (orderResult && phase !== "idle" && phase !== "done") {

    return (
      <div className="max-w-lg mx-auto pt-32 md:pt-40 pb-16 px-5 text-center">

        {(phase === "opening" || phase === "confirming") && (
          <>
            <div className="h-10 w-10 mx-auto mb-5 rounded-full border-4 border-[#609223] border-t-transparent animate-spin" />
            <h1 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif" }}>
              {phase === "opening" ? "Starting payment…" : "Confirming your payment…"}
            </h1>
            <p className="mt-2 text-sm text-black/55">
              Order {orderResult.order_number} — {money(orderResult.total)}
            </p>
          </>
        )}

        {phase === "not_completed" && (
          <>
            <h1 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif" }}>Payment not completed</h1>
            <p className="mt-2 text-sm text-black/55">
              Your order {orderResult.order_number} is saved — you can try paying again.
            </p>
            <Button className="mt-6" onClick={retryPayment}>TRY PAYMENT AGAIN</Button>
          </>
        )}

        {phase === "slow" && (
          <>
            <h1 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif" }}>Still confirming…</h1>
            <p className="mt-2 text-sm text-black/55">
              This is taking longer than usual. Your order {orderResult.order_number} is saved —
              check Track Order in a moment, or contact us if it doesn't update.
            </p>
            <Button className="mt-6" onClick={() => setPage({ name: "track", orderNumber: orderResult.order_number, phone: form.phone })}>
              TRACK THIS ORDER
            </Button>
          </>
        )}

        {phase === "error" && (
          <>
            <h1 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif" }}>Something went wrong</h1>
            <p className="mt-2 text-sm" style={{ color: "#C24A3D" }}>{paymentError}</p>
            <Button className="mt-6" onClick={retryPayment}>TRY AGAIN</Button>
          </>
        )}

      </div>
    );
  }

  if (phase === "done" && orderResult) {

    const placedOrder = orderResult;
    const now = new Date();

    return (
      <div className="max-w-xl mx-auto pt-32 md:pt-40 pb-16 px-5">

        <style>{`
          @media print {
            body * { visibility: hidden; }
            #cb-receipt, #cb-receipt * { visibility: visible; }
            #cb-receipt { position: absolute; top: 0; left: 0; width: 100%; padding: 24px; }
            .cb-no-print { display: none !important; }
          }
        `}</style>

        <div className="text-center mb-8 cb-no-print">
          <div
            className="h-16 w-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "#E4EBD9" }}
          >
            <CircleCheck size={32} style={{ color: T.green }} />
          </div>
          <h1
            className="text-3xl font-black mt-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Payment confirmed.
          </h1>
          <p className="mt-3 text-black/55 text-sm">
            Your payment has been verified — City Beans is preparing your order.
          </p>
        </div>

        <div id="cb-receipt" className="bg-[#FFFBEF] rounded-2xl border border-black/10 p-6">
          <div className="flex items-center justify-between border-b border-dashed border-black/15 pb-4 mb-4">
            <div>
              <div className="font-black text-lg" style={{ fontFamily: "Georgia, serif" }}>City Beans</div>
              <div className="text-xs text-black/50">{LOCATION}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">{placedOrder.order_number}</div>
              <div className="text-xs text-black/50">{now.toLocaleDateString()} {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>

          <div className="text-sm mb-4">
            <div><span className="text-black/50">Customer:</span> {form.fullName}</div>
            <div><span className="text-black/50">Phone:</span> {form.phone}</div>
            <div>
              <span className="text-black/50">
                {method === "delivery" ? "Delivery to:" : "Pickup from:"}
              </span>{" "}
              {method === "delivery"
                ? `${selectedZone?.name}, Kumasi${form.houseDesc ? ` — ${form.houseDesc}` : ""}`
                : LOCATION}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-dashed border-black/15 pt-4">
            {receiptItems.map((item) => (
              <div key={item.cartId} className="flex justify-between text-sm gap-3">
                <div>
                  <div>{item.qty} × {item.name}</div>
                  {item.extras?.length > 0 && (
                    <div className="text-xs text-black/45">+ {item.extras.map((e) => e.name).join(", ")}</div>
                  )}
                </div>
                <div className="font-semibold whitespace-nowrap">{money(item.lineTotal)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-black/15 mt-4 pt-4">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(placedOrder.subtotal)}</span></div>
            <div className="flex justify-between text-sm mt-1"><span>Delivery</span><span>{money(placedOrder.delivery_fee)}</span></div>
            <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t border-black/15">
              <span>Total</span><span>{money(placedOrder.total)}</span>
            </div>
          </div>

          <div className="text-center text-xs text-black/40 mt-6 pt-4 border-t border-dashed border-black/15">
            Thank you for ordering from City Beans — {PHONES.join(" · ")}
          </div>
        </div>

        <div className="flex gap-3 mt-6 cb-no-print">
          <Button variant="light" className="flex-1" onClick={() => window.print()}>
            PRINT / SAVE RECEIPT
          </Button>
          <Button className="flex-1" onClick={() => setPage("home")}>
            BACK HOME
          </Button>
        </div>

        <button
          onClick={() => setPage({ name: "track", orderNumber: placedOrder.order_number, phone: form.phone })}
          className="cb-no-print block w-full text-center mt-4 text-sm font-bold underline"
          style={{ color: T.green }}
        >
          Track this order
        </button>

      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">

      <h1
        className="text-5xl font-black"
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-9">

        <div className="space-y-6">

          {/* DETAILS */}

          <div className="bg-[#FFFBEF] p-6 rounded-2xl border border-black/5">

            <h3 className="font-black text-lg">
              Your details
            </h3>

            <div className="grid sm:grid-cols-2 gap-3 mt-5">

              <Input
                label="Full name"
                value={form.fullName}
                onChange={set("fullName")}
              />

              <Input
                label="Phone number"
                placeholder="024 XXX XXXX"
                value={form.phone}
                onChange={set("phone")}
              />

              <Input
                label="Email (optional)"
                value={form.email}
                onChange={set("email")}
              />

            </div>

          </div>

          {/* DELIVERY */}

          <div className="bg-[#FFFBEF] p-6 rounded-2xl border border-black/5">

            <h3 className="font-black text-lg">
              Delivery method
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                onClick={() =>
                  setMethod("delivery")
                }
                className="rounded-xl p-4 border font-bold"
                style={{
                  background:
                    method === "delivery"
                      ? T.green
                      : T.paper,

                  color:
                    method === "delivery"
                      ? T.paper
                      : T.ink,
                }}
              >
                <Truck
                  className="mx-auto mb-2"
                  size={20}
                />

                Delivery
              </button>

              <button
                onClick={() =>
                  setMethod("pickup")
                }
                className="rounded-xl p-4 border font-bold"
                style={{
                  background:
                    method === "pickup"
                      ? T.green
                      : T.paper,

                  color:
                    method === "pickup"
                      ? T.paper
                      : T.ink,
                }}
              >
                <Store
                  className="mx-auto mb-2"
                  size={20}
                />

                Pickup
              </button>

            </div>

            {method === "delivery" ? (

              <div className="grid sm:grid-cols-2 gap-3 mt-5">

                <div className="sm:col-span-2">
                  <LocationSearchInput
                    zones={zones}
                    zoneId={zoneId}
                    setZoneId={setZoneId}
                    loading={zonesLoading}
                  />
                </div>

                <Input
                  label="GhanaPostGPS address"
                  value={form.ghanaPostGPS}
                  onChange={set("ghanaPostGPS")}
                  placeholder="GA-XXXX-XXXX"
                />

                <Input
                  label="House / building description"
                  value={form.houseDesc}
                  onChange={set("houseDesc")}
                />

                <Input
                  label="Additional instructions"
                  value={form.instructions}
                  onChange={set("instructions")}
                />

              </div>

            ) : (

              <div className="mt-5 rounded-xl p-4 bg-[#F5EABD] flex gap-3">

                <MapPin
                  style={{
                    color: T.green,
                  }}
                />

                <div>

                  <b>
                    Pickup location
                  </b>

                  <p className="text-sm text-black/55">
                    {LOCATION}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* SUMMARY */}

        <aside className="h-fit bg-[#E3D9AF] p-6 rounded-2xl">

          <b className="text-lg">
            Order summary
          </b>

          {cart.map((item) => (

            <div
              key={item.cartId}
              className="flex justify-between gap-3 text-sm mt-4"
            >

              <span>
                {item.qty} × {item.name}
              </span>

              <span>
                {money(item.lineTotal)}
              </span>

            </div>

          ))}

          <div className="flex justify-between text-sm mt-6">

            <span>Delivery</span>

            <span>
              {method === "delivery" && !zoneId
                ? "Select a zone"
                : money(delivery)}
            </span>

          </div>

          <div className="border-t border-black/15 mt-4 pt-4 flex justify-between font-black text-xl">

            <span>Total</span>

            <span>
              {money(total)}
            </span>

          </div>

          {orderError && (
            <p className="text-sm mt-4" style={{ color: "#C24A3D" }}>
              {orderError}
            </p>
          )}

          <Button
            disabled={!can || submitting || !!orderResult}
            className="w-full mt-6"
            variant="orange"
            onClick={handlePlaceOrder}
          >
            {submitting ? "PLACING ORDER…" : `PAY ${money(total)} WITH PAYSTACK`}
          </Button>

          <p className="text-[10px] text-black/40 text-center mt-3">
            Prices and delivery fee are recalculated server-side, and payment
            is verified directly with Paystack before your order is confirmed.
          </p>

        </aside>

      </div>

    </main>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer({ setPage }) {
  return (
    <footer className="bg-[#1A1400] text-[#FFFBEF]">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="lg:col-span-2">

          <Logo dark />

          <p className="mt-5 max-w-sm text-sm leading-6 text-[#F5EABD]/70">
            Fresh Ghanaian meals, prepared with care
            and served the City Beans way.
          </p>

          <div className="mt-6 flex gap-3">

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with City Beans on WhatsApp"
              className="h-10 w-10 rounded-full bg-[#FFFBEF]/10 flex items-center justify-center hover:bg-[#FFFBEF]/20 transition"
            >
              <WhatsAppIcon size={18} />
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="City Beans on Instagram"
              className="h-10 w-10 rounded-full bg-[#FFFBEF]/10 flex items-center justify-center hover:bg-[#FFFBEF]/20 transition"
            >
              <InstagramIcon size={18} />
            </a>

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="City Beans on TikTok"
              className="h-10 w-10 rounded-full bg-[#FFFBEF]/10 flex items-center justify-center hover:bg-[#FFFBEF]/20 transition"
            >
              <TikTokIcon size={18} />
            </a>

          </div>

        </div>

        <div>

          <b className="text-xs uppercase tracking-[.18em] text-[#F5EABD]/60">
            Visit
          </b>

          <p className="mt-5 text-sm text-[#F5EABD]/85">
            {LOCATION}
          </p>

          <p className="mt-3 text-sm text-[#F5EABD]/85">
            Delivery & pickup available
          </p>

          <button
            onClick={() => setPage("track")}
            className="block mt-4 text-sm font-bold"
            style={{ color: T.green }}
          >
            Track your order
          </button>

        </div>

        <div>

          <b className="text-xs uppercase tracking-[.18em] text-[#F5EABD]/60">
            Contact
          </b>

          <a
            href={`tel:${PHONES[0].replace(/\s/g, "")}`}
            className="block mt-5 text-sm text-[#F5EABD]/85 hover:text-[#FFFBEF] transition"
          >
            {PHONES[0]}
          </a>

          <a
            href={`tel:${PHONES[1].replace(/\s/g, "")}`}
            className="block mt-2 text-sm text-[#F5EABD]/85 hover:text-[#FFFBEF] transition"
          >
            {PHONES[1]}
          </a>

        </div>

      </div>

      <div className="border-t border-white/10 text-center py-5 text-[11px] text-[#F5EABD]/50">
        © {new Date().getFullYear()} City Beans. All rights reserved.
      </div>

    </footer>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function CityBeansApp() {

  const [page, setPage] =
    useState("home");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [modalProduct, setModalProduct] =
    useState(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [cart, setCart] =
    useState([]);

  const [trackPrefill, setTrackPrefill] =
    useState(null);

  const { products, loading, error } = useMenuData();

  /* Handle category navigation + track-order navigation */

  useEffect(() => {

    if (typeof page === "object") {

      if (page.name === "track") {
        setTrackPrefill({ orderNumber: page.orderNumber, phone: page.phone });
        setPage("track");
        return;
      }

      setActiveCategory(
        page.category || "all"
      );

      setPage("menu");
    }

  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EABD]">
        <div className="text-center">
          <div className="h-10 w-10 mx-auto mb-4 rounded-full border-4 border-[#609223] border-t-transparent animate-spin" />
          <p className="text-sm text-black/50">Loading the menu…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EABD] px-6 text-center">
        <p className="text-black/60">
          Couldn't load the menu right now. Please refresh the page.
        </p>
      </div>
    );
  }

  /* Add product */

  const addToCart = (item) => {

    setCart((current) => [
      ...current,
      item,
    ]);

  };

  /* Add extra */

  const addExtraToCart = (extra) => {

    setCart((current) => [
      ...current,

      {
        cartId: `${extra.id}-${Date.now()}`,
        productId: extra.id,
        name: extra.name,
        basePrice: extra.price,
        qty: 1,
        extras: [],
        lineTotal: extra.price,
      },

    ]);

  };

  /* Update quantity */

  const updateQty = (id, delta) => {

    setCart((current) =>
      current.map((item) => {

        if (item.cartId !== id) {
          return item;
        }

        const newQty = Math.max(
          1,
          item.qty + delta
        );

        const unitPrice =
          item.lineTotal / item.qty;

        return {
          ...item,
          qty: newQty,
          lineTotal:
            unitPrice * newQty,
        };

      })
    );

  };

  /* Remove item */

  const removeItem = (id) => {

    setCart((current) =>
      current.filter(
        (item) =>
          item.cartId !== id
      )
    );

  };

  /* Cart values */

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  return (
    <div
      className="min-h-screen bg-[#F5EABD] text-[#1A1400]"
      style={{
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
          }

          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .no-scrollbar {
            scrollbar-width: none;
          }

          button,
          input {
            font: inherit;
          }
        `}
      </style>

      <Header
        page={
          typeof page === "string"
            ? page
            : "menu"
        }
        setPage={setPage}
        cartCount={cartCount}
        setMobileOpen={setMobileOpen}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        setPage={setPage}
      />

      {page === "home" && (
        <Home
          products={products}
          setPage={setPage}
          openProduct={setModalProduct}
        />
      )}

      {page === "menu" && (
        <MenuPage
          products={products}
          activeCategory={activeCategory}
          setActiveCategory={
            setActiveCategory
          }
          openProduct={
            setModalProduct
          }
          addExtraToCart={
            addExtraToCart
          }
        />
      )}

      {page === "cart" && (
        <CartPage
          cart={cart}
          updateQty={updateQty}
          removeItem={removeItem}
          setPage={setPage}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          setPage={setPage}
          onClear={() =>
            setCart([])
          }
        />
      )}

      {page === "track" && (
        <TrackOrderPage
          setPage={setPage}
          prefill={trackPrefill}
        />
      )}

      <Footer setPage={setPage} />

      <ProductModal
        product={modalProduct}
        onClose={() =>
          setModalProduct(null)
        }
        onAdd={addToCart}
      />

    </div>
  );
}
