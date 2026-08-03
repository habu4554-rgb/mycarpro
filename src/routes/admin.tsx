import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LogOut,
  RefreshCw,
  Search,
  XCircle,
  Wrench,
  LockKeyhole,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — MyCar Pro Bookings" },
      {
        name: "description",
        content:
          "Secure staff dashboard for MyCar Pro: review, confirm, complete and cancel tyre fitting and car repair bookings in Tallinn.",
      },
      { property: "og:title", content: "Admin Dashboard — MyCar Pro" },
      {
        property: "og:description",
        content: "Secure staff dashboard for managing MyCar Pro bookings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Status = "pending" | "confirmed" | "completed" | "cancelled";

type Booking = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  booking_date: string | null;
  booking_time: string | null;
  repair_service: string | null;
  wheel_size: string | null;
  car_type: string | null;
  estimated_cost: number | null;
  notes: string | null;
  status: string | null;
};

const STATUSES: Status[] = ["pending", "confirmed", "completed", "cancelled"];

const statusStyles: Record<Status, string> = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  confirmed: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

function todayInput(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normStatus(s: string | null): Status {
  const v = (s ?? "pending").toLowerCase();
  return (STATUSES as string[]).includes(v) ? (v as Status) : "pending";
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition";

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return session ? <Dashboard email={session.user.email ?? ""} /> : <SignIn />;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft">
        <img src={logo} alt="MyCar Pro" width={160} height={160} className="h-10 w-auto mb-6" />
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3">
          <LockKeyhole className="h-3.5 w-3.5" /> Staff only
        </div>
        <h1 className="font-display text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-7">
          Sign in with your MyCar Pro staff account to manage bookings.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@mycarpro.ee"
            className={inputCls}
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputCls}
          />
          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand hover:brightness-110 transition disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, name, phone, email, booking_date, booking_time, repair_service, wheel_size, car_type, estimated_cost, notes, status",
      )
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });
    if (error) setError(error.message);
    else setRows((data ?? []) as Booking[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: Status) => {
    setBusyId(id);
    setError(null);
    const prev = rows;
    setRows((r) => r.map((b) => (b.id === id ? { ...b, status } : b)));
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      setRows(prev);
      setError(error.message);
    }
    setBusyId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const stats = useMemo(() => {
    const today = todayInput();
    const base = { pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0 };
    for (const b of rows) {
      base[normStatus(b.status)] += 1;
      if (b.booking_date === today) base.today += 1;
    }
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((b) => {
      if (q && !(b.name ?? "").toLowerCase().includes(q)) return false;
      if (dateFilter && b.booking_date !== dateFilter) return false;
      if (statusFilter !== "all" && normStatus(b.status) !== statusFilter) return false;
      return true;
    });
  }, [rows, query, dateFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="MyCar Pro" width={160} height={160} className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <h1 className="font-display text-lg truncate sm:text-xl">Admin Dashboard</h1>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold hover:border-primary hover:text-primary transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold hover:border-primary hover:text-primary transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Pending" value={stats.pending} icon={<Clock className="h-4 w-4" />} />
          <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2 className="h-4 w-4" />} />
          <StatCard label="Completed" value={stats.completed} icon={<Wrench className="h-4 w-4" />} />
          <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle className="h-4 w-4" />} />
          <StatCard
            label="Today's appointments"
            value={stats.today}
            icon={<CalendarDays className="h-4 w-4" />}
          />
        </div>

        {/* FILTERS */}
        <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer name…"
              className={`${inputCls} pl-10`}
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={inputCls}
          />
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
              className={inputCls}
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0]!.toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            {(query || dateFilter || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setQuery("");
                  setDateFilter("");
                  setStatusFilter("all");
                }}
                className="shrink-0 rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* TABLE (desktop) */}
        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-soft lg:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                {["Customer", "Phone", "Email", "Date", "Time", "Repair service", "Wheel size", "Car type", "Cost", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-surface/60 transition">
                  <td className="px-4 py-3 font-semibold">{b.name || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {b.phone ? <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-primary">{b.phone}</a> : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {b.email ? (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(b.email)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {b.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{b.booking_date || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{(b.booking_time ?? "").slice(0, 5) || "—"}</td>
                  <td className="px-4 py-3">{b.repair_service || "—"}</td>
                  <td className="px-4 py-3">{b.wheel_size || "—"}</td>
                  <td className="px-4 py-3">{b.car_type || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary">
                    {b.estimated_cost != null ? `${b.estimated_cost}€` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={normStatus(b.status)} />
                  </td>
                  <td className="px-4 py-3">
                    <Actions
                      status={normStatus(b.status)}
                      busy={busyId === b.id}
                      onChange={(s) => void setStatus(b.id, s)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No bookings match your filters.</p>
          )}
        </div>

        {/* CARDS (mobile / tablet) */}
        <div className="mt-6 space-y-3 lg:hidden">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="truncate font-display text-lg">{b.name || "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.booking_date || "—"} · {(b.booking_time ?? "").slice(0, 5) || "—"}
                  </div>
                </div>
                <StatusBadge status={normStatus(b.status)} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <Row label="Phone" value={b.phone} />
                <Row label="Email" value={b.email} />
                <Row label="Repair service" value={b.repair_service} />
                <Row label="Wheel size" value={b.wheel_size} />
                <Row label="Car type" value={b.car_type} />
                <Row label="Cost" value={b.estimated_cost != null ? `${b.estimated_cost}€` : null} />
              </dl>
              <div className="mt-4 border-t border-border pt-4">
                <Actions
                  status={normStatus(b.status)}
                  busy={busyId === b.id}
                  onChange={(s) => void setStatus(b.id, s)}
                />
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No bookings match your filters.</p>
          )}
        </div>

        {loading && <p className="mt-6 text-center text-sm text-muted-foreground">Loading bookings…</p>}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value || "—"}</dd>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 font-display text-3xl text-gradient-brand">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function Actions({
  status,
  busy,
  onChange,
}: {
  status: Status;
  busy: boolean;
  onChange: (s: Status) => void;
}) {
  const btn =
    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy || status === "confirmed"}
        onClick={() => onChange("confirmed")}
        className={`${btn} border-sky-400/40 text-sky-300 hover:bg-sky-400/10`}
      >
        Confirm
      </button>
      <button
        type="button"
        disabled={busy || status === "completed"}
        onClick={() => onChange("completed")}
        className={`${btn} border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10`}
      >
        Complete
      </button>
      <button
        type="button"
        disabled={busy || status === "cancelled"}
        onClick={() => onChange("cancelled")}
        className={`${btn} border-destructive/40 text-destructive hover:bg-destructive/10`}
      >
        Cancel
      </button>
    </div>
  );
}
