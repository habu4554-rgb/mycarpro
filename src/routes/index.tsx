import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingBag,
  ClipboardList,
  Truck,
  MessageCircle,
  MapPin,
  Phone,
  Star,
  Menu,
  X,
  Snowflake,
  Leaf,
} from "lucide-react";
import yogofuraAsset from "@/assets/yogofura.jpg.asset.json";
import cakeAsset from "@/assets/custom-cake.jpg.asset.json";
import ogAsset from "@/assets/creamy-spot-og.jpg.asset.json";

const SITE = "https://mycarpro-tallinn-hub.lovable.app";
const OG_IMAGE = `${SITE}${ogAsset.url}`;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "The Creamy Spot | Yogofura, Greek Yogurt & Parfait in Abuja" },
      {
        name: "description",
        content:
          "Nature's Redefined Taste — handcrafted Yogofura, Greek Yogurt, Parfait & custom cakes, made fresh daily and delivered across Abuja. Order on WhatsApp.",
      },
      { property: "og:title", content: "The Creamy Spot | Creamy, Fresh & Nourishing — Abuja" },
      {
        property: "og:description",
        content:
          "Handcrafted Yogofura, Greek Yogurt, Parfait & custom cakes. Fresh daily, delivered in Abuja.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
});


const WHATSAPP = "https://wa.me/2347016902642";
const PHONE = "+234 701 690 2642";

const PRODUCTS = [
  {
    name: "Yogofura",
    img: yogofuraAsset.url,
    desc: "A rich blend of creamy yoghurt and traditional Hausa fura. The perfect healthy indulgence.",
    badge: "Best Seller",
    sizes: [
      { label: "50cl", price: 2400 },
      { label: "35cl", price: 1900 },
    ],
  },
  {
    name: "Plain Sweetened Yoghurt",
    img: "",
    desc: "Silky smooth, lightly sweetened and perfectly fresh. Simple and nourishing.",
    badge: "Classic",
    sizes: [
      { label: "50cl", price: 2300 },
      { label: "35cl", price: 1800 },
    ],
  },
  {
    name: "Greek Yogurt",
    img: "",
    desc: "Thick, smooth and protein-rich, made fresh with no preservatives.",
    badge: "High Protein",
    sizes: [
      { label: "500ml", price: 5000 },
      { label: "300ml", price: 4000 },
    ],
  },
  {
    name: "Parfait",
    img: "",
    desc: "Layered goodness of yoghurt, granola and fruits. A treat that's as beautiful as it is delicious.",
    badge: "Fan Favourite",
    sizes: [
      { label: "500ml", price: 6000 },
      { label: "300ml", price: 4500 },
    ],
  },
];

const VARIANTS = PRODUCTS.flatMap((p) =>
  p.sizes.map((s) => ({ key: `${p.name} ${s.label}`, name: p.name, size: s.label, price: s.price })),
);

const PRICE_MAP: Record<string, number> = Object.fromEntries(VARIANTS.map((v) => [v.key, v.price]));

const emptyQuantities = () => Object.fromEntries(VARIANTS.map((v) => [v.key, 0])) as Record<string, number>;


const STEPS = [
  { icon: ShoppingBag, title: "Choose Your Product", text: "Browse our menu and pick your favourite — Yogofura, Greek Yogurt, Parfait or Plain." },
  { icon: ClipboardList, title: "Place Your Order", text: "Fill the order form or message us directly on WhatsApp with your name, product, quantity and delivery address." },
  { icon: Truck, title: "Fresh Delivery", text: "We prepare your order fresh and deliver to you within Abuja. Keep refrigerated upon receipt." },
];

