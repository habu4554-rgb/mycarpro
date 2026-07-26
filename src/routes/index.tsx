import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { translations, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

const PHONE = "+372 57476733";
const PHONE_HREF = "tel:+37257476733";
const EMAIL = "mycarproo@gmail.com";
const ADDRESS_MAP = "https://maps.google.com/?q=Majaka+p%C3%B5ik+17,+Tallinn";
const WHEEL_SIZES = ["R16", "R17", "R18", "R19", "R20", "R21", "R22"];

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

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    size: "R16",
    car: t.booking.carOptions[0],
  });
  const [submitted, setSubmitted] = useState(false);

  const cost = useMemo(() => calcCost(form.size, form.car), [form.size, form.car]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-md bg-gradient-gold shadow-gold">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg tracking-wide">
              MYCAR<span className="text-gradient-gold">PRO</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#services" className="hover:text-primary transition-colors">{t.nav.services}</a>
            <a href="#booking" className="hover:text-primary transition-colors">{t.nav.booking}</a>
            <a href="#contacts" className="hover:text-primary transition-colors">{t.nav.contacts}</a>
          </nav>
          <div className="flex items-center gap-1 rounded-full border border-border/60 p-1 text-xs">
            {(["en", "ru", "et"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full font-medium uppercase transition-colors ${
                  lang === l ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Car service workshop in Tallinn"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.1 0.005 260 / 0.5) 0%, oklch(0.1 0.005 260 / 0.85) 60%, oklch(0.14 0.005 260) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-widest text-primary mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t.hero.badge}
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] font-semibold tracking-tight">
              {t.hero.title.split(" and ")[0] || t.hero.title}
              {t.hero.title.includes(" and ") && (
                <>
                  {" "}
                  <span className="text-gradient-gold">and {t.hero.title.split(" and ")[1]}</span>
                </>
              )}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold hover:brightness-110 transition"
              >
                <Calendar className="h-4 w-4" />
                {t.hero.cta1}
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold hover:border-primary/60 hover:text-primary transition"
              >
                <Phone className="h-4 w-4" />
                {t.hero.cta2}
              </a>
              <a
                href={ADDRESS_MAP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold hover:border-primary/60 hover:text-primary transition"
              >
                <MapPin className="h-4 w-4" />
                {t.hero.cta3}
              </a>
            </div>

            {/* stats strip */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl border-t border-border/40 pt-8">
              <div>
                <div className="font-display text-3xl text-gradient-gold">8+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">years</div>
              </div>
              <div>
                <div className="font-display text-3xl text-gradient-gold">4.9</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">rating</div>
              </div>
              <div>
                <div className="font-display text-3xl text-gradient-gold">10k+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">cars</div>
              </div>
            </div>
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
            {/* Tire card */}
            <div className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid place-items-center h-14 w-14 rounded-xl bg-gradient-gold shadow-gold">
                    <Disc className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl">{t.services.tire.title}</h3>
                </div>
                <ul className="divide-y divide-border/60">
                  {t.services.tire.items.map(([name, price]) => (
                    <li key={name} className="flex items-center justify-between py-3.5">
                      <span className="text-sm md:text-base text-foreground/90 flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary" />
                        {name}
                      </span>
                      <span className="font-display text-lg text-gradient-gold">{price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Auto card */}
            <div className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid place-items-center h-14 w-14 rounded-xl bg-gradient-gold shadow-gold">
                    <Wrench className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl">{t.services.auto.title}</h3>
                </div>
                <ul className="divide-y divide-border/60">
                  {t.services.auto.items.map(([name, price], i) => {
                    const Icon = [Droplet, Gauge, Wrench, Snowflake][i] || Sparkles;
                    return (
                      <li key={name} className="flex items-center justify-between py-3.5">
                        <span className="text-sm md:text-base text-foreground/90 flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary" />
                          {name}
                        </span>
                        <span className="font-display text-lg text-gradient-gold">{price}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 md:py-32 px-6 relative">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 20% 30%, oklch(0.78 0.14 82 / 0.15), transparent), radial-gradient(600px circle at 80% 70%, oklch(0.78 0.14 82 / 0.1), transparent)",
          }}
        />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">— {t.nav.booking}</div>
            <h2 className="font-display text-4xl md:text-5xl">{t.booking.title}</h2>
            <p className="text-muted-foreground mt-4">{t.booking.subtitle}</p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur p-8 md:p-10 shadow-gold"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-grid place-items-center h-16 w-16 rounded-full bg-gradient-gold shadow-gold mb-6">
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
                  <Field label={t.booking.time}>
                    <input required type="time" value={form.time} onChange={update("time")} className={inputCls} />
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

                <div className="mt-8 flex items-center justify-between flex-wrap gap-4 border-t border-border/60 pt-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.booking.cost}</div>
                    <div className="font-display text-4xl text-gradient-gold mt-1">{cost}€</div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-8 py-4 text-sm font-semibold text-primary-foreground shadow-gold hover:brightness-110 transition"
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
      <section id="contacts" className="py-24 md:py-32 px-6 border-t border-border/40">
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
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-7 w-7 rounded bg-gradient-gold">
              <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
            </span>
            <span className="font-display tracking-wide text-foreground">MYCAR<span className="text-gradient-gold">PRO</span></span>
          </div>
          <div>{t.footer}</div>
        </div>
      </footer>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

const contactCardCls =
  "block rounded-2xl border border-border bg-card p-8 hover:border-primary/60 hover:shadow-gold transition group";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
