import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Disc,
  Car,
  CarFront,
  CarTaxiFront,
  Caravan,
  Truck,
  Bus,
  KeyRound,
  Phone,
  MapPin,
  Mail,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  Gauge,
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
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: () => <HomePage initialLang="ru" />,
  head: () => localizedHead("ru"),
});

const SITE = "https://mycarpro.ee";

export const LANG_PATH: Record<Lang, string> = { en: "/en", ru: "/", et: "/et" };


const HEAD_COPY: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "MyCar Pro — Tyre Fitting & Car Service in Tallinn, Same Day",
    description:
      "Fast tyre fitting from 40€ and expert car repair in Tallinn. Transparent prices, certified mechanics, warranty on every job — book your slot online in under a minute.",
  },
  ru: {
    title: "MyCar Pro — Шиномонтаж и автосервис в Таллинне",
    description:
      "Быстрый шиномонтаж от 40€ и профессиональный ремонт автомобилей в Таллинне. Прозрачные цены, опытные мастера, гарантия на работы — онлайн-запись занимает меньше минуты.",
  },
  et: {
    title: "MyCar Pro — Rehvivahetus ja autoteenindus Tallinnas",
    description:
      "Kiire rehvivahetus alates 40€ ja professionaalne autoremont Tallinnas. Läbipaistvad hinnad, sertifitseeritud mehaanikud ja garantii — broneeri aeg online alla minutiga.",
  },
};

export function localizedHead(lang: Lang) {
  const copy = HEAD_COPY[lang];
  const url = `${SITE}${LANG_PATH[lang]}`;
  const ogLocale = { en: "en_US", ru: "ru_RU", et: "et_EE" }[lang];
  return {
    meta: [
      { title: copy.title },
      { name: "description", content: copy.description },
      { property: "og:title", content: copy.title },
      { property: "og:description", content: copy.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: ogLocale },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hreflang: "ru", href: `${SITE}/` },
      { rel: "alternate", hreflang: "en", href: `${SITE}/en` },
      { rel: "alternate", hreflang: "et", href: `${SITE}/et` },
      { rel: "alternate", hreflang: "x-default", href: `${SITE}/` },

    ],
  };
}


const PHONE = "+372 57476733";
const PHONE_HREF = "tel:+37257476733";
const EMAIL = "mycarproo@gmail.com";
const ADDRESS_MAP =
  "https://www.google.com/maps/dir/?api=1&destination=Majaka+p%C3%B5ik+17%2C+Tallinn";
const WHEEL_SIZES = ["R16", "R17", "R18", "R19", "R20", "R21", "R22"];
const SLIDES = [slide1, slide2, slide3];
// Supabase time columns can come back as "09:00:00" — compare on HH:MM
function normalizeTime(v: string | null): string {
  return (v ?? "").slice(0, 5);
}

function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TIME_SLOTS = [
  "09:00",
  "09:40",
  "10:20",
  "11:00",
  "11:40",
  "12:20",
  "13:00",
  "13:40",
  "14:20",
  "15:00",
  "15:40",
  "16:20",
  "17:00",
  "17:40",
  "18:00",
];

const SLOT_HINT: Record<Lang, string> = {
  en: "Greyed-out times are already booked",
  ru: "Серые часы уже забронированы",
  et: "Hallid kellaajad on juba broneeritud",
};

const PICK_DATE: Record<Lang, string> = {
  en: "Pick a date to see which slots are still free.",
  ru: "Выберите дату, чтобы увидеть свободные часы.",
  et: "Vali kuupäev, et näha vabu aegu.",
};

const NO_SLOTS: Record<Lang, string> = {
  en: "No times left on this date — please choose another day.",
  ru: "На эту дату свободных часов нет — выберите другой день.",
  et: "Sel kuupäeval pole vabu aegu — palun vali teine päev.",
};

const SIZE_NONE: Record<Lang, string> = {
  en: "Select size — not needed for other services",
  ru: "Выберите размер — не нужен для других услуг",
  et: "Vali suurus — pole muude teenuste puhul vajalik",
};

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