const REVIEWS = [
  { name: "Fatima A.", text: "The Yogofura is honestly the best I've ever had. So creamy and fresh!" },
  { name: "Blessing O.", text: "Their Greek yogurt has become a staple in my home. Premium quality." },
  { name: "Kemi T.", text: "The parfait is a work of art — delicious, beautiful and healthy." },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [cakeSent, setCakeSent] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("Yogofura");
  const [quantities, setQuantities] = useState<Record<string, number>>(emptyQuantities);
  const [fulfilment, setFulfilment] = useState<"Delivery" | "Pickup">("Delivery");

  const priceMap = PRICE_MAP;

  const total = Object.entries(quantities).reduce(
    (sum, [name, qty]) => sum + (priceMap[name] || 0) * (qty || 0),
    0,
  );

  const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

  const setQty = (name: string, val: number) =>
    setQuantities((q) => ({ ...q, [name]: Math.max(0, val || 0) }));


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const items = Object.entries(quantities).filter(([, q]) => q > 0);
    if (items.length === 0) return;

    items.forEach(([n, q]) => data.append(`${n} (qty)`, String(q)));
    data.append("Total", formatNaira(total));
    data.append("Fulfilment", fulfilment);

    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const address = String(data.get("address") || "");
    const deliveryDate = String(data.get("delivery_date") || "");
    const pickupTime = String(data.get("pickup_time") || "");
    const notes = String(data.get("notes") || "");

    const lines = [
      `*New Order — The Creamy Spot*`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Type: ${fulfilment}`,
      fulfilment === "Delivery" ? `Address: ${address}` : `Pickup Time: ${pickupTime}`,
      `Date: ${deliveryDate}`,
      ``,
      `Order:`,
      ...items.map(([n, q]) => `• ${n} × ${q} — ${formatNaira(priceMap[n] * q)}`),
      ``,
      `Total: ${formatNaira(total)}`,
      notes ? `Notes: ${notes}` : "",
    ].filter(Boolean);

    const waUrl = `https://wa.me/2347016902642?text=${encodeURIComponent(lines.join("\n"))}`;

    try {
      await fetch("https://formspree.io/f/mkodkbve", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
    } catch {}

    setLastWaUrl(waUrl);
    setSent(true);
    form.reset();
    setQuantities(emptyQuantities());
  };

  const handleCakeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", "Custom Cake Enquiry");
    try {
      await fetch("https://formspree.io/f/mkodkbve", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
    } catch {}
    setCakeSent(true);
    form.reset();
  };


  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <a href="#top" className="font-display text-2xl md:text-3xl font-bold text-primary italic">
            The Creamy Spot
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollTo("top")} className="hover:text-primary transition">Home</button>
            <button onClick={() => scrollTo("products")} className="hover:text-primary transition">Products</button>
            <button onClick={() => scrollTo("how")} className="hover:text-primary transition">How to Order</button>
            <button onClick={() => scrollTo("contact")} className="hover:text-primary transition">Contact</button>
          </nav>
          <a
            href={WHATSAPP}
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-110 transition"
          >
            <MessageCircle className="h-4 w-4" /> Order on WhatsApp
          </a>
          <button className="md:hidden text-primary" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-primary/10 px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => scrollTo("top")} className="text-left">Home</button>
            <button onClick={() => scrollTo("products")} className="text-left">Products</button>
            <button onClick={() => scrollTo("how")} className="text-left">How to Order</button>
            <button onClick={() => scrollTo("contact")} className="text-left">Contact</button>
            <a href={WHATSAPP} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white w-fit">
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden px-4 sm:px-6 py-20 md:py-32"
        style={{
          background:
            "radial-gradient(1000px circle at 20% 10%, #FFFFFF 0%, transparent 40%), radial-gradient(800px circle at 90% 90%, #FCD5E4 0%, transparent 50%), #FDE8F0",
        }}
      >
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-primary/20 px-4 py-1.5 text-xs font-medium text-secondary mb-6">
            <Leaf className="h-3.5 w-3.5 text-primary" /> Handcrafted in Abuja
          </div>
          <h1 className="font-display italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-secondary leading-[1.05]">
            Nature's <span className="text-primary">Redefined</span> Taste
          </h1>
          <p className="mt-6 text-lg md:text-xl text-secondary/80 max-w-2xl mx-auto">
            Handcrafted Yogofura &amp; Yoghurt — Healthy, Fresh &amp; Delivered in Abuja
          </p>

          {/* Quick product dropdown */}
          <div className="mt-8 max-w-xs mx-auto">
            <label htmlFor="hero-product" className="sr-only">Choose a product</label>
            <select
              id="hero-product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer text-center font-medium`}
            >
              <option value="" disabled>Choose a product</option>
              {PRODUCTS.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => scrollTo("order")}
              className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition"
            >
              Order {selectedProduct || "Now"}
            </button>
            <button
              onClick={() => scrollTo("products")}
              className="rounded-full border-2 border-primary bg-transparent px-8 py-4 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition"
            >
              View Products
            </button>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs sm:text-sm">
            {[
              ["🥛", "100% Natural"],
              ["❄️", "Keep Refrigerated"],
              ["📍", "Abuja Delivery"],
              ["💬", "WhatsApp Orders"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center justify-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-2.5 text-secondary font-medium border border-primary/10">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Menu</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">Our Signature Creations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="group relative rounded-3xl bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/10"
              >
                <div className="absolute top-4 right-4 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                  {p.badge}
                </div>
                {p.img ? (
                  <img
                    src={p.img}
                    alt={`${p.name} from The Creamy Spot`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-32 w-full object-cover rounded-2xl mb-5"
                  />
                ) : (
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-blush via-muted to-white mb-5 grid place-items-center">
                    <span className="font-display italic text-primary/40 text-5xl">🥛</span>
                  </div>
                )}
                <h3 className="font-display italic text-2xl text-secondary mb-1">{p.name}</h3>
                <div className="mb-2 grid gap-1">
                  {p.sizes.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-secondary/70 font-medium">{s.label}</span>
                      <span className="font-bold text-primary">₦{s.price.toLocaleString("en-NG")}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-secondary/70 leading-relaxed">{p.desc}</p>

              </div>
            ))}

            {/* Custom Cakes — special order card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush via-muted to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-primary">
              <div className="absolute top-4 -right-10 rotate-45 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-10 py-1 shadow-md">
                ✨ Special Order
              </div>
              <div className="inline-block rounded-full bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 mb-3">
                Made to Order
              </div>
              <img
                src={cakeAsset.url}
                alt="Custom celebration cake by The Creamy Spot"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-32 w-full object-cover rounded-2xl mb-5"
              />

              <h3 className="font-display italic text-2xl text-secondary mb-1">Custom Cakes</h3>
              <div className="italic font-semibold text-primary mb-2">Price on request</div>
              <p className="text-sm text-secondary/70 leading-relaxed">
                Every cake is uniquely crafted to match your vision — from birthdays to weddings, celebrations to
                corporate events. Flavours, sizes and designs are fully customizable.
              </p>
              <div className="mt-4">
                <div className="text-sm font-semibold text-secondary">Pricing varies by order</div>
                <p className="text-xs text-secondary/60 mt-1">
                  Tell us what you need and we&apos;ll create something special just for you
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollTo("cake-enquiry")}
                className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition"
              >
                Discuss Your Cake
              </button>
            </div>
          </div>


          {/* Quantity selector near menu */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-primary/10">
              <h3 className="font-display italic text-2xl md:text-3xl text-secondary text-center mb-2">Select Your Cups</h3>
              <p className="text-center text-sm text-secondary/70 mb-6">Choose quantities for each product — your running total updates automatically.</p>
              <div className="grid gap-3">
                {VARIANTS.map((v) => {
                  const qty = quantities[v.key] || 0;
                  const lineTotal = v.price * qty;
                  return (
                    <div key={v.key} className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-blush/30 p-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-secondary text-sm truncate">
                          {v.name} <span className="text-secondary/60">· {v.size}</span>
                        </div>
                        <div className="text-xs text-primary font-bold">
                          {formatNaira(v.price)}
                          {qty > 0 && <span className="text-secondary/60 font-normal"> · Subtotal {formatNaira(lineTotal)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => setQty(v.key, qty - 1)} className="h-9 w-9 rounded-full bg-white border border-primary/30 text-primary font-bold hover:bg-primary hover:text-white transition" aria-label={`Decrease ${v.key}`}>−</button>
                        <span className="w-8 text-center font-bold text-secondary">{qty}</span>
                        <button type="button" onClick={() => setQty(v.key, qty + 1)} className="h-9 w-9 rounded-full bg-white border border-primary/30 text-primary font-bold hover:bg-primary hover:text-white transition" aria-label={`Increase ${v.key}`}>+</button>
                      </div>
                    </div>
                  );
                })}

              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold text-primary">{formatNaira(total)}</span>
              </div>
              <p className="mt-3 text-center text-xs text-secondary/60">Enter 0 for products you don&apos;t want</p>
              <div className="mt-6 text-center">
                <button
                  onClick={() => scrollTo("order")}
                  disabled={total === 0}
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Order{total > 0 ? ` · ${formatNaira(total)}` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section id="how" className="px-4 sm:px-6 py-20 md:py-28 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Process</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">Ordering is Easy</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl bg-white p-8 shadow-sm border border-primary/10">
                <div className="absolute -top-5 left-8 grid place-items-center h-10 w-10 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30">
                  {i + 1}
                </div>
                <s.icon className="h-10 w-10 text-primary mb-4 mt-2" />
                <h3 className="font-display italic text-2xl text-secondary mb-2">{s.title}</h3>
                <p className="text-sm text-secondary/70 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Order</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">Place Your Order</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 md:p-10 shadow-lg border border-primary/10"
          >
            {sent ? (
              <div className="text-center py-10">
                <div className="inline-grid place-items-center h-16 w-16 rounded-full bg-primary text-white text-3xl mb-4">✓</div>
                <p className="font-display italic text-2xl text-secondary">Order received! We will contact you shortly.</p>
                <a
                  href={lastWaUrl || WHATSAPP}
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition"
                >
                  <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
                </a>
              </div>

            ) : (
              <div className="grid gap-5">
                <Field label="Full Name">
                  <input required name="name" className={inputCls} placeholder="Your name" />
                </Field>
                <Field label="Phone Number">
                  <input required type="tel" name="phone" className={inputCls} placeholder="+234 ..." />
                </Field>

                <Field label="Delivery or Pickup?">
                  <div className="grid grid-cols-2 gap-3">
                    {(["Delivery", "Pickup"] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFulfilment(opt)}
                        className={`rounded-xl border-2 py-3 text-sm font-semibold transition ${
                          fulfilment === opt
                            ? "border-primary bg-primary text-white"
                            : "border-primary/20 bg-blush/40 text-secondary hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="fulfilment" value={fulfilment} />
                </Field>

                {fulfilment === "Delivery" ? (
                  <Field label="Delivery Address in Abuja">
                    <textarea required name="address" rows={2} className={inputCls} placeholder="Street, area, landmark" />
                  </Field>
                ) : (
                  <Field label="Preferred Pickup Time">
                    <select required name="pickup_time" defaultValue="" className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="" disabled>Select a time slot</option>
                      <option value="Morning 9am-12pm">Morning 9am–12pm</option>
                      <option value="Afternoon 12pm-3pm">Afternoon 12pm–3pm</option>
                      <option value="Evening 3pm-6pm">Evening 3pm–6pm</option>
                    </select>
                  </Field>
                )}

                <div className="rounded-xl border border-primary/15 bg-blush/30 p-4">
                  <span className="block text-xs uppercase tracking-widest text-secondary/70 font-semibold mb-3">Your Order Summary</span>
                  {Object.entries(quantities).filter(([, q]) => q > 0).length === 0 ? (
                    <p className="text-sm text-secondary/60 italic">No products selected yet. Go back to the menu to choose your cups.</p>
                  ) : (
                    <div className="grid gap-2">
                      {Object.entries(quantities)
                        .filter(([, q]) => q > 0)
                        .map(([name, qty]) => (
                          <div key={name} className="flex items-center justify-between text-sm">
                            <span className="text-secondary">{name} <span className="text-secondary/60">× {qty}</span></span>
                            <span className="font-semibold text-primary">{formatNaira(priceMap[name] * qty)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatNaira(total)}</span>
                  </div>
                </div>

                <Field label={fulfilment === "Pickup" ? "Preferred Pickup Date" : "Preferred Delivery Date"}>
                  <input required type="date" name="delivery_date" className={inputCls} />
                </Field>
                <Field label="Special Instructions (optional)">
                  <textarea name="notes" rows={3} className={inputCls} placeholder="Anything we should know?" />
                </Field>
                <button
                  type="submit"
                  disabled={total === 0}
                  className="w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place My Order{total > 0 ? ` · ${formatNaira(total)}` : ""}
                </button>
              </div>
            )}
          </form>



          {/* WhatsApp shortcut */}
          <div className="mt-8 text-center">
            <p className="text-secondary mb-3">Or message us directly:</p>
            <a
              href={WHATSAPP}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp → {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* CUSTOM CAKE ENQUIRY */}
      <section id="cake-enquiry" className="px-4 sm:px-6 py-20 md:py-28 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Cakes</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">Custom Cake Enquiry</h2>
            <p className="mt-3 text-secondary/70">
              Have a cake in mind? Tell us about it and we&apos;ll get back to you with pricing and details
            </p>
          </div>

          <form onSubmit={handleCakeSubmit} className="rounded-3xl bg-white p-6 md:p-10 shadow-lg border border-primary/10">
            {cakeSent ? (
              <div className="text-center py-10">
                <div className="inline-grid place-items-center h-16 w-16 rounded-full bg-primary text-white text-3xl mb-4">✓</div>
                <p className="font-display italic text-2xl text-secondary">Enquiry received! We will contact you shortly.</p>
                <a
                  href={WHATSAPP}
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition"
                >
                  <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
                </a>
              </div>
            ) : (
              <div className="grid gap-5">
                <Field label="Full Name">
                  <input required name="cake_name" className={inputCls} placeholder="Your full name" />
                </Field>
                <Field label="Phone Number">
                  <input required type="tel" name="cake_phone" className={inputCls} placeholder="+234 000 000 0000" />
                </Field>
                <Field label="Type of Cake">
                  <select required name="cake_type" defaultValue="" className={`${inputCls} appearance-none cursor-pointer`}>
                    <option value="" disabled>Select cake type</option>
                    <option>Birthday Cake</option>
                    <option>Wedding Cake</option>
                    <option>Anniversary Cake</option>
                    <option>Baby Shower Cake</option>
                    <option>Corporate Event Cake</option>
                    <option>Other (please specify)</option>
                  </select>
                </Field>
                <Field label="Cake Size / Number of Tiers">
                  <input required name="cake_size" className={inputCls} placeholder="e.g. 2 tier, feeds 50 people" />
                </Field>
                <Field label="Preferred Flavour">
                  <input required name="cake_flavour" className={inputCls} placeholder="e.g. vanilla, chocolate, red velvet" />
                </Field>
                <Field label="Design Description">
                  <textarea required name="cake_design" rows={4} className={inputCls} placeholder="Describe your dream cake — colours, decorations, theme, any inspiration..." />
                </Field>
                <Field label="When do you need it?">
                  <input required type="date" name="cake_event_date" className={inputCls} />
                </Field>
                <Field label="Budget Range">
                  <select required name="cake_budget" defaultValue="" className={`${inputCls} appearance-none cursor-pointer`}>
                    <option value="" disabled>Select a budget range</option>
                    <option>Under ₦10,000</option>
                    <option>₦10,000 - ₦25,000</option>
                    <option>₦25,000 - ₦50,000</option>
                    <option>₦50,000 - ₦100,000</option>
                    <option>Above ₦100,000</option>
                    <option>Not sure yet</option>
                  </select>
                </Field>
                <Field label="Anything else we should know? (optional)">
                  <textarea name="cake_notes" rows={3} className={inputCls} placeholder="Additional notes" />
                </Field>
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition"
                >
                  Send Cake Enquiry
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 rounded-3xl bg-blush p-6 md:p-8 text-center border border-primary/15">
            <p className="font-display italic text-xl text-secondary">💬 Prefer to talk directly?</p>
            <p className="mt-2 text-sm text-secondary/70">
              Chat with us on WhatsApp to discuss your cake needs in real time.
            </p>
            <a
              href={WHATSAPP}
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition"
            >
              <MessageCircle className="h-4 w-4" /> Chat About My Cake
            </a>
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Reviews</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-3xl bg-white p-8 shadow-md border border-primary/10 relative">
                <div className="font-display italic text-6xl text-primary/20 absolute top-2 left-4 leading-none">"</div>
                <div className="flex gap-1 mb-4 relative">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-secondary/80 leading-relaxed mb-4 relative">{r.text}</p>
                <div className="font-display italic text-lg text-secondary">— {r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-semibold">Visit / Reach Us</div>
            <h2 className="font-display italic text-4xl md:text-5xl text-secondary">The Creamy Spot</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-primary/10 space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-secondary/60 mb-1">Address</div>
                  <div className="text-secondary font-medium">Nigerian Airforce Base, Abuja. PAF Quarters</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-secondary/60 mb-1">Phone</div>
                  <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="text-secondary font-medium">{PHONE}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="h-5 w-5 text-whatsapp mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-secondary/60 mb-1">WhatsApp</div>
                  <a href={WHATSAPP} rel="noreferrer" className="text-secondary font-medium">{PHONE}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-primary/10">
                <Snowflake className="h-5 w-5 text-primary mt-1 shrink-0" />
                <p className="text-sm text-secondary/70 italic">Keep all products refrigerated upon delivery</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-primary/10 shadow-sm min-h-[300px]">
              <iframe
                title="The Creamy Spot on map"
                src="https://www.google.com/maps?q=Nigerian+Airforce+Base+PAF+Quarters+Abuja&output=embed"
                className="w-full h-full min-h-[300px] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-secondary text-white px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 items-start">
          <div>
            <div className="font-display italic text-3xl font-bold">The Creamy Spot</div>
            <p className="mt-2 text-white/70 italic">Nature's Redefined Taste</p>
            <p className="mt-1 text-white/60 text-sm">Healthy and Nourishing</p>
          </div>
          <div className="text-sm">
            <div className="uppercase tracking-widest text-white/60 text-xs mb-3">Quick Links</div>
            <ul className="space-y-2">
              <li><button onClick={() => scrollTo("products")} className="hover:text-primary transition">Products</button></li>
              <li><button onClick={() => scrollTo("how")} className="hover:text-primary transition">How to Order</button></li>
              <li><button onClick={() => scrollTo("contact")} className="hover:text-primary transition">Contact</button></li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="uppercase tracking-widest text-white/60 text-xs mb-3">Chat With Us</div>
            <a
              href={WHATSAPP}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 font-semibold text-white hover:brightness-110 transition"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          © 2026 The Creamy Spot. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP}
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full bg-whatsapp text-white shadow-xl shadow-whatsapp/40 hover:scale-110 transition"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-primary/20 bg-blush/40 px-4 py-3 text-sm text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-secondary/70 font-semibold mb-2">{label}</span>
      {children}
    </label>
  );
}
