import React, { useState, useMemo, useCallback } from "react";
import {
  LayoutGrid, Package, ClipboardList, Bike, Settings2, Search, Bell,
  Plus, Pencil, Trash2, X, ImagePlus, ChevronDown, Phone, MapPin,
  DollarSign, TrendingUp, Clock, CheckCircle2, Truck, Menu as MenuIcon,
  ToggleLeft, ToggleRight, Eye, MoreHorizontal,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS — same system as the storefront
   ============================================================ */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
`;

const T = {
  cream: "#F5EAC6",
  creamDeep: "#EADEAF",
  paper: "#FBF7EC",
  ink: "#241D10",
  green: "#4C7A34",
  greenDark: "#345423",
  greenSoft: "#E4EDD9",
  brown: "#7C6142",
  brownDeep: "#5A4630",
  gold: "#A9895B",
  goldDeep: "#8B6B3D",
  orange: "#E8973B",
  orangeSoft: "#FBEAD3",
  orangeDeep: "#C97C25",
  red: "#C24A3D",
  redSoft: "#F7E1DD",
  white: "#FFFDF6",
  black: "#171208",
  sidebar: "#1B160D",
};

const GHS = (n) => `GH₵${Number(n).toFixed(2).replace(/\.00$/, "")}`;

/* ============================================================
   MOCK DATA — shaped like the future Postgres tables
   ============================================================ */
const CATEGORY_OPTIONS = ["gob3", "waakye", "beans-stew", "extras"];

const EXTRAS_MASTER = [
  { id: "chicken", name: "Chicken", price: 10 },
  { id: "fish", name: "Fish", price: 10 },
  { id: "egg", name: "Egg", price: 5 },
  { id: "sausage", name: "Sausage", price: 5 },
  { id: "avocado", name: "Avocado", price: 10 },
  { id: "meat", name: "Meat", price: 6 },
  { id: "salad", name: "Salad", price: 5 },
  { id: "wele", name: "Wele", price: 5 },
  { id: "kckcc", name: "KCKCC", price: 10 },
  { id: "rice", name: "Rice", price: 15 },
];

const INITIAL_PRODUCTS = [
  { id: "menkoaa", name: "Menkoaa Pack", category: "gob3", price: 30, available: true, extraIds: ["chicken", "fish", "avocado", "sausage", "egg"] },
  { id: "boysboys", name: "Boys Boys Pack", category: "gob3", price: 45, available: true, extraIds: ["chicken", "fish", "avocado", "sausage", "egg"] },
  { id: "daavi", name: "Daavi Pack", category: "gob3", price: 55, available: true, extraIds: ["chicken", "fish", "avocado", "sausage"] },
  { id: "borga", name: "Borga Pack", category: "gob3", price: 80, available: true, extraIds: ["avocado"] },
  { id: "naawa", name: "Naawa Pack", category: "waakye", price: 45, available: true, extraIds: ["chicken", "fish", "avocado", "egg", "sausage"] },
  { id: "amalia", name: "Amalia Pack", category: "waakye", price: 55, available: true, extraIds: ["chicken", "fish", "avocado"] },
  { id: "city", name: "City Pack", category: "waakye", price: 65, available: true, extraIds: ["chicken", "avocado"] },
  { id: "echoke", name: "Echoke Pack", category: "waakye", price: 99, available: false, extraIds: ["avocado"] },
  { id: "me", name: "Me Pack", category: "beans-stew", price: 45, available: true, extraIds: ["chicken", "fish", "avocado", "egg", "sausage"] },
  { id: "pal", name: "Pal Pack", category: "beans-stew", price: 60, available: true, extraIds: ["fish", "avocado", "sausage"] },
  { id: "bigman", name: "Big Man Pack", category: "beans-stew", price: 80, available: true, extraIds: ["avocado"] },
];

const DELIVERY_STATUSES = [
  "PENDING", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "RIDER_ASSIGNED",
  "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
];

const INITIAL_RIDERS = [
  { id: "r1", name: "Kwabena Owusu", phone: "024 112 3344", active: true },
  { id: "r2", name: "Yaw Mensah", phone: "020 556 7788", active: true },
  { id: "r3", name: "Abena Darko", phone: "055 998 2211", active: false },
];

const INITIAL_ORDERS = [
  { id: "CB-1049", customer: "Ama Mensah", phone: "024 555 1122", method: "delivery", area: "Kotei", items: "2 × Daavi Pack, 1 × Egg", total: 115, paymentStatus: "PAID", status: "OUT_FOR_DELIVERY", riderId: "r1", placedAt: "10 min ago" },
  { id: "CB-1048", customer: "Kojo Antwi", phone: "055 221 9090", method: "pickup", area: "—", items: "1 × Big Man Pack", total: 80, paymentStatus: "PAID", status: "PREPARING", riderId: null, placedAt: "18 min ago" },
  { id: "CB-1047", customer: "Efua Asante", phone: "020 331 4455", method: "delivery", area: "Ayeduase", items: "1 × Echoke Pack, 1 × Fish", total: 109, paymentStatus: "PAID", status: "RIDER_ASSIGNED", riderId: "r2", placedAt: "25 min ago" },
  { id: "CB-1046", customer: "Nana Yeboah", phone: "024 887 1010", method: "delivery", area: "Kotei", items: "3 × Menkoaa Pack", total: 100, paymentStatus: "PENDING", status: "PENDING", riderId: null, placedAt: "31 min ago" },
  { id: "CB-1045", customer: "Adjoa Boateng", phone: "053 442 7766", method: "pickup", area: "—", items: "1 × City Pack", total: 65, paymentStatus: "PAID", status: "READY_FOR_PICKUP", riderId: null, placedAt: "40 min ago" },
  { id: "CB-1044", customer: "Kwesi Appiah", phone: "020 991 3322", method: "delivery", area: "Kotei", items: "2 × Me Pack", total: 100, paymentStatus: "PAID", status: "DELIVERED", riderId: "r1", placedAt: "1 hr ago" },
  { id: "CB-1043", customer: "Akosua Frimpong", phone: "024 330 5510", method: "delivery", area: "Ayeduase", items: "1 × Amalia Pack", total: 65, paymentStatus: "FAILED", status: "CANCELLED", riderId: null, placedAt: "2 hr ago" },
];

const INITIAL_ZONES = [
  { id: "z1", name: "Kotei (core)", fee: 10, active: true },
  { id: "z2", name: "Ayeduase", fee: 15, active: true },
  { id: "z3", name: "Bomso", fee: 20, active: false },
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
    primary: { background: T.green, color: T.white },
    secondary: { background: T.white, color: T.ink, border: "1.5px solid rgba(36,29,16,0.15)" },
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
    <div className={`rounded-2xl ${className}`} style={{ background: T.white, boxShadow: "0 8px 24px -16px rgba(23,18,8,0.3)" }} {...rest}>
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
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: T.white }}><X size={18} color={T.ink} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
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

function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
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

function Topbar({ title, setMobileOpen }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 md:px-8 h-16" style={{ background: "rgba(251,247,236,0.9)", backdropFilter: "blur(10px)", borderBottom: `1.5px solid rgba(90,70,48,0.1)` }}>
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1.5" onClick={() => setMobileOpen(true)}><MenuIcon size={20} color={T.ink} /></button>
        <span className="font-extrabold text-xl" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: T.white, border: `1.5px solid rgba(90,70,48,0.12)` }}>
          <Search size={15} color={T.ink} style={{ opacity: 0.5 }} />
          <input placeholder="Search orders, products…" className="text-sm outline-none bg-transparent w-44" style={{ color: T.ink }} />
        </div>
        <button className="relative p-2 rounded-xl" style={{ background: T.white, border: `1.5px solid rgba(90,70,48,0.12)` }}>
          <Bell size={16} color={T.ink} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: T.orange }} />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm" style={{ background: T.green, color: T.white, fontFamily: "'Baloo 2', sans-serif" }}>
          A
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function DashboardPage({ orders, riders }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const today = orders.length; // mock: all "today"
    const pending = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length;
    const completed = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders.filter((o) => o.paymentStatus === "PAID").reduce((s, o) => s + o.total, 0);
    const active = orders.filter((o) => ["RIDER_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"].includes(o.status)).length;
    return { total, today, pending, completed, revenue, active };
  }, [orders]);

  const cards = [
    { label: "Total Orders", value: stats.total, icon: ClipboardList, tone: T.green },
    { label: "Today's Orders", value: stats.today, icon: TrendingUp, tone: T.orange },
    { label: "Pending Orders", value: stats.pending, icon: Clock, tone: T.gold },
    { label: "Completed Orders", value: stats.completed, icon: CheckCircle2, tone: T.green },
    { label: "Revenue (paid)", value: GHS(stats.revenue), icon: DollarSign, tone: T.brownDeep },
    { label: "Active Deliveries", value: stats.active, icon: Truck, tone: T.orangeDeep },
  ];

  return (
    <div className="p-5 md:p-8">
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
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
                  <td className="py-3 pr-4 font-bold" style={{ color: T.ink }}>{o.id}</td>
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
function ProductModal({ open, onClose, product, onSave }) {
  const [form, setForm] = useState(product || { name: "", category: "gob3", price: "", available: true, extraIds: [] });
  React.useEffect(() => setForm(product || { name: "", category: "gob3", price: "", available: true, extraIds: [] }), [product, open]);

  const toggleExtra = (id) => setForm((f) => ({ ...f, extraIds: f.extraIds.includes(id) ? f.extraIds.filter((e) => e !== id) : [...f.extraIds, id] }));

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit product" : "Add product"}>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl aspect-[3/1] flex flex-col items-center justify-center gap-1.5" style={{ background: T.creamDeep, border: `2px dashed rgba(90,70,48,0.3)` }}>
          <ImagePlus size={22} color={T.brown} />
          <span className="text-xs font-bold opacity-60" style={{ color: T.brownDeep }}>Upload food image</span>
        </div>
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
            {EXTRAS_MASTER.map((x) => (
              <label key={x.id} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm" style={{ background: form.extraIds.includes(x.id) ? T.greenSoft : T.paper, border: `1.5px solid rgba(90,70,48,0.12)`, color: T.ink }}>
                <input type="checkbox" checked={form.extraIds.includes(x.id)} onChange={() => toggleExtra(x.id)} />
                {x.name}
              </label>
            ))}
          </div>
        </FormField>
        <Toggle on={form.available} onChange={(v) => setForm({ ...form, available: v })} label={form.available ? "Available on menu" : "Marked unavailable"} />
        <Button variant="primary" onClick={() => onSave({ ...form, id: form.id || form.name.toLowerCase().replace(/\s+/g, "-"), price: Number(form.price) || 0 })}>
          {product ? "Save changes" : "Add product"}
        </Button>
      </div>
    </Modal>
  );
}

function ProductsPage({ products, setProducts }) {
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };
  const remove = (id) => setProducts((ps) => ps.filter((p) => p.id !== id));
  const save = (p) => {
    setProducts((ps) => {
      const exists = ps.some((x) => x.id === p.id);
      return exists ? ps.map((x) => (x.id === p.id ? p : x)) : [...ps, p];
    });
    setModalOpen(false);
  };
  const toggleAvailable = (id) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto">
          {["all", ...CATEGORY_OPTIONS].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className="px-3.5 py-2 rounded-xl text-sm font-bold shrink-0"
              style={{ fontFamily: "'Baloo 2', sans-serif", background: filter === c ? T.green : T.white, color: filter === c ? T.white : T.ink, border: `1.5px solid ${filter === c ? T.greenDark : "rgba(90,70,48,0.12)"}` }}>
              {c}
            </button>
          ))}
        </div>
        <Button icon={Plus} onClick={openNew}>Add product</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-50 text-xs uppercase tracking-wide" style={{ color: T.ink }}>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Extras</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
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
                      <button onClick={() => remove(p.id)} className="p-2 rounded-lg" style={{ background: T.redSoft }}><Trash2 size={14} color={T.red} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} product={editing} onSave={save} />
    </div>
  );
}

/* ============================================================
   ORDERS PAGE
   ============================================================ */
function OrderDrawer({ order, onClose, riders, onChangeStatus, onAssignRider }) {
  if (!order) return null;
  return (
    <Modal open={!!order} onClose={onClose} title={order.id} wide>
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
            <StatusBadge status={order.paymentStatus} />
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

function OrdersPage({ orders, setOrders, riders }) {
  const [active, setActive] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const changeStatus = (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setActive((a) => (a && a.id === id ? { ...a, status } : a));
  };
  const assignRider = (id, riderId) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, riderId, status: riderId ? "RIDER_ASSIGNED" : o.status } : o)));
    setActive((a) => (a && a.id === id ? { ...a, riderId } : a));
  };

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="p-5 md:p-8">
      <div className="flex gap-2 overflow-x-auto mb-5">
        {["all", ...DELIVERY_STATUSES].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0"
            style={{ fontFamily: "'Baloo 2', sans-serif", background: statusFilter === s ? T.ink : T.white, color: statusFilter === s ? T.white : T.ink, border: `1.5px solid rgba(90,70,48,0.12)` }}>
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
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
              {filtered.map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid rgba(90,70,48,0.08)` }}>
                  <td className="p-4 font-bold" style={{ color: T.ink }}>{o.id}</td>
                  <td className="p-4" style={{ color: T.ink }}>{o.customer}</td>
                  <td className="p-4 opacity-70 capitalize" style={{ color: T.ink }}>{o.method}</td>
                  <td className="p-4 font-bold" style={{ color: T.brownDeep }}>{GHS(o.total)}</td>
                  <td className="p-4"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="p-4"><StatusBadge status={o.status} /></td>
                  <td className="p-4 opacity-50 text-xs" style={{ color: T.ink }}>{o.placedAt}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setActive(o)} className="p-2 rounded-lg" style={{ background: T.paper }}><Eye size={14} color={T.ink} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <OrderDrawer order={active} onClose={() => setActive(null)} riders={riders} onChangeStatus={changeStatus} onAssignRider={assignRider} />
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
        <Button onClick={() => { onSave({ id: `r${Date.now()}`, ...form, active: true }); onClose(); }} disabled={!form.name.trim() || !form.phone.trim()}>Add rider</Button>
      </div>
    </Modal>
  );
}

