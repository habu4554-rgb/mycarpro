import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Wrench,
  Disc,
  Phone,
  MapPin,
  Mail,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  Gauge,
  Snowflake,
  Droplet,
  Sparkles,
  ShieldCheck,
  Timer,
  BadgeEuro,
  Award,
} from "lucide-react";
import logo from "@/assets/logo.png";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import { translations, extras, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MyCar Pro — Tyre Fitting & Car Service in Tallinn, Same Day" },
      {
        name: "description",
        content:
          "Fast tyre fitting from 40€ and expert car repair in Tallinn. Transparent prices, certified mechanics, warranty on every job — book your slot online in under a minute.",
      },
      { property: "og:title", content: "MyCar Pro — Tyre Fitting & Car Service in Tallinn" },
      {
        property: "og:description",
        content:
          "Same-day tyre fitting, diagnostics and repairs in Tallinn. Transparent pricing and online booking.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thecreamyspot-hub.lovable.app/" },
      { property: "og:image", content: "https://thecreamyspot-hub.lovable.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://thecreamyspot-hub.lovable.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://thecreamyspot-hub.lovable.app/" }],
  }),
});

const PHONE = "+372 57476733";
const PHONE_HREF = "tel:+37257476733";
const EMAIL = "mycarproo@gmail.com";
const ADDRESS_MAP =
  "https://www.google.com/maps/dir/?api=1&destination=Majaka+p%C3%B5ik+17%2C+Tallinn";
