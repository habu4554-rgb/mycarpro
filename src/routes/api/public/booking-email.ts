import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const OWNER_EMAIL = "habu4554@gmail.com";
const FROM = "MyCar Pro <onboarding@resend.dev>";

const payloadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  booking_date: z.string().min(1).max(40),
  booking_time: z.string().min(1).max(20),
  repair_service: z.string().max(160).nullish(),
  wheel_size: z.string().max(40).nullish(),
  car_type: z.string().max(80).nullish(),
  estimated_cost: z.union([z.number(), z.string()]).nullish(),
  notes: z.string().max(2000).nullish(),
});

type Payload = z.infer<typeof payloadSchema>;

function serviceLine(p: Payload) {
  return (
    [p.repair_service, p.wheel_size ? `Tyres ${p.wheel_size}` : null, p.car_type]
      .filter(Boolean)
      .join(" · ") || "Service booking"
  );
}

function esc(v: unknown) {
  return String(v ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`Resend failed [${res.status}] to=${to}: ${body}`);
    return { ok: false, status: res.status, body };
  }
  return { ok: true, status: res.status, body };
}

export const Route = createFileRoute("/api/public/booking-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["RESEND_API_KEY"];
        if (!apiKey) return new Response("RESEND_API_KEY is not configured", { status: 500 });

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }
        // Accept either a flat payload or a DB-trigger style { record: {...} }
        const candidate =
          raw && typeof raw === "object" && "record" in (raw as Record<string, unknown>)
            ? (raw as { record: unknown }).record
            : raw;

        const parsed = payloadSchema.safeParse(candidate);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const p = parsed.data;
        const when = `${p.booking_date} at ${p.booking_time}`;
        const service = serviceLine(p);
        const cost = p.estimated_cost ? `${p.estimated_cost}€` : "—";

        const clientHtml = `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
            <h2>Thank you for your booking, ${esc(p.name)}!</h2>
            <p>Your appointment at <strong>MyCar Pro</strong> is confirmed.</p>
            <table cellpadding="6">
              <tr><td><strong>Service</strong></td><td>${esc(service)}</td></tr>
              <tr><td><strong>Date &amp; time</strong></td><td>${esc(when)}</td></tr>
              <tr><td><strong>Estimated cost</strong></td><td>${esc(cost)}</td></tr>
            </table>
            <p>Address: Majaka põik 17, Tallinn<br/>Phone: +372 57476733</p>
            <p>See you soon!<br/>MyCar Pro</p>
          </div>`;

        const ownerHtml = `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
            <h2>New booking received</h2>
            <table cellpadding="6">
              <tr><td><strong>Client</strong></td><td>${esc(p.name)}</td></tr>
              <tr><td><strong>Email</strong></td><td>${esc(p.email)}</td></tr>
              <tr><td><strong>Service</strong></td><td>${esc(service)}</td></tr>
              <tr><td><strong>Date &amp; time</strong></td><td>${esc(when)}</td></tr>
              <tr><td><strong>Estimated cost</strong></td><td>${esc(cost)}</td></tr>
              <tr><td><strong>Notes</strong></td><td>${esc(p.notes ?? "—")}</td></tr>
            </table>
          </div>`;

        const [client, owner] = await Promise.all([
          sendEmail(apiKey, p.email, `Your MyCar Pro booking — ${when}`, clientHtml),
          sendEmail(apiKey, OWNER_EMAIL, `New booking: ${p.name} — ${when}`, ownerHtml),
        ]);

        // Until a domain is verified in Resend, mail to non-owner addresses is
        // rejected (403). Don't fail the booking for that — report per-email status.
        return new Response(
          JSON.stringify({
            ok: owner.ok,
            client,
            owner,
            note: client.ok
              ? undefined
              : "Customer email not sent — verify a domain at resend.com/domains and update the from address.",
          }),
          {
            status: owner.ok ? 200 : 502,
            headers: { "content-type": "application/json" },
          },
        );

      },
    },
  },
});