export function HomePage({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
    size: "",
    car: t.booking.carOptions[0] as string,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);

  // Times already booked for the selected date, loaded from Supabase
  const [takenToday, setTakenToday] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const loadBlockedDates = async () => {
    const { data, error } = await supabase.from("blocked_dates").select("blocked_date");
    if (error) return;
    setBlockedDates((data ?? []).map((r: { blocked_date: string }) => r.blocked_date));
  };

  useEffect(() => {
    void loadBlockedDates();
  }, []);

  const loadSlots = async (date: string) => {
    if (!date) {
      setTakenToday([]);
      return;
    }
    setLoadingSlots(true);
    setSlotError(false);
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_time")
      .eq("booking_date", date);
    if (error) {
      setSlotError(true);
      setTakenToday([]);
    } else {
      setTakenToday(
        (data ?? []).map((r: { booking_time: string | null }) =>
          normalizeTime(r.booking_time),
        ),
      );
    }
    setLoadingSlots(false);
  };

  useEffect(() => {
    void loadSlots(form.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date]);

  // Slots in the past are unavailable when the chosen date is today
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const isPast = (slot: string) => {
    if (!form.date || form.date !== toDateInput(now)) return false;
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
  };

  const dateBlocked = !!form.date && blockedDates.includes(form.date);

  const isUnavailable = (slot: string) =>
    dateBlocked || takenToday.includes(slot) || isPast(slot);

  const noFreeSlots = !!form.date && !loadingSlots && TIME_SLOTS.every((s) => isUnavailable(s));

  // Keep the selection valid whenever availability changes
  useEffect(() => {
    if (!form.date) return;
    if (isUnavailable(form.time)) {
      const free = TIME_SLOTS.find((s) => !isUnavailable(s));
      setForm((f) => ({ ...f, time: free ?? "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, form.time, takenToday, now]);


  const cost = useMemo(
    () => (form.size ? calcCost(form.size, form.car) : 0),
    [form.size, form.car],
  );

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || dateBlocked || isUnavailable(form.time)) return;
    setSubmitting(true);
    setSubmitError(null);

    // Re-check right before writing so two people can't grab the same slot
    const { data: clash, error: clashError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", form.date)
      .eq("booking_time", form.time)
      .limit(1);
    if (clashError) {
      setSubmitError(clashError.message);
      setSubmitting(false);
      return;
    }
    if (clash && clash.length > 0) {
      await loadSlots(form.date);
      setSubmitError(x.slotTaken);
      setSubmitting(false);
      return;
    }

    const row = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      booking_date: form.date,
      booking_time: form.time,
      wheel_size: form.size || null,
      car_type: form.car,
      notes: form.notes || null,
      estimated_cost: cost,
      status: "pending",
    };
    const { error } = await supabase.from("bookings").insert(row);
    // Refresh availability so the just-taken slot disappears immediately
    await loadSlots(form.date);
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    // Wait for both messages so deployment or provider errors are never hidden.
    try {
      const emailResponse = await fetch("/api/public/booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!emailResponse.ok) {
        const emailResult = (await emailResponse.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(emailResult?.error ?? `Email delivery failed (${emailResponse.status})`);
      }
    } catch (emailError) {
      setSubmitError(
        emailError instanceof Error ? emailError.message : "Email delivery failed",
      );
    }

    setConfirmed({ date: form.date, time: form.time });
    setSubmitted(true);
  };


  const whyIcons = [CarFront, CarTaxiFront, Car, KeyRound];

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
              <a
                key={l}
                href={LANG_PATH[l]}
                hrefLang={l}
                onClick={(e) => {
                  e.preventDefault();
                  setLang(l);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", LANG_PATH[l]);
                  }
                }}
                className={`px-3 py-1 rounded-full font-semibold uppercase transition-colors ${
                  lang === l ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </a>

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
              "linear-gradient(100deg, oklch(0.12 0.012 260 / 0.94) 0%, oklch(0.13 0.012 260 / 0.8) 38%, oklch(0.13 0.012 260 / 0.35) 70%, oklch(0.1 0.01 260 / 0.55) 100%), linear-gradient(180deg, oklch(0.12 0.012 260 / 0.5) 0%, transparent 40%, oklch(0.16 0.012 260) 100%)",
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

          <div className="grid gap-6 max-w-2xl mx-auto">
            <ServiceCard icon={<Disc className="h-7 w-7 text-primary-foreground" />} title={t.services.tire.title}>
              {t.services.tire.items.map(([name, price], i) => {
                const Icon = [Car, Gauge, CarFront, Truck, Bus, Caravan, Disc][i] || Car;
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
                {confirmed && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {confirmed.date} · {confirmed.time} · {cost}€
                  </p>
                )}
                {submitError && (
                  <p className="mx-auto mt-5 max-w-lg rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Your booking was saved, but the confirmation email could not be sent. Please call us if you need immediate confirmation. ({submitError})
                  </p>
                )}
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
                    <input
                      required
                      type="date"
                      min={toDateInput(now)}
                      value={form.date}
                      onChange={update("date")}
                      className={`${inputCls} ${dateBlocked ? "border-destructive" : ""}`}
                    />
                    {dateBlocked && (
                      <p className="mt-2 text-xs font-medium text-destructive">{x.dateBlocked}</p>
                    )}
                  </Field>
                  <div className="md:col-span-2 mt-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                        {x.timeLabel}
                      </span>
                      <span className="text-xs text-muted-foreground/80">
                        {loadingSlots ? "…" : slotError ? "" : SLOT_HINT[lang]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const taken = isUnavailable(slot);
                        const active = form.time === slot && !taken;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={taken}
                            aria-pressed={active}
                            onClick={() => setForm((f) => ({ ...f, time: slot }))}
                            className={`relative rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                              taken
                                ? "border-border/60 bg-muted text-muted-foreground/50 line-through cursor-not-allowed"
                                : active
                                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-brand"
                                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {!form.date && (
                      <p className="mt-3 text-xs text-muted-foreground">{PICK_DATE[lang]}</p>
                    )}
                    {noFreeSlots && !dateBlocked && (
                      <p className="mt-3 text-xs font-medium text-destructive">{NO_SLOTS[lang]}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Field label={t.booking.size}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {WHEEL_SIZES.map((s) => {
                          const active = form.size === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setForm((f) => ({ ...f, size: active ? "" : s }))}
                              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                                active
                                  ? "border-primary bg-primary/10 shadow-brand"
                                  : "border-border bg-background hover:border-primary"
                              }`}
                            >
                              <span
                                className={`grid place-items-center h-5 w-5 shrink-0 rounded-md border ${
                                  active ? "border-transparent bg-gradient-brand" : "border-border"
                                }`}
                              >
                                {active && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold">{s}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {calcCost(s, form.car)}€
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {!form.size && (
                        <p className="mt-2 text-xs text-muted-foreground">{SIZE_NONE[lang]}</p>
                      )}
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label={t.booking.car}>
                      <select value={form.car} onChange={update("car")} className={inputCls}>
                        {t.booking.carOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label={x.notesLabel}>
                      <textarea
                        rows={4}
                        value={form.notes}
                        onChange={update("notes")}
                        className={`${inputCls} resize-y min-h-[110px]`}
                        placeholder={x.notesPlaceholder}
                      />
                    </Field>
                  </div>
                </div>

                {submitError && (
                  <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {x.submitError} <span className="opacity-70">({submitError})</span>
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between flex-wrap gap-4 border-t border-border pt-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.booking.cost}</div>
                    <div className="font-display text-4xl text-gradient-brand mt-1">{cost}€</div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !form.date || !form.time || dateBlocked || noFreeSlots}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-8 py-4 text-sm font-semibold text-primary-foreground shadow-brand hover:brightness-110 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0"
                  >
                    {submitting ? x.sending : t.booking.submit}
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
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(EMAIL)}`}
              target="_blank"
              rel="noreferrer"
              className={contactCardCls}
            >
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
