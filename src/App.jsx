import React, { useEffect, useState } from "react";
import cityBeansLogoCream from "./assets/cream.png";
import cityBeansLogoDark from "./assets/dark.png";
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
   EXTRAS
========================================================= */

const EXTRAS = {
  chicken: {
    id: "chicken",
    name: "Chicken",
    price: 10,
  },
  fish: {
    id: "fish",
    name: "Fish",
    price: 10,
  },
  egg: {
    id: "egg",
    name: "Egg",
    price: 5,
  },
  sausage: {
    id: "sausage",
    name: "Sausage",
    price: 5,
  },
  avocado: {
    id: "avocado",
    name: "Avocado",
    price: 10,
  },
  meat: {
    id: "meat",
    name: "Meat",
    price: 6,
  },
  salad: {
    id: "salad",
    name: "Salad",
    price: 5,
  },
  wele: {
    id: "wele",
    name: "Wele",
    price: 5,
  },
  kckcc: {
    id: "kckcc",
    name: "KCKCC",
    price: 10,
  },
  rice: {
    id: "rice",
    name: "Rice",
    price: 15,
  },
  creamySalad: {
    id: "creamySalad",
    name: "Creamy Salad",
    price: 20,
  },
  waakyeExtra: {
    id: "waakyeExtra",
    name: "Waakye",
    price: 15,
  },
  gob3Extra: {
    id: "gob3Extra",
    name: "Gob3",
    price: 15,
  },
  beansStewExtra: {
    id: "beansStewExtra",
    name: "Beans Stew",
    price: 25,
  },
};

/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [
  /* ---------------- GOB3 ---------------- */

  {
    id: "menkoaa",
    category: "gob3",
    name: "Menkoaa Pack",
    price: 30,
    includes: ["Beans", "KCKCC", "Egg / Sausage"],
    extraIds: ["chicken", "fish", "avocado", "sausage", "egg"],
    popular: false,
  },

  {
    id: "boysboys",
    category: "gob3",
    name: "Boys Boys Pack",
    price: 45,
    includes: ["Beans", "Rice", "KCKCC", "Egg / Sausage"],
    extraIds: ["chicken", "fish", "avocado", "sausage", "egg"],
    popular: false,
  },

  {
    id: "daavi",
    category: "gob3",
    name: "Daavi Pack",
    price: 55,
    includes: [
      "Beans",
      "Rice",
      "KCKCC",
      "Egg / Sausage",
      "Chicken / Fish",
    ],
    extraIds: ["chicken", "fish", "avocado", "sausage"],
    popular: true,
  },

  {
    id: "borga",
    category: "gob3",
    name: "Borga Pack",
    price: 80,
    includes: [
      "Beans",
      "Rice",
      "KCKCC",
      "Egg",
      "Sausage",
      "Chicken",
      "Fish",
      "Drink included",
    ],
    extraIds: ["avocado"],
    popular: false,
  },

  /* ---------------- WAAKYE ---------------- */

  {
    id: "naawa",
    category: "waakye",
    name: "Naawa Pack",
    price: 45,
    includes: [
      "Waakye",
      "Wele",
      "Egg",
      "KCKCC",
      "Spag",
      "Salad",
    ],
    extraIds: ["chicken", "fish", "avocado", "egg", "sausage"],
    popular: false,
  },

  {
    id: "amalia",
    category: "waakye",
    name: "Amalia Pack",
    price: 55,
    includes: [
      "Waakye",
      "Meat",
      "Egg",
      "Wele",
      "Sausage",
      "KCKCC",
      "Spag",
      "Salad",
    ],
    extraIds: ["chicken", "fish", "avocado"],
    popular: false,
  },

  {
    id: "city",
    category: "waakye",
    name: "City Pack",
    price: 65,
    includes: [
      "Waakye",
      "Meat",
      "Wele",
      "Fish",
      "Egg",
      "Sausage",
      "KCKCC",
      "Spag",
      "Salad",
    ],
    extraIds: ["chicken", "avocado"],
    popular: true,
  },

  {
    id: "echoke",
    category: "waakye",
    name: "Echoke Pack",
    price: 99,
    includes: [
      "Waakye",
      "Meat",
      "Wele",
      "Fish",
      "Egg",
      "Sausage",
      "Chicken",
      "KCKCC",
      "Spag",
      "Salad",
      "Drink included",
    ],
    extraIds: ["avocado"],
    popular: true,
    note: "Choose creamy or normal salad",
  },

  /* ---------------- BEANS STEW ---------------- */

  {
    id: "me",
    category: "beans-stew",
    name: "Me Pack",
    price: 45,
    includes: ["Beans Stew", "Rice", "Egg", "Sausage"],
    extraIds: ["chicken", "fish", "avocado", "egg", "sausage"],
    popular: false,
  },

  {
    id: "pal",
    category: "beans-stew",
    name: "Pal Pack",
    price: 60,
    includes: [
      "Beans Stew",
      "Rice",
      "Egg",
      "Sausage",
      "Chicken",
    ],
    extraIds: ["fish", "avocado", "sausage"],
    popular: false,
  },

  {
    id: "bigman",
    category: "beans-stew",
    name: "Big Man Pack",
    price: 80,
    includes: [
      "Beans Stew",
      "Rice",
      "Egg",
      "Sausage",
      "Chicken",
      "Drink included",
    ],
    extraIds: ["avocado"],
    popular: true,
  },
];

