import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useAdminOrders, timeAgo } from "../hooks/useAdminOrders";
import { useAdminRiders } from "../hooks/useAdminRiders";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { useAdminDelivery } from "../hooks/useAdminDelivery";
import {
  LayoutGrid, Package, ClipboardList, Bike, Settings2, Search, Bell,
  Plus, Pencil, Trash2, X, ImagePlus, ChevronDown, Phone, MapPin,
  DollarSign, TrendingUp, Clock, CheckCircle2, Truck, Menu as MenuIcon,
  ToggleLeft, ToggleRight, Eye, MoreHorizontal, LogOut, Volume2, VolumeX,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS — same system as the storefront
   ============================================================ */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
`;

const T = {
  cream: "#F5EABD",
  creamDeep: "#E3D9AF",
  paper: "#FBF7EC",
  surface: "#FFFBEF",
  ink: "#1A1400",
  green: "#609223",
  greenDark: "#456919",
  greenSoft: "#E2EBD7",
  brown: "#917138",
  brownDeep: "#685128",
  gold: "#B7A27D",
  goldDeep: "#917138",
  orange: "#F7A110",
  orangeSoft: "#FDF0DB",
  orangeDeep: "#C5800C",
  red: "#C24A3D",
  redSoft: "#F7E1DD",
  black: "#171208",
  sidebar: "#1B160D",
};

// An order saved when checkout started but not paid for yet (e.g. the customer
// closed the payment window). Kept out of the main lists so they don't clutter.
const isUnpaid = (o) => o.paymentStatus !== "PAID" && o.status === "PENDING";

const GHS = (n) => `GH₵${Number(n).toFixed(2).replace(/\.00$/, "")}`;

/* ============================================================
   CONSTANTS — real DB values (category slugs, status enum)
   ============================================================ */
const CATEGORY_OPTIONS = ["gob3", "waakye", "beans-stew", "extras"];

const DELIVERY_STATUSES = [
  "PENDING", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "RIDER_ASSIGNED",
  "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
];

/* ============================================================
   SMALL PRIMITIVES
   ============================================================ */
function StatusBadge({ status }) {
  const map = {
    PENDING: { bg: T.orangeSoft, fg: T.orangeDeep },
    CONFIRMED: { bg: T.greenSoft, fg: T.greenDark },
    PREPARING: { bg: T.orangeSoft, fg: T.orangeDeep },
    READY_FOR_PICKUP: { bg: T.greenSoft, fg: T.greenDark },
    RIDER_ASSIGNED: { bg: "#EAE1F5", fg: "#6B4FA0" },
    PICKED_UP: { bg: "#EAE1F5", fg: "#6B4FA0" },
    OUT_FOR_DELIVERY: { bg: "#DDEBF7", fg: "#2E6FA3" },
    DELIVERED: { bg: T.greenSoft, fg: T.greenDark },
    CANCELLED: { bg: T.redSoft, fg: T.red },
    PAID: { bg: T.greenSoft, fg: T.greenDark },
    FAILED: { bg: T.redSoft, fg: T.red },
  };
  const c = map[status] || { bg: T.creamDeep, fg: T.ink };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
      style={{ background: c.bg, color: c.fg, fontFamily: "'Baloo 2', sans-serif" }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button onClick={() => onChange(!on)} className="flex items-center gap-2">
      {on ? <ToggleRight size={30} color={T.green} /> : <ToggleLeft size={30} color="#C9BC94" />}
      {label && <span className="text-sm font-semibold" style={{ color: T.ink }}>{label}</span>}
    </button>
  );
}

function Button({ children, onClick, variant = "primary", className = "", icon: Icon, disabled }) {
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-xl px-4 py-2.5 text-sm transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: { background: T.green, color: T.surface },
    secondary: { background: T.surface, color: T.ink, border: "1.5px solid rgba(36,29,16,0.15)" },
    danger: { background: T.redSoft, color: T.red },
    ghost: { background: "transparent", color: T.ink },
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${className}`} style={{ ...variants[variant], fontFamily: "'Baloo 2', sans-serif" }}>
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