function RidersPage({ riders, setRiders, orders }) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleActive = (id) => setRiders((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
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
      <RiderModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={(r) => setRiders((rs) => [...rs, r])} />
    </div>
  );
}

/* ============================================================
   DELIVERY CONFIG PAGE
   ============================================================ */
function DeliveryPage({ zones, setZones, settings, setSettings }) {
  const [newZone, setNewZone] = useState({ name: "", fee: "" });

  const addZone = () => {
    if (!newZone.name.trim()) return;
    setZones((zs) => [...zs, { id: `z${Date.now()}`, name: newZone.name, fee: Number(newZone.fee) || 0, active: true }]);
    setNewZone({ name: "", fee: "" });
  };
  const removeZone = (id) => setZones((zs) => zs.filter((z) => z.id !== id));
  const updateZoneFee = (id, fee) => setZones((zs) => zs.map((z) => (z.id === id ? { ...z, fee: Number(fee) || 0 } : z)));
  const toggleZone = (id) => setZones((zs) => zs.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));

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
              <input type="number" value={z.fee} onChange={(e) => updateZoneFee(z.id, e.target.value)} className="w-20 rounded-lg px-2 py-1.5 text-sm outline-none" style={inputStyle} />
              <Toggle on={z.active} onChange={() => toggleZone(z.id)} />
              <button onClick={() => removeZone(z.id)} className="p-1.5 rounded-lg" style={{ background: T.redSoft }}><Trash2 size={13} color={T.red} /></button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input placeholder="New zone name" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          <input placeholder="Fee" type="number" value={newZone.fee} onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })} className="w-24 rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          <Button icon={Plus} onClick={addZone}>Add</Button>
        </div>
      </Card>

      <Card className="p-6 h-fit">
        <div className="font-extrabold text-lg mb-4" style={{ fontFamily: "'Baloo 2', sans-serif", color: T.ink }}>General settings</div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: T.ink }}>Pickup available</span>
            <Toggle on={settings.pickupEnabled} onChange={(v) => setSettings({ ...settings, pickupEnabled: v })} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: T.ink }}>Delivery available</span>
            <Toggle on={settings.deliveryEnabled} onChange={(v) => setSettings({ ...settings, deliveryEnabled: v })} />
          </div>
          <FormField label="Minimum order amount (GH₵, 0 = none)">
            <input type="number" value={settings.minOrder} onChange={(e) => setSettings({ ...settings, minOrder: Number(e.target.value) || 0 })} className="rounded-xl px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </FormField>
          <p className="text-xs opacity-50" style={{ color: T.ink }}>
            These map directly to server-side config once the backend lands — nothing here is a hard-coded business rule in the app.
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function CityBeansAdmin() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [settings, setSettings] = useState({ pickupEnabled: true, deliveryEnabled: true, minOrder: 0 });

  const titles = { dashboard: "Dashboard", products: "Products", orders: "Orders", riders: "Riders", delivery: "Delivery settings" };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: T.paper, minHeight: "100%" }} className="flex">
      <style>{FONTS}</style>
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0">
        <Topbar title={titles[page]} setMobileOpen={setMobileOpen} />
        {page === "dashboard" && <DashboardPage orders={orders} riders={riders} />}
        {page === "products" && <ProductsPage products={products} setProducts={setProducts} />}
        {page === "orders" && <OrdersPage orders={orders} setOrders={setOrders} riders={riders} />}
        {page === "riders" && <RidersPage riders={riders} setRiders={setRiders} orders={orders} />}
        {page === "delivery" && <DeliveryPage zones={zones} setZones={setZones} settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}