/* =========================================================
   EXTRA PRODUCTS
========================================================= */

const EXTRA_PRODUCTS = [
  {
    id: "x-beansStew",
    name: "Beans Stew",
    price: 25,
  },
  {
    id: "x-creamySalad",
    name: "Creamy Salad",
    price: 20,
  },
  {
    id: "x-waakye",
    name: "Waakye",
    price: 15,
  },
  {
    id: "x-gob3",
    name: "Gob3",
    price: 15,
  },
  {
    id: "x-rice",
    name: "Rice",
    price: 15,
  },
  {
    id: "x-kckcc",
    name: "KCKCC",
    price: 10,
  },
  {
    id: "x-chicken",
    name: "Chicken",
    price: 10,
  },
  {
    id: "x-fish",
    name: "Fish",
    price: 10,
  },
  {
    id: "x-avocado",
    name: "Avocado",
    price: 10,
  },
  {
    id: "x-meat",
    name: "Meat",
    price: 6,
  },
  {
    id: "x-salad",
    name: "Salad",
    price: 5,
  },
  {
    id: "x-sausage",
    name: "Sausage",
    price: 5,
  },
  {
    id: "x-egg",
    name: "Egg",
    price: 5,
  },
  {
    id: "x-wele",
    name: "Wele",
    price: 5,
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

/* =========================================================
   FOOD IMAGES
========================================================= */

const FOOD_IMAGES = {
  hero: [
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&q=90",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=2000&q=90",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=2000&q=90",
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
  cream: "#F7F1E3",
  cream2: "#EFE5D0",
  ink: "#19150F",
  green: "#557A3B",
  greenDark: "#345325",
  brown: "#75573A",
  gold: "#B18A55",
  orange: "#D98A37",
  white: "#FFFDF8",
  black: "#11100D",
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
      color: T.white,
    },

    dark: {
      background: T.ink,
      color: T.white,
    },

    light: {
      background: T.white,
      color: T.ink,
      border: "1px solid rgba(25,21,15,.14)",
    },

    orange: {
      background: T.orange,
      color: T.white,
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
        fontFamily: "Inter, sans-serif",
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
      <div className="absolute top-0 left-0 right-0 z-50 text-white text-[10px] sm:text-xs text-center py-2 tracking-[.14em] uppercase bg-black/20 backdrop-blur-sm">
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
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white">

              <button
                onClick={() => setPage("home")}
                className={`relative py-2 transition ${
                  page === "home"
                    ? "text-white"
                    : "text-white/65 hover:text-white"
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
                    ? "text-white"
                    : "text-white/65 hover:text-white"
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
                    ? "text-white"
                    : "text-white/65 hover:text-white"
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
                      color: T.white,
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
                  text-white/80
                  hover:text-white
                  hover:bg-white/10
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
                  bg-white
                  text-[#19150F]
                  flex items-center
                  gap-2
                  text-sm
                  font-bold
                  hover:bg-[#F7F1E3]
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
                  bg-white/15
                  border border-white/20
                  text-white
                  flex items-center justify-center
                  backdrop-blur-sm
                  hover:bg-white/25
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
        className="absolute right-0 top-0 h-full w-[min(86vw,360px)] p-6 bg-[#F7F1E3] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center"
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
    <section className="relative min-h-[760px] md:min-h-[850px] overflow-hidden bg-[#19150F]">

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

      <div className="relative z-10 max-w-7xl mx-auto min-h-[650px] md:min-h-[720px] px-5 md:px-8 flex items-center">

        <div className="max-w-3xl text-white">

          <p className="text-xs md:text-sm uppercase tracking-[.25em] font-bold mb-6 text-white/75">
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

          <p className="mt-7 max-w-xl text-base md:text-lg leading-7 text-white/75">
            Freshly prepared Gob3, Waakye and Beans Stew —
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
              variant="light"
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
                  ? "w-10 bg-white"
                  : "w-5 bg-white/40"
              }
            `}
          />
        ))}

      </div>

      <div className="absolute bottom-7 right-5 md:right-8 hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-white/60">
        <span>Scroll</span>
        <div className="w-10 h-px bg-white/40" />
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
                  ? T.white
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
        bg-white
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
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-wider">
            Popular
          </div>
        )}

        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
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
  setPage,
  openProduct,
}) {
  const popular = PRODUCTS.filter(
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
              Popular right now
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

      <section className="bg-[#19150F] text-white py-20 md:py-28">

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
              }}
            >
              Big flavour.
              <br />
              Zero fuss.
            </h2>

            <p className="mt-6 max-w-md text-white/60 leading-7">
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
            What are you craving?
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

                  <div className="absolute bottom-5 left-5 text-white">

                    <div
                      className="text-2xl font-black"
                      style={{
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {category.name}
                    </div>

                    <div className="text-xs text-white/70 mt-1">
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
  activeCategory,
  setActiveCategory,
  openProduct,
  addExtraToCart,
}) {
  const isExtras = activeCategory === "extras";

  const products =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter(
          (product) =>
            product.category === activeCategory
        );

  return (
    <main className="min-h-[70vh] bg-[#F7F1E3]">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">

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
            Pick your pack.
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

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProduct(product)}
              />
            ))}

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">

            {EXTRA_PRODUCTS.map((extra) => (

              <div
                key={extra.id}
                className="bg-white rounded-2xl p-5 border border-black/5"
              >

                <h3 className="font-bold">
                  {extra.name}
                </h3>

                <div className="mt-1 font-black">
                  {money(extra.price)}
                </div>

                <button
                  onClick={() => addExtraToCart(extra)}
                  className="mt-4 w-full py-2.5 rounded-full text-xs font-black text-white"
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

  const extras = product.extraIds.map(
    (id) => EXTRAS[id]
  );

  const extraTotal = selected.reduce(
    (sum, id) => sum + EXTRAS[id].price,
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

      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-[#F7F1E3] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl">

        <div className="sticky top-0 z-10 p-4 flex justify-between bg-[#F7F1E3]/95 backdrop-blur border-b border-black/5">

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center"
            aria-label="Back"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center"
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
                className="h-9 w-9 rounded-full bg-white border flex items-center justify-center"
              >
                <Minus size={15} />
              </button>

              <b>{qty}</b>

              <button
                onClick={() =>
                  setQty((q) => q + 1)
                }
                className="h-9 w-9 rounded-full text-white flex items-center justify-center"
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
                    p-3 rounded-xl bg-white border
                    flex items-center justify-between
                    cursor-pointer
                    ${
                      selected.includes(extra.id)
                        ? "border-[#557A3B] ring-1 ring-[#557A3B]"
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

          <div className="mt-7 p-5 rounded-2xl bg-white">

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
                qty,
                extras: selected.map(
                  (id) => EXTRAS[id]
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

            const product = PRODUCTS.find(
              (p) => p.id === item.productId
            );

            return (
              <div
                key={item.cartId}
                className="bg-white rounded-2xl p-4 border border-black/5 flex gap-4"
              >

                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">

                  <img
                    src={
                      product
                        ? getProductImage(product)
                        : FOOD_IMAGES.stew
                    }
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
                        className="h-7 w-7 rounded-full text-white flex items-center justify-center"
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

        <div className="h-fit bg-[#EFE5D0] rounded-2xl p-6">

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
          bg-white
          border border-black/10
          px-4 py-3.5
          outline-none
          focus:ring-2
          focus:ring-[#557A3B]/25
        "
      />

    </label>
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
    region: "",
    city: "",
    area: "",
    ghanaPostGPS: "",
    houseDesc: "",
    instructions: "",
  });

  const [placed, setPlaced] =
    useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const delivery =
    method === "delivery" ? 10 : 0;

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
      (
        form.city.trim() &&
        form.area.trim()
      )
    );

  if (placed) {

    return (
      <div className="max-w-xl mx-auto text-center py-28 px-5">

        <div
          className="h-16 w-16 rounded-full mx-auto flex items-center justify-center"
          style={{
            background: "#E4EBD9",
          }}
        >
          <CircleCheck
            size={32}
            style={{
              color: T.green,
            }}
          />
        </div>

        <h1
          className="text-4xl font-black mt-6"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Order received.
        </h1>

        <p className="mt-3 text-black/55">
          Your order has been placed. In production,
          this step will verify the Paystack payment
          before sending the order to the kitchen.
        </p>

        <Button
          className="mt-7"
          onClick={() => {
            onClear();
            setPage("home");
          }}
        >
          BACK HOME
        </Button>

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

          <div className="bg-white p-6 rounded-2xl border border-black/5">

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

          <div className="bg-white p-6 rounded-2xl border border-black/5">

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
                      : T.white,

                  color:
                    method === "delivery"
                      ? T.white
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
                      : T.white,

                  color:
                    method === "pickup"
                      ? T.white
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

                <Input
                  label="Region"
                  value={form.region}
                  onChange={set("region")}
                />

                <Input
                  label="City / Town"
                  value={form.city}
                  onChange={set("city")}
                />

                <Input
                  label="Area"
                  value={form.area}
                  onChange={set("area")}
                />

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

              <div className="mt-5 rounded-xl p-4 bg-[#F7F1E3] flex gap-3">

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

        <aside className="h-fit bg-[#EFE5D0] p-6 rounded-2xl">

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
            disabled={!can}
            className="w-full mt-6"
            variant="orange"
            onClick={() => setPlaced(true)}
          >
            PAY {money(total)} WITH PAYSTACK
          </Button>

          <p className="text-[10px] text-black/40 text-center mt-3">
            Final prices and payment verification
            should be handled server-side in production.
          </p>

        </aside>

      </div>

    </main>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="bg-[#19150F] text-white">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="lg:col-span-2">

          <Logo dark />

          <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
            Fresh Ghanaian meals, prepared with care
            and served the City Beans way.
          </p>

          <div className="mt-6 flex gap-3">

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with City Beans on WhatsApp"
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <span className="text-sm font-bold">
                WA
              </span>
            </a>

          </div>

        </div>

        <div>

          <b className="text-xs uppercase tracking-[.18em] text-white/45">
            Visit
          </b>

          <p className="mt-5 text-sm text-white/70">
            {LOCATION}
          </p>

          <p className="mt-3 text-sm text-white/70">
            Delivery & pickup available
          </p>

        </div>

        <div>

          <b className="text-xs uppercase tracking-[.18em] text-white/45">
            Contact
          </b>

          <a
            href={`tel:${PHONES[0].replace(/\s/g, "")}`}
            className="block mt-5 text-sm text-white/70 hover:text-white transition"
          >
            {PHONES[0]}
          </a>

          <a
            href={`tel:${PHONES[1].replace(/\s/g, "")}`}
            className="block mt-2 text-sm text-white/70 hover:text-white transition"
          >
            {PHONES[1]}
          </a>

        </div>

      </div>

      <div className="border-t border-white/10 text-center py-5 text-[11px] text-white/35">
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

  /* Handle category navigation */

  useEffect(() => {

    if (typeof page === "object") {

      setActiveCategory(
        page.category || "all"
      );

      setPage("menu");
    }

  }, [page]);

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
      className="min-h-screen bg-[#F7F1E3] text-[#19150F]"
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
          setPage={setPage}
          openProduct={setModalProduct}
        />
      )}

      {page === "menu" && (
        <MenuPage
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

      <Footer />

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