const WHEEL_SIZES = ["R16", "R17", "R18", "R19", "R20", "R21", "R22"];
const SLIDES = [slide1, slide2, slide3];
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function calcCost(size: string, carType: string): number {
  const inch = parseInt(size.replace("R", ""), 10);
  if (!inch) return 40;
  let base = 40 + Math.max(0, inch - 16) * 5;
  if (carType.startsWith("Crossover") || carType.includes("Kroos") || carType.includes("Кросс")) base += 5;
  else if (carType.includes("SUV") || carType.includes("Off") || carType.includes("maastur") || carType.includes("внедорожник")) base += 10;
  else if (carType.toLowerCase().includes("small") || carType.toLowerCase().includes("väike") || carType.includes("Малый")) base += 10;
  else if (carType.toLowerCase().includes("large") || carType.toLowerCase().includes("suur") || carType.includes("Больш")) base += 15;
  return base;
}

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  const x = extras[lang];

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "09:00",
    size: "R16",
    car: t.booking.carOptions[0] as string,
  });
  const [submitted, setSubmitted] = useState(false);

  const cost = useMemo(() => calcCost(form.size, form.car), [form.size, form.car]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whyIcons = [Timer, BadgeEuro, ShieldCheck, Award];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <a href="#top" className="flex items-center gap-2">
            <img src={logo} alt="MyCar Pro logo" width={160} height={160} className="h-9 w-auto" />
            <span className="sr-only">MyCar Pro</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#services" className="hover:text-primary transition-colors">{t.nav.services}</a>
            <a href="#why" className="hover:text-primary transition-colors">{x.why.title}</a>
            <a href="#booking" className="hover:text-primary transition-colors">{t.nav.booking}</a>
            <a href="#contacts" className="hover:text-primary transition-colors">{t.nav.contacts}</a>
          </nav>
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1 text-xs">
            {(["en", "ru", "et"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full font-semibold uppercase transition-colors ${
                  lang === l ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO with car slideshow */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="MyCar Pro car service in Tallinn"
              width={1600}
              height={900}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
                i === slide ? "opacity-100 scale-105" : "opacity-0 scale-100"
              } transition-transform duration-[7000ms] ease-out`}
            />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, oklch(0.98 0.012 230 / 0.95) 0%, oklch(0.96 0.02 232 / 0.72) 32%, oklch(0.96 0.02 232 / 0.1) 58%, oklch(0.35 0.09 250 / 0.18) 100%), linear-gradient(180deg, transparent 72%, oklch(0.985 0.008 230) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 px-4 py-1.5 text-xs uppercase tracking-widest text-primary mb-8 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t.hero.badge}
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] font-semibold tracking-tight">
              <span className="text-gradient-brand">{x.heroTitle}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">{x.heroSub}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand hover:brightness-110 hover:-translate-y-0.5 transition"
              >
                <Calendar className="h-4 w-4" />
                {t.hero.cta1}
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold shadow-soft hover:border-primary hover:text-primary transition"
              >
                <Phone className="h-4 w-4" />
                {t.hero.cta2}
              </a>
              <a
                href={ADDRESS_MAP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold shadow-soft hover:border-primary hover:text-primary transition"
              >
                <MapPin className="h-4 w-4" />
                {x.route}
              </a>
            </div>

            <div className="mt-14 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? "w-10 bg-gradient-brand" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="py-20 md:py-28 px-6 bg-gradient-sky">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">— MyCar Pro</div>
            <h2 className="font-display text-4xl md:text-5xl">{x.why.title}</h2>
            <p className="text-muted-foreground mt-4">{x.why.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {x.why.items.map(([title, desc], i) => {
              const Icon = whyIcons[i] || Sparkles;
              return (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-7 shadow-soft hover:-translate-y-1 hover:shadow-brand transition"
                >
                  <div className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-brand shadow-brand mb-5">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">— {t.nav.services}</div>
              <h2 className="font-display text-4xl md:text-5xl">{t.services.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-md">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ServiceCard icon={<Disc className="h-7 w-7 text-primary-foreground" />} title={t.services.tire.title}>
              {t.services.tire.items.map(([name, price]) => (
                <li key={name} className="flex items-center justify-between py-3.5">
                  <span className="text-sm md:text-base flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    {name}
                  </span>
                  <span className="font-display text-lg text-gradient-brand">{price}</span>
                </li>
              ))}
            </ServiceCard>

            <ServiceCard icon={<Wrench className="h-7 w-7 text-primary-foreground" />} title={t.services.auto.title}>
              {t.services.auto.items.map(([name, price], i) => {
                const Icon = [Droplet, Gauge, Wrench, Snowflake][i] || Sparkles;
                return (
                  <li key={name} className="flex items-center justify-between py-3.5">
                    <span className="text-sm md:text-base flex items-center gap-3">
                      <Icon className="h-4 w-4 text-primary" />
                      {name}
                    </span>
                    <span className="font-display text-lg text-gradient-brand">{price}</span>
                  </li>
                );
              })}
            </ServiceCard>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 md:py-32 px-6 relative bg-gradient-sky">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">— {t.nav.booking}</div>
            <h2 className="font-display text-4xl md:text-5xl">{t.booking.title}</h2>
            <p className="text-muted-foreground mt-4">{t.booking.subtitle}</p>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-brand">
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-grid place-items-center h-16 w-16 rounded-full bg-gradient-brand shadow-brand mb-6">
                  <Check className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="font-display text-2xl">{t.booking.success}</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label={t.booking.name}>
                    <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="John Doe" />
                  </Field>
                  <Field label={t.booking.phone}>
                    <input required type="tel" value={form.phone} onChange={update("phone")} className={inputCls} placeholder="+372 …" />
                  </Field>
                  <Field label={t.booking.email}>
                    <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="you@mail.com" />
                  </Field>
                  <Field label={t.booking.date}>
                    <input required type="date" value={form.date} onChange={update("date")} className={inputCls} />
                  </Field>
                  <Field label={x.timeLabel}>
                    <select required value={form.time} onChange={update("time")} className={inputCls}>
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t.booking.size}>
                    <select value={form.size} onChange={update("size")} className={inputCls}>
                      {WHEEL_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label={t.booking.car}>
                      <select value={form.car} onChange={update("car")} className={inputCls}>
                        {t.booking.carOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between flex-wrap gap-4 border-t border-border pt-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.booking.cost}</div>
                    <div className="font-display text-4xl text-gradient-brand mt-1">{cost}€</div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-8 py-4 text-sm font-semibold text-primary-foreground shadow-brand hover:brightness-110 hover:-translate-y-0.5 transition"
                  >
                    {t.booking.submit}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 md:py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">— {t.nav.contacts}</div>
            <h2 className="font-display text-4xl md:text-5xl">{t.contacts.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <a href={ADDRESS_MAP} target="_blank" rel="noreferrer" className={contactCardCls}>
              <MapPin className="h-6 w-6 text-primary mb-4" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Address</div>
              <div className="font-display text-lg">{t.contacts.address}</div>
              <div className="mt-3 text-sm font-medium text-primary inline-flex items-center gap-1">
                {x.route} <ChevronRight className="h-4 w-4" />
              </div>
            </a>
            <a href={PHONE_HREF} className={contactCardCls}>
              <Phone className="h-6 w-6 text-primary mb-4" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</div>
              <div className="font-display text-lg">{PHONE}</div>
            </a>
            <a href={`mailto:${EMAIL}`} className={contactCardCls}>
              <Mail className="h-6 w-6 text-primary mb-4" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</div>
              <div className="font-display text-lg break-all">{EMAIL}</div>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {t.contacts.hours}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-6 bg-surface">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
          <img src={logo} alt="MyCar Pro" loading="lazy" width={160} height={160} className="h-8 w-auto" />
          <div>{t.footer}</div>
        </div>
      </footer>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition";

const contactCardCls =
  "block rounded-2xl border border-border bg-card p-8 shadow-soft hover:border-primary hover:shadow-brand hover:-translate-y-1 transition";

function ServiceCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 overflow-hidden shadow-soft hover:shadow-brand transition">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition" />
      <div className="relative">
        <div className="flex items-center gap-4 mb-8">
          <div className="grid place-items-center h-14 w-14 rounded-xl bg-gradient-brand shadow-brand">{icon}</div>
          <h3 className="font-display text-2xl md:text-3xl">{title}</h3>
        </div>
        <ul className="divide-y divide-border">{children}</ul>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
