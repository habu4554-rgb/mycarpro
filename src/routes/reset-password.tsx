import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPassword,
  head: () => ({
    meta: [
      { title: "Reset Password — MyCar Pro" },
      {
        name: "description",
        content: "Reset your MyCar Pro staff account password.",
      },
      { property: "og:title", content: "Reset Password — MyCar Pro" },
      {
        property: "og:description",
        content: "Reset your MyCar Pro staff account password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition";

function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recoveryType, setRecoveryType] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    setRecoveryType(hash.includes("type=recovery"));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.navigate({ to: "/admin" });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft">
        <img src={logo} alt="MyCar Pro" width={160} height={160} className="h-10 w-auto mb-6" />
        <h1 className="font-display text-3xl mb-2">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-7">
          Choose a new password for your MyCar Pro staff account.
        </p>

        {!recoveryType && !success && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 mb-4">
            This page is only valid when opened from a password-recovery email. Please request a new link from the admin sign-in page.
          </div>
        )}

        {success ? (
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            Password updated. Redirecting you to the admin dashboard…
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              minLength={6}
              className={inputCls}
            />
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={6}
              className={inputCls}
            />
            {error && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || !recoveryType}
              className="w-full rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand hover:brightness-110 transition disabled:opacity-60"
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
