"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Script from "next/script";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";

import { submitContact } from "@/app/actions/contact";
import { initialContactState } from "@/app/actions/contact-state";
import { Button } from "@/components/ui/button";
import { contactServices, type ContactField } from "@/lib/contact-services";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme: "dark" }) => string;
      reset: (widget: string) => void;
      remove: (widget: string) => void;
    };
  }
}

const fieldClass =
  "bg-background/60 placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-ring/40 aria-invalid:border-destructive w-full rounded-lg border px-4 text-base outline-none focus-visible:ring-3";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, action] = useActionState(submitContact, initialContactState);
  const [sourcePage, setSourcePage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Explicit render so the widget also appears after client-side navigation back to this page.
  const renderTurnstile = () => {
    if (!siteKey || !window.turnstile || !widgetRef.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      theme: "dark",
    });
  };

  useEffect(() => {
    setSourcePage(location.pathname + location.search);
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status !== "error") return;
    if (widgetId.current) window.turnstile?.reset(widgetId.current); // tokens are single-use
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true], [role=alert]")?.focus();
  }, [state]);

  if (state.status === "success") {
    const booking = process.env.NEXT_PUBLIC_BOOKING_URL;
    return (
      <div className="py-6 text-center" aria-live="polite">
        <CheckCircle2 className="text-brand mx-auto size-12" aria-hidden />
        <h2 ref={successRef} tabIndex={-1} className="mt-6 text-3xl font-bold outline-none">
          Thanks, {state.firstName}!
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md">
          A senior strategist will reply within 24 hours to set up your free strategy call. Check
          your inbox for a confirmation.
        </p>
        {booking && (
          <Button asChild variant="brand" size="xl" className="mt-8">
            <a href={booking} target="_blank" rel="noopener noreferrer">
              <CalendarClock /> Pick a time now
            </a>
          </Button>
        )}
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};
  const field = (name: ContactField) => ({
    id: name,
    name,
    defaultValue: v[name],
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${name}-error` : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className="space-y-5">
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={renderTurnstile}
        />
      )}

      {state.message && (
        <p
          role="alert"
          tabIndex={-1}
          className="border-destructive/40 bg-destructive/10 flex gap-2 rounded-lg border p-4 text-sm outline-none"
        >
          <AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      )}

      {/* Keyed so a failed submit remounts the fields with the echoed values as defaults;
          React resets uncontrolled forms after an action, and a <select> would lose its value. */}
      <div key={state.attempt ?? 0} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="fullName" required error={err.fullName}>
            <input
              {...field("fullName")}
              autoComplete="name"
              required
              className={cn(fieldClass, "h-12")}
            />
          </Field>
          <Field label="Email address" name="email" required error={err.email}>
            <input
              {...field("email")}
              type="email"
              autoComplete="email"
              required
              className={cn(fieldClass, "h-12")}
            />
          </Field>
          <Field label="Phone number" name="phone" error={err.phone}>
            <input
              {...field("phone")}
              type="tel"
              autoComplete="tel"
              className={cn(fieldClass, "h-12")}
            />
          </Field>
          <Field label="Company name" name="company" error={err.company}>
            <input
              {...field("company")}
              autoComplete="organization"
              className={cn(fieldClass, "h-12")}
            />
          </Field>
        </div>

        <Field label="Service you're interested in" name="service" required error={err.service}>
          <select
            {...field("service")}
            defaultValue={v.service ?? defaultService ?? ""}
            required
            className={cn(
              fieldClass,
              "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat",
            )}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239fb3c8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Select a service…
            </option>
            {contactServices.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Tell us about your business and goals"
          name="message"
          required
          error={err.message}
        >
          <textarea {...field("message")} required rows={6} className={cn(fieldClass, "py-3")} />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="sourcePage" value={sourcePage} />

      {siteKey && <div ref={widgetRef} className="min-h-[65px]" />}

      <SubmitButton />
      <p className="text-muted-foreground text-sm">
        By submitting, you agree to our{" "}
        <a href="/privacy" className="hover:text-foreground underline underline-offset-4">
          Privacy Policy
        </a>
        . No spam, ever.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: ContactField;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required && (
          <span className="text-brand" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="brand" size="xl" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Sending…
        </>
      ) : (
        <>
          Send message <ArrowRight />
        </>
      )}
    </Button>
  );
}