function Card({ children, className = "", ...rest }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: T.surface, boxShadow: "0 8px 24px -16px rgba(23,18,8,0.3)" }} {...rest}>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold opacity-70" style={{ color: T.ink }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  background: T.paper,
  border: `1.5px solid rgba(90,70,48,0.18)`,
  color: T.ink,
};

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl`}
        style={{ background: T.paper, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4" style={{ background: T.paper, borderBottom: `1.5px solid rgba(90,70,48,0.12)` }}>
          <span className="font-extrabold text-lg" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{title}</span>
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: T.surface }}><X size={18} color={T.ink} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm leading-6 mb-6" style={{ color: T.ink }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" icon={Trash2} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

function Logo({ variant = "dark", size = 30 }) {
  const ring = variant === "dark" ? T.gold : T.goldDeep;
  const bean = variant === "dark" ? T.gold : T.brown;
  const wordCity = variant === "dark" ? T.gold : T.goldDeep;
  const wordBeans = variant === "dark" ? "#9C8676" : T.brown;
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="19" stroke={ring} strokeWidth="2.5" />
        <path d="M28 14c-7.5 0-13.5 4.5-13.5 10s6 10 13.5 10" stroke={ring} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20.5 19c2.8 0 5 1.6 5 4s-2.2 4-5 4c-1.6 0-2.4-1-2.4-2.3 0-1 .6-1.6 1.5-2 .9-.4 1.5-1 1.5-1.9 0-1-.7-1.8-1.6-1.8" stroke={bean} strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <span style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-lg leading-none tracking-wide">
        <span style={{ color: wordCity, fontWeight: 600 }}>CITY </span>
        <span style={{ color: wordBeans, fontWeight: 700 }}>BEANS</span>
      </span>
    </span>
  );
}

/* ============================================================
   SIDEBAR + TOPBAR
   ============================================================ */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "riders", label: "Riders", icon: Bike },
  { key: "delivery", label: "Delivery", icon: Settings2 },
];

/* ============================================================
   NEW-ORDER ALERTS — sound + banner + unseen count
   ============================================================ */
const MUTE_KEY = "cb_admin_muted";

function readMuted() {
  try { return localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
}

function useNewOrderAlerts(orders, loading) {
  const [unseen, setUnseen] = useState(0);
  const [banner, setBanner] = useState(null);
  const [muted, setMuted] = useState(readMuted);
  const paidSeen = useRef(new Set());
  const ready = useRef(false);
  const audioCtx = useRef(null);
  const [soundReady, setSoundReady] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Browsers only allow sound once the page has been interacted with. The
  // click on "Sign in" happens before this page exists, so we try straight
  // away on load, retry on every tap/click/key press, and tell the admin
  // when sound is still switched off so she can enable it with one tap.
  const unlockSound = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      if (!audioCtx.current) {
        audioCtx.current = new Ctx();
        audioCtx.current.onstatechange = () =>
          setSoundReady(audioCtx.current?.state === "running");
      }
      if (audioCtx.current.state === "suspended") audioCtx.current.resume();
      setSoundReady(audioCtx.current.state === "running");
      return audioCtx.current.state === "running";
    } catch {
      return false; // sound is optional
    }
  }, []);

  useEffect(() => {
    unlockSound();
    window.addEventListener("pointerdown", unlockSound);
    window.addEventListener("keydown", unlockSound);
    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, [unlockSound]);

  const beep = useCallback(() => {
    try {
      const ctx = audioCtx.current;
      if (!ctx || ctx.state !== "running") return;
      [0, 0.22].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 880 : 1175;
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch { /* sound is optional */ }
  }, []);

  // Ring only when an order has actually been PAID. Orders that are saved
  // but unpaid stay quiet. The first load just records what already exists,
  // so opening the dashboard doesn't ring for old orders.
  useEffect(() => {
    if (loading) return;
    if (!ready.current) {
      orders.forEach((o) => { if (o.paymentStatus === "PAID") paidSeen.current.add(o.id); });
      ready.current = true;
      return;
    }
    const justPaid = orders.filter((o) => o.paymentStatus === "PAID" && !paidSeen.current.has(o.id));
    if (justPaid.length === 0) return;
    justPaid.forEach((o) => paidSeen.current.add(o.id));
    setUnseen((n) => n + justPaid.length);
    setBanner({ order: justPaid[0], kind: "paid" });
    if (!mutedRef.current) beep();
  }, [orders, loading, beep]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 10000);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    const base = "City Beans Admin";
    document.title = unseen > 0 ? `(${unseen}) New order${unseen > 1 ? "s" : ""} · ${base}` : base;
    return () => { document.title = base; };
  }, [unseen]);

  const toggleMuted = () => {
    setMuted((m) => {
      const next = !m;
      try { localStorage.setItem(MUTE_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  // Plays the alert once so she can hear that it works
  const testSound = () => {
    unlockSound();
    window.setTimeout(beep, 80);
  };

  return {
    unseen, banner, muted, toggleMuted, soundReady, testSound,
    clear: () => { setUnseen(0); setBanner(null); },
    dismissBanner: () => setBanner(null),
  };
}

function Sidebar({ page, setPage, mobileOpen, setMobileOpen, unseen = 0 }) {
  const content = (
    <div className="h-full flex flex-col" style={{ background: T.sidebar }}>
      <div className="px-6 py-6">
        <Logo variant="dark" />
        <div className="text-[11px] mt-1 font-semibold tracking-wide uppercase opacity-50" style={{ color: T.cream }}>Admin Dashboard</div>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setPage(key); setMobileOpen(false); }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              background: page === key ? "rgba(232,151,59,0.16)" : "transparent",
              color: page === key ? T.orange : "rgba(245,234,198,0.75)",
            }}
          >
            <Icon size={18} />
            {label}
            {key === "orders" && unseen > 0 && (
              <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-extrabold" style={{ background: T.orange, color: T.ink }}>
                {unseen}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="text-xs font-bold" style={{ color: T.cream }}>Kotei, Sunshine Academy</div>
        <div className="text-[11px] opacity-50 mt-0.5" style={{ color: T.cream }}>Delivery &amp; pickup only</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">{content}</div>
        </div>
      )}
    </>
  );
}

function Topbar({ title, setMobileOpen, unseen, onBell, muted, onToggleMute, soundReady, onTestSound, email, onSignOut, query, onQuery, searchPlaceholder }) {
  const initial = (email || "A").trim().charAt(0).toUpperCase();
  const iconBtn = { background: T.surface, border: `1.5px solid rgba(90,70,48,0.12)` };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 h-16" style={{ background: "rgba(251,247,236,0.9)", backdropFilter: "blur(10px)", borderBottom: `1.5px solid rgba(90,70,48,0.1)` }}>
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden p-1.5" onClick={() => setMobileOpen(true)} aria-label="Open menu"><MenuIcon size={20} color={T.ink} /></button>
        <span className="font-extrabold text-xl truncate" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{title}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2" style={iconBtn}>
          <Search size={15} color={T.ink} style={{ opacity: 0.5 }} />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="text-sm outline-none bg-transparent w-36 lg:w-52"
            style={{ color: T.ink }}
          />
        </div>
        {!muted && !soundReady ? (
          <button
            onClick={onTestSound}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold"
            style={{ background: T.orangeSoft, border: `1.5px solid ${T.orange}`, color: T.orangeDeep, fontFamily: "'Baloo 2', sans-serif" }}
            title="Your browser is blocking sound until you tap here"
          >
            <VolumeX size={16} />
            <span className="hidden sm:inline">Tap to enable sound</span>
          </button>
        ) : (
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl"
            style={iconBtn}
            aria-label={muted ? "Turn order sound on" : "Turn order sound off"}
            title={muted ? "Order sound is off" : "Order sound is on"}
          >
            {muted ? <VolumeX size={16} color={T.ink} style={{ opacity: 0.5 }} /> : <Volume2 size={16} color={T.ink} />}
          </button>
        )}
        <button
          onClick={onBell}
          className="relative p-2 rounded-xl"
          style={iconBtn}
          aria-label={unseen > 0 ? `${unseen} new order${unseen > 1 ? "s" : ""}` : "Notifications"}
        >
          <Bell size={16} color={T.ink} />
          {unseen > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-extrabold" style={{ background: T.orange, color: T.ink }}>
              {unseen}
            </span>
          )}
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold"
          style={{ ...iconBtn, color: T.ink, fontFamily: "'Baloo 2', sans-serif" }}
          title={email ? `Signed in as ${email}` : "Sign out"}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
        <div className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center font-extrabold text-sm" style={{ background: T.green, color: T.surface, fontFamily: "'Baloo 2', sans-serif" }} aria-hidden="true">
          {initial}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function DashboardPage({ orders, riders }) {
  const [period, setPeriod] = useState("today");

  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const DAY = 24 * 60 * 60 * 1000;
    const start =
      period === "today" ? startOfDay :
      period === "week" ? new Date(startOfDay.getTime() - 6 * DAY) :
      period === "month" ? new Date(startOfDay.getTime() - 29 * DAY) :
      null;

    const real = orders.filter((o) => !isUnpaid(o)); // unpaid checkouts are not real orders yet
    const inPeriod = start ? real.filter((o) => o.createdAt && new Date(o.createdAt) >= start) : real;
    const paid = inPeriod.filter((o) => o.paymentStatus === "PAID");
    const revenue = paid.reduce((sum, o) => sum + o.total, 0);

    return {
      count: inPeriod.length,
      revenue,
      avg: paid.length ? revenue / paid.length : 0,
      completed: inPeriod.filter((o) => o.status === "DELIVERED").length,
      // "right now" numbers, not limited to the period
      pending: real.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length,
      active: real.filter((o) => ["RIDER_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"].includes(o.status)).length,
    };
  }, [orders, period]);

  const PERIODS = [
    { key: "today", label: "Today" },
    { key: "week", label: "7 days" },
    { key: "month", label: "30 days" },
    { key: "all", label: "All time" },
  ];

  const cards = [
    { label: "Orders", value: stats.count, icon: ClipboardList, tone: T.green },
    { label: "Revenue (paid)", value: GHS(stats.revenue), icon: DollarSign, tone: T.brownDeep },
    { label: "Average paid order", value: GHS(stats.avg), icon: TrendingUp, tone: T.orange },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: T.green },
    { label: "Open orders · right now", value: stats.pending, icon: Clock, tone: T.gold },
    { label: "Active deliveries · right now", value: stats.active, icon: Truck, tone: T.orangeDeep },
  ];

  return (
    <div className="p-5 md:p-8">
      <div className="flex gap-2 overflow-x-auto mb-5" role="group" aria-label="Show figures for">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            aria-pressed={period === key}
            className="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0"
            style={{ fontFamily: "'Baloo 2', sans-serif", background: period === key ? T.ink : T.surface, color: period === key ? T.surface : T.ink, border: `1.5px solid rgba(90,70,48,0.12)` }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.tone}1A` }}>
              <c.icon size={18} color={c.tone} />
            </div>
            <div className="text-2xl font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{c.value}</div>
            <div className="text-xs opacity-60 mt-1" style={{ color: T.ink }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-extrabold text-lg" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>Recent Orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-50 text-xs uppercase tracking-wide" style={{ color: T.ink }}>
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter((o) => !isUnpaid(o)).slice(0, 6).map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
                  <td className="py-3 pr-4 font-bold" style={{ color: T.ink }}>{o.orderNumber}</td>
                  <td className="py-3 pr-4" style={{ color: T.ink }}>{o.customer}</td>
                  <td className="py-3 pr-4 opacity-70 max-w-[220px] truncate" style={{ color: T.ink }}>{o.items}</td>
                  <td className="py-3 pr-4 font-bold" style={{ color: T.brownDeep }}>{GHS(o.total)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PRODUCTS PAGE
   ============================================================ */
function ProductModal({ open, onClose, product, extrasMaster, uploadProductImage, onSave }) {
  const emptyForm = { name: "", category: "gob3", price: "", available: true, extraIds: [], imageUrl: null };
  const [form, setForm] = useState(product || emptyForm);
  React.useEffect(() => setForm(product || emptyForm), [product, open]);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = React.useRef(null);

  const toggleExtra = (id) => setForm((f) => ({ ...f, extraIds: f.extraIds.includes(id) ? f.extraIds.filter((e) => e !== id) : [...f.extraIds, id] }));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    setUploadError("");
    setUploading(true);
    const { url, error } = await uploadProductImage(file);
    setUploading(false);

    if (error) {
      setUploadError("Upload failed — please try again.");
      return;
    }
    setForm((f) => ({ ...f, imageUrl: url }));
  };

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit product" : "Add product"}>
      <div className="flex flex-col gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="relative rounded-2xl aspect-[3/1] flex flex-col items-center justify-center gap-1.5 overflow-hidden w-full"
          style={{ background: T.creamDeep, border: `2px dashed rgba(90,70,48,0.3)` }}
        >
          {form.imageUrl && !uploading && (
            <img src={form.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}

          {(uploading || !form.imageUrl) && (
            <>
              <ImagePlus size={22} color={T.brown} />
              <span className="text-xs font-bold opacity-60" style={{ color: T.brownDeep }}>
                {uploading ? "Uploading…" : "Upload food image"}
              </span>
            </>
          )}

          {form.imageUrl && !uploading && (
            <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(transparent 40%, rgba(0,0,0,0.55))" }}>
              <span className="text-xs font-bold text-[#FFFBEF]">Click to change</span>
            </div>
          )}
        </button>

        {form.imageUrl && !uploading && (
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
            className="text-xs font-bold self-start"
            style={{ color: T.red }}
          >
            Remove image
          </button>
        )}

        {uploadError && (
          <p className="text-xs font-semibold" style={{ color: T.red }}>{uploadError}</p>
        )}

        <FormField label="Product name">
          <input className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Category">
            <select className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Price (GH₵)">
            <input type="number" className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Available extras">
          <div className="grid grid-cols-2 gap-2">
            {extrasMaster.map((x) => (
              <label key={x.id} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm" style={{ background: form.extraIds.includes(x.id) ? T.greenSoft : T.paper, border: `1.5px solid rgba(90,70,48,0.12)`, color: T.ink }}>
                <input type="checkbox" checked={form.extraIds.includes(x.id)} onChange={() => toggleExtra(x.id)} />
                {x.name}
              </label>
            ))}
          </div>
        </FormField>
        <Toggle on={form.available} onChange={(v) => setForm({ ...form, available: v })} label={form.available ? "Available on menu" : "Marked unavailable"} />
        <Button variant="primary" disabled={uploading} onClick={() => onSave({ ...form, price: Number(form.price) || 0 })}>
          {product ? "Save changes" : "Add product"}
        </Button>
      </div>
    </Modal>
  );
}

function ProductsPage({ query = "", products, extrasMaster, addProduct, updateProduct, deleteProduct, toggleAvailable, uploadProductImage }) {
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };

  const save = (formData) => {
    if (editing) {
      updateProduct(editing.id, formData);
    } else {
      addProduct(formData);
    }
    setModalOpen(false);
  };

  const q = query.trim().toLowerCase();
  const filtered = products
    .filter((p) => filter === "all" || p.category === filter)
    .filter((p) => !q || p.name.toLowerCase().includes(q));

  return (
    <div className="p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto">
          {["all", ...CATEGORY_OPTIONS].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className="px-3.5 py-2 rounded-xl text-sm font-bold shrink-0"
              style={{ fontFamily: "'Baloo 2', sans-serif", background: filter === c ? T.green : T.surface, color: filter === c ? T.surface : T.ink, border: `1.5px solid ${filter === c ? T.greenDark : "rgba(90,70,48,0.12)"}` }}>
              {c}
            </button>
          ))}
        </div>
        <Button icon={Plus} onClick={openNew}>Add product</Button>
      </div>

      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-50 text-xs uppercase tracking-wide" style={{ color: T.ink }}>
                <th className="p-4"></th>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Extras</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-sm opacity-60" style={{ color: T.ink }}>
                  No products match your search or filter.
                </td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
                  <td className="p-4">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: T.creamDeep }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        : <ImagePlus size={16} color={T.brown} style={{ opacity: 0.5 }} />}
                    </div>
                  </td>
                  <td className="p-4 font-bold" style={{ color: T.ink }}>{p.name}</td>
                  <td className="p-4 opacity-70" style={{ color: T.ink }}>{p.category}</td>
                  <td className="p-4 font-bold" style={{ color: T.brownDeep }}>{GHS(p.price)}</td>
                  <td className="p-4 opacity-60 text-xs" style={{ color: T.ink }}>{p.extraIds.length} extras</td>
                  <td className="p-4">
                    <button onClick={() => toggleAvailable(p.id)}>
                      <StatusBadge status={p.available ? "CONFIRMED" : "CANCELLED"} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg" style={{ background: T.paper }}><Pencil size={14} color={T.ink} /></button>
                      <button onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`} className="p-2 rounded-lg" style={{ background: T.redSoft }}><Trash2 size={14} color={T.red} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phone layout: one card per product */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm opacity-60" style={{ color: T.ink }}>No products match your search or filter.</div>
        )}
        {filtered.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: T.creamDeep }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                  : <ImagePlus size={18} color={T.brown} style={{ opacity: 0.5 }} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate" style={{ color: T.ink }}>{p.name}</div>
                <div className="text-xs opacity-60 mt-0.5" style={{ color: T.ink }}>{p.category} · {p.extraIds.length} extras</div>
                <div className="font-bold mt-0.5" style={{ color: T.brownDeep }}>{GHS(p.price)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
              <button onClick={() => toggleAvailable(p.id)} aria-label={`Toggle availability of ${p.name}`}>
                <StatusBadge status={p.available ? "CONFIRMED" : "CANCELLED"} />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="p-2.5 rounded-lg" style={{ background: T.paper }}><Pencil size={15} color={T.ink} /></button>
                <button onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`} className="p-2.5 rounded-lg" style={{ background: T.redSoft }}><Trash2 size={15} color={T.red} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        message={toDelete ? `Delete "${toDelete.name}" from the menu? This cannot be undone. To hide it for now instead, close this and switch it to unavailable.` : ""}
        onCancel={() => setToDelete(null)}
        onConfirm={() => { deleteProduct(toDelete.id); setToDelete(null); }}
      />

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} product={editing} extrasMaster={extrasMaster} uploadProductImage={uploadProductImage} onSave={save} />
    </div>
  );
}

