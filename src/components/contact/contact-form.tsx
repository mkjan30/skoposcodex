"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";

import { submitContact } from "@/app/actions/contact";
import { initialContactState } from "@/app/actions/contact-state";
import { fieldClass, selectArrow, selectClass } from "@/components/form-styles";
import { useTurnstile } from "@/components/turnstile";
import { Button } from "@/components/ui/button";
import { contactServices, type ContactField } from "@/lib/contact-services";
import { formatUsPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, action] = useActionState(submitContact, initialContactState);
  const [sourcePage, setSourcePage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const { widget: turnstileWidget, reset: resetTurnstile } = useTurnstile();

  useEffect(() => setSourcePage(location.pathname + location.search), []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status !== "error") return;
    resetTurnstile(); // tokens are single-use
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true], [role=alert]")?.focus();
  }, [state, resetTurnstile]);

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
              inputMode="tel"
              placeholder="(555) 123-4567"
              // Uncontrolled input: format the DOM value in place as the user types.
              onInput={(e) => (e.currentTarget.value = formatUsPhone(e.currentTarget.value))}
              // Autofill/password managers can fill without input events; format on blur too.
              onBlur={(e) => (e.currentTarget.value = formatUsPhone(e.currentTarget.value))}
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
            className={cn(fieldClass, selectClass)}
            style={selectArrow}
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

      {turnstileWidget}

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