/* ============================================================
   ORDERS PAGE
   ============================================================ */
/* Turns a failed "verify payment" call into a sentence that says what went wrong */
async function explainVerifyError(error) {
  // The browser couldn't get an answer at all (offline, blocked, or the function isn't deployed)
  if (error?.name === "FunctionsFetchError") {
    return "Couldn't reach the verification service. Check your connection; if the function was just changed, make sure it has been deployed in Supabase.";
  }
  let detail = "";
  try {
    const body = await error?.context?.json?.();
    detail = body?.error || "";
  } catch { /* no readable message */ }

  if (detail === "Not authenticated") return "Your admin session has expired — sign out and sign in again.";
  if (detail === "Payment record not found") return "No payment record exists for this order's reference.";
  if (detail) return detail;
  return "The verification service returned an error. Open Supabase → Edge Functions → verify-payment → Logs for details.";
}

function OrderDrawer({ order, onClose, riders, onChangeStatus, onAssignRider, onVerifyPayment }) {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState("");

  if (!order) return null;

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult("");
    const { data, error } = await onVerifyPayment(order.paymentReference);
    setVerifying(false);

    if (error) {
      setVerifyResult(await explainVerifyError(error));
      return;
    }
    const result = data?.result;
    if (result === "confirmed") setVerifyResult("Confirmed — payment found and order updated.");
    else if (result === "already_confirmed") setVerifyResult("Already marked as paid.");
    else if (result === "not_paid" && data.paystackStatus === "unknown") {
      setVerifyResult("Paystack doesn't recognise this payment. If the Paystack account or keys were changed after this order was placed, it can't be confirmed — place a new test order.");
    }
    else if (result === "not_paid") setVerifyResult(`Paystack shows this as "${data.paystackStatus}" — not paid.`);
    else setVerifyResult("Couldn't verify — check the amount and try again.");
  };

  return (
    <Modal open={!!order} onClose={onClose} title={order.orderNumber} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-bold uppercase opacity-50 mb-1" style={{ color: T.ink }}>Customer</div>
          <div className="font-bold" style={{ color: T.ink }}>{order.customer}</div>
          <a href={`tel:${order.phone.replace(/\s/g, "")}`} className="text-sm flex items-center gap-1.5 mt-1 opacity-70" style={{ color: T.ink }}><Phone size={13} /> {order.phone}</a>

          <div className="text-xs font-bold uppercase opacity-50 mt-5 mb-1" style={{ color: T.ink }}>Fulfilment</div>
          <div className="text-sm flex items-center gap-1.5" style={{ color: T.ink }}>
            {order.method === "delivery" ? <Truck size={14} /> : <Package size={14} />}
            {order.method === "delivery" ? `Delivery — ${order.area}` : "Pickup — Kotei, Sunshine Academy"}
          </div>

          <div className="text-xs font-bold uppercase opacity-50 mt-5 mb-1" style={{ color: T.ink }}>Items</div>
          <div className="text-sm opacity-80" style={{ color: T.ink }}>{order.items}</div>
          <div className="font-extrabold mt-2 text-lg" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.brownDeep }}>{GHS(order.total)}</div>
        </div>

        <div className="flex flex-col gap-4">
          <FormField label="Payment status">
            <div className="flex items-center gap-3">
              <StatusBadge status={order.paymentStatus} />
              {order.paymentStatus !== "PAID" && order.paymentReference && (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="text-xs font-bold underline disabled:opacity-50"
                  style={{ color: T.green }}
                >
                  {verifying ? "Checking…" : "Verify with Paystack"}
                </button>
              )}
            </div>
            {verifyResult && (
              <p className="text-xs mt-1.5 opacity-70" style={{ color: T.ink }}>{verifyResult}</p>
            )}
          </FormField>
          <FormField label="Order status">
            <select className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={order.status} onChange={(e) => onChangeStatus(order.id, e.target.value)}>
              {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </FormField>
          {order.method === "delivery" && (
            <FormField label="Assign rider">
              <select className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={order.riderId || ""} onChange={(e) => onAssignRider(order.id, e.target.value || null)}>
                <option value="">Unassigned</option>
                {riders.filter((r) => r.active).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </FormField>
          )}
          <div className="flex gap-2 mt-2">
            <a href={`tel:${order.phone.replace(/\s/g, "")}`} className="flex-1"><Button variant="secondary" className="w-full" icon={Phone}>Call customer</Button></a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function OrdersPage({ query = "", orders, riders, changeStatus, assignRider, verifyPayment }) {
  const [activeId, setActiveId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const activeOrder = orders.find((o) => o.id === activeId) || null;

  // re-render every minute so "5 min ago" stays true
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const q = query.trim().toLowerCase();
  const unpaidCount = orders.filter(isUnpaid).length;
  const filtered = orders
    .filter((o) => {
      // While searching, look through everything so she can always find an order
      if (q) return statusFilter === "all" || (statusFilter === "AWAITING" ? isUnpaid(o) : o.status === statusFilter);
      if (statusFilter === "all") return !isUnpaid(o);
      if (statusFilter === "AWAITING") return isUnpaid(o);
      return o.status === statusFilter;
    })
    .filter((o) =>
      !q ||
      [o.orderNumber, o.customer, o.phone, o.area, o.items]
        .some((v) => (v || "").toLowerCase().includes(q))
    );

  return (
    <div className="p-5 md:p-8">
      <div className="flex gap-2 overflow-x-auto mb-5">
        {["all", ...DELIVERY_STATUSES.filter((s) => s !== "PENDING"), "AWAITING"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0"
            style={{ fontFamily: "'Baloo 2', sans-serif", background: statusFilter === s ? T.ink : T.surface, color: statusFilter === s ? T.surface : T.ink, border: `1.5px solid rgba(90,70,48,0.12)` }}>
            {s === "all" ? "All" : s === "AWAITING" ? `Awaiting payment${unpaidCount ? ` (${unpaidCount})` : ""}` : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-50 text-xs uppercase tracking-wide" style={{ color: T.ink }}>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Placed</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-sm opacity-60" style={{ color: T.ink }}>
                  {q || statusFilter !== "all" ? "No orders match your search or filter." : "No paid orders yet."}
                </td></tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
                  <td className="p-4 font-bold" style={{ color: T.ink }}>{o.orderNumber}</td>
                  <td className="p-4" style={{ color: T.ink }}>{o.customer}</td>
                  <td className="p-4 opacity-70 capitalize" style={{ color: T.ink }}>{o.method}</td>
                  <td className="p-4 font-bold" style={{ color: T.brownDeep }}>{GHS(o.total)}</td>
                  <td className="p-4"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="p-4"><StatusBadge status={o.status} /></td>
                  <td className="p-4 opacity-50 text-xs" style={{ color: T.ink }}>{timeAgo(o.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setActiveId(o.id)} className="p-2 rounded-lg" style={{ background: T.paper }}><Eye size={14} color={T.ink} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Phone layout: one tappable card per order */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm opacity-60" style={{ color: T.ink }}>
            {q || statusFilter !== "all" ? "No orders match your search or filter." : "No paid orders yet."}
          </div>
        )}
        {filtered.map((o) => (
          <button key={o.id} onClick={() => setActiveId(o.id)} className="text-left w-full" aria-label={`Open order ${o.orderNumber}`}>
            <Card className="p-4 active:scale-[0.99] transition-transform">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{o.orderNumber}</div>
                  <div className="text-sm truncate" style={{ color: T.ink }}>{o.customer}</div>
                </div>
                <div className="font-bold shrink-0" style={{ color: T.brownDeep }}>{GHS(o.total)}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <StatusBadge status={o.status} />
                <StatusBadge status={o.paymentStatus} />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs opacity-60" style={{ color: T.ink }}>
                <span className="capitalize">{o.method}{o.area && o.area !== "—" ? ` · ${o.area}` : ""}</span>
                <span>{timeAgo(o.createdAt)}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <OrderDrawer order={activeOrder} onClose={() => setActiveId(null)} riders={riders} onChangeStatus={changeStatus} onAssignRider={assignRider} onVerifyPayment={verifyPayment} />
    </div>
  );
}

/* ============================================================
   RIDERS PAGE
   ============================================================ */
function RiderModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  React.useEffect(() => { if (open) setForm({ name: "", phone: "" }); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="Add rider">
      <div className="flex flex-col gap-4">
        <FormField label="Full name">
          <input className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Phone number">
          <input className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="024 XXX XXXX" />
        </FormField>
        <Button onClick={() => { onSave(form); onClose(); }} disabled={!form.name.trim() || !form.phone.trim()}>Add rider</Button>
      </div>
    </Modal>
  );
}

function RidersPage({ riders, addRider, toggleActive, orders }) {
  const [modalOpen, setModalOpen] = useState(false);
  const deliveriesFor = (id) => orders.filter((o) => o.riderId === id && !["DELIVERED", "CANCELLED"].includes(o.status)).length;

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <span className="opacity-60 text-sm" style={{ color: T.ink }}>{riders.filter((r) => r.active).length} active riders</span>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>Add rider</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {riders.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{r.name}</div>
                <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-sm flex items-center gap-1.5 mt-1 opacity-70" style={{ color: T.ink }}><Phone size={13} /> {r.phone}</a>
              </div>
              <StatusBadge status={r.active ? "CONFIRMED" : "CANCELLED"} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs opacity-60" style={{ color: T.ink }}>{deliveriesFor(r.id)} active deliveries</span>
              <Toggle on={r.active} onChange={() => toggleActive(r.id)} />
            </div>
          </Card>
        ))}
      </div>
      <RiderModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addRider} />
    </div>
  );
}

/* ============================================================
   DELIVERY CONFIG PAGE
   ============================================================ */
function DeliveryPage({ zones, addZone, removeZone, updateZoneFee, toggleZone, settings, updateSettings }) {
  const [newZone, setNewZone] = useState({ name: "", fee: "" });
  const [zoneToRemove, setZoneToRemove] = useState(null);
  const [feeEdits, setFeeEdits] = useState({}); // { [zoneId]: "12" } — local until blur

  const handleAddZone = () => {
    if (!newZone.name.trim()) return;
    addZone(newZone.name, Number(newZone.fee) || 0);
    setNewZone({ name: "", fee: "" });
  };

  const commitFee = (id) => {
    if (feeEdits[id] === undefined) return;
    updateZoneFee(id, Number(feeEdits[id]) || 0);
    setFeeEdits((f) => { const next = { ...f }; delete next[id]; return next; });
  };

  return (
    <div className="p-5 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <Card className="p-6">
        <div className="font-extrabold text-lg mb-1" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>Delivery zones &amp; fees</div>
        <p className="text-sm opacity-60 mb-5" style={{ color: T.ink }}>Fees are looked up server-side by zone — never trusted from the customer's browser.</p>

        <div className="flex flex-col gap-2 mb-5">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: T.paper }}>
              <span className="flex-1 font-semibold text-sm" style={{ color: T.ink }}>{z.name}</span>
              <span className="text-xs opacity-60" style={{ color: T.ink }}>GH₵</span>
              <input
                type="number"
                value={feeEdits[z.id] !== undefined ? feeEdits[z.id] : z.fee}
                onChange={(e) => setFeeEdits((f) => ({ ...f, [z.id]: e.target.value }))}
                onBlur={() => commitFee(z.id)}
                className="w-20 rounded-lg px-2 py-1.5 text-sm outline-none"
                style={inputStyle}
              />
              <Toggle on={z.active} onChange={() => toggleZone(z.id)} />
              <button onClick={() => setZoneToRemove(z)} aria-label={`Remove ${z.name}`} className="p-2 rounded-lg" style={{ background: T.redSoft }}><Trash2 size={14} color={T.red} /></button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input placeholder="New zone name" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          <input placeholder="Fee" type="number" value={newZone.fee} onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })} className="w-24 rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          <Button icon={Plus} onClick={handleAddZone}>Add</Button>
        </div>
      </Card>

      <Card className="p-6 h-fit">
        <div className="font-extrabold text-lg mb-4" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>General settings</div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: T.ink }}>Pickup available</span>
            <Toggle on={settings.pickupEnabled} onChange={(v) => updateSettings({ pickupEnabled: v })} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: T.ink }}>Delivery available</span>
            <Toggle on={settings.deliveryEnabled} onChange={(v) => updateSettings({ deliveryEnabled: v })} />
          </div>
          <FormField label="Minimum order amount (GH₵, 0 = none)">
            <input
              type="number"
              defaultValue={settings.minOrder}
              onBlur={(e) => updateSettings({ minOrder: Number(e.target.value) || 0 })}
              className="rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </FormField>
          <p className="text-xs opacity-50" style={{ color: T.ink }}>
            These are read live by checkout's create_order function — changing them here takes effect on the next order placed, no deploy needed.
          </p>
        </div>
      </Card>
      <ConfirmDialog
        open={!!zoneToRemove}
        title="Remove delivery area?"
        message={zoneToRemove ? `Remove "${zoneToRemove.name}"? Customers will no longer be able to choose it. To pause it instead, close this and switch it off.` : ""}
        confirmLabel="Remove"
        onCancel={() => setZoneToRemove(null)}
        onConfirm={() => { removeZone(zoneToRemove.id); setZoneToRemove(null); }}
      />
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function CityBeansAdmin() {
  const [page, setPage] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    products, extrasMaster, loading: productsLoading,
    addProduct, updateProduct, deleteProduct, toggleAvailable, uploadProductImage,
  } = useAdminProducts();

  const { orders, loading: ordersLoading, changeStatus, assignRider, verifyPayment } = useAdminOrders();

  const { riders, loading: ridersLoading, addRider, toggleActive } = useAdminRiders();

  const {
    zones, settings, loading: deliveryLoading,
    addZone, removeZone, updateZoneFee, toggleZone, updateSettings,
  } = useAdminDelivery();

  const titles = { dashboard: "Dashboard", products: "Products", orders: "Orders", riders: "Riders", delivery: "Delivery settings" };

  const { session, signOut } = useAuth();
  const alerts = useNewOrderAlerts(orders, ordersLoading);

  // Typing in the search box takes her to the page that can use it
  const onSearch = (value) => {
    setQuery(value);
    if (value && page !== "orders" && page !== "products") setPage("orders");
  };

  const goTo = (key) => {
    setPage(key);
    if (key === "orders") alerts.clear();
  };

  // If she is already looking at Orders, new ones count as seen.
  useEffect(() => {
    if (page === "orders" && alerts.unseen > 0) alerts.clear();
  }, [page, alerts.unseen, alerts]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: T.paper, minHeight: "100%" }} className="flex">
      <style>{FONTS}</style>
      <Sidebar page={page} setPage={goTo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unseen={alerts.unseen} />
      <div className="flex-1 min-w-0">
        <Topbar
          title={titles[page]}
          setMobileOpen={setMobileOpen}
          unseen={alerts.unseen}
          onBell={() => goTo("orders")}
          muted={alerts.muted}
          onToggleMute={alerts.toggleMuted}
          soundReady={alerts.soundReady}
          onTestSound={alerts.testSound}
          email={session?.user?.email}
          onSignOut={signOut}
          query={query}
          onQuery={onSearch}
          searchPlaceholder={page === "products" ? "Search products…" : "Search orders…"}
        />

        {alerts.banner && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-40 rounded-2xl p-4 flex items-start gap-3 shadow-xl"
            style={{ background: T.ink, color: T.cream }}
          >
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.orange, color: T.ink }}>
              <Bell size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                New paid order {alerts.banner.order.orderNumber}
              </div>
              <div className="text-xs opacity-80 mt-0.5 truncate">
                {alerts.banner.order.customer || "Customer"} · {GHS(alerts.banner.order.total)} · {alerts.banner.order.method === "pickup" ? "Pickup" : "Delivery"}
              </div>
              <button
                onClick={() => goTo("orders")}
                className="mt-2 text-xs font-bold underline"
                style={{ color: T.orange }}
              >
                View orders
              </button>
            </div>
            <button onClick={alerts.dismissBanner} aria-label="Dismiss" className="shrink-0 p-1 opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}

        {page === "dashboard" && <DashboardPage orders={orders} riders={riders} />}

        {page === "products" && (
          productsLoading
            ? <div className="p-8 text-sm opacity-60" style={{ color: T.ink }}>Loading products…</div>
            : <ProductsPage query={query} products={products} extrasMaster={extrasMaster} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} toggleAvailable={toggleAvailable} uploadProductImage={uploadProductImage} />
        )}

        {page === "orders" && (
          ordersLoading
            ? <div className="p-8 text-sm opacity-60" style={{ color: T.ink }}>Loading orders…</div>
            : <OrdersPage query={query} orders={orders} riders={riders} changeStatus={changeStatus} assignRider={assignRider} verifyPayment={verifyPayment} />
        )}

        {page === "riders" && (
          ridersLoading
            ? <div className="p-8 text-sm opacity-60" style={{ color: T.ink }}>Loading riders…</div>
            : <RidersPage riders={riders} addRider={addRider} toggleActive={toggleActive} orders={orders} />
        )}

        {page === "delivery" && (
          deliveryLoading
            ? <div className="p-8 text-sm opacity-60" style={{ color: T.ink }}>Loading delivery settings…</div>
            : <DeliveryPage zones={zones} addZone={addZone} removeZone={removeZone} updateZoneFee={updateZoneFee} toggleZone={toggleZone} settings={settings} updateSettings={updateSettings} />
        )}
      </div>
    </div>
  );
}
