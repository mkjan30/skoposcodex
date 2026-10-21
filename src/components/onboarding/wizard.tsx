"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  Pencil,
} from "lucide-react";

import { submitOnboarding } from "@/app/actions/onboarding";
import { FieldInput } from "@/components/onboarding/field-input";
import { FileDrop } from "@/components/onboarding/file-drop";
import { useTurnstile } from "@/components/turnstile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { businessFields, goalsFields } from "@/content/onboarding/shared";
import { getOnboardingService, onboardingServices } from "@/content/onboarding/services";
import { site } from "@/content/site";
import { validateStep } from "@/lib/onboarding/schema";
import type {
  Field,
  FieldValue,
  ServiceKey,
  StepValues,
  UploadedFile,
} from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "onboard-draft-v1";
const STEPS = ["Service", "Business", "Goals", "Details", "Documents", "Review"] as const;
type StepKey = "business" | "goals" | "details";

type Draft = {
  submissionId: string;
  step: number;
  maxStep: number;
  service?: ServiceKey;
  business: StepValues;
  goals: StepValues;
  details: StepValues;
  files: UploadedFile[];
};

const freshDraft = (): Draft => ({
  submissionId: crypto.randomUUID(),
  step: 1,
  maxStep: 1,
  business: {},
  goals: {},
  details: {},
  files: [],
});

function readDraft(): Draft | null {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Draft | null;
    return d && typeof d.submissionId === "string" && typeof d.step === "number" ? d : null;
  } catch {
    return null; // private mode / blocked storage: just start fresh
  }
}

const hasAnswers = (v: StepValues) =>
  Object.values(v).some((x) => (Array.isArray(x) ? x.length : x));
const display = (v: FieldValue | undefined) => (Array.isArray(v) ? v.join(", ") : (v ?? ""));

export function OnboardingWizard() {
  const [draft, setDraft] = useState<Draft | null>(null); // null until read on the client
  const [resume, setResume] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [busySlots, setBusySlots] = useState<Record<string, boolean>>({});
  const [switchTo, setSwitchTo] = useState<ServiceKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [doneName, setDoneName] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const focusAfterRender = useRef<"heading" | "error" | null>(null);
  const { widget: turnstileWidget, reset: resetTurnstile, token } = useTurnstile();

  useEffect(() => {
    const saved = readDraft();
    if (saved && (saved.step > 1 || saved.service)) setResume(saved);
    setDraft(freshDraft());
  }, []);

  // Autosave (debounced). Paused while the resume prompt is open so it can't overwrite the saved draft.
  useEffect(() => {
    if (!draft || resume || doneName) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [draft, resume, doneName]);

  // Move focus after step changes / failed validation (keyboard + screen reader users).
  useEffect(() => {
    if (focusAfterRender.current === "heading") {
      // Focus without the browser's own scroll, then bring the top of the wizard into view.
      headingRef.current?.focus({ preventScroll: true });
      topRef.current?.scrollIntoView({ block: "start" }); // CSS scroll-behavior: smooth, or instant under reduced motion
    }
    if (focusAfterRender.current === "error") {
      document.querySelector<HTMLElement>("[aria-invalid=true], [data-wizard-alert]")?.focus();
    }
    focusAfterRender.current = null;
  });

  const onBusyChange = useCallback(
    (slot: string, busy: boolean) =>
      setBusySlots((s) => (s[slot] === busy ? s : { ...s, [slot]: busy })),
    [],
  );

  if (!draft) return <div className="min-h-[480px]" aria-busy="true" />;

  if (doneName) {
    return (
      <div className="py-10 text-center" aria-live="polite">
        <CheckCircle2 className="text-brand mx-auto size-14" aria-hidden />
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl font-bold outline-none">
          You&apos;re all set, {doneName}!
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md">
          We&apos;ve received your onboarding details and emailed you a copy. A senior strategist
          will reach out within 24 hours to schedule your kickoff call.
        </p>
        <Button asChild variant="brand-outline" size="xl" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const service = getOnboardingService(draft.service);
  const { step } = draft;
  const fieldsFor: Record<2 | 3 | 4, { key: StepKey; fields: Field[] }> = {
    2: { key: "business", fields: businessFields },
    3: { key: "goals", fields: goalsFields },
    4: { key: "details", fields: service?.details ?? [] },
  };
  const uploading = Object.values(busySlots).some(Boolean);

  const goTo = (n: number) => {
    setDraft((d) => d && { ...d, step: n, maxStep: Math.max(d.maxStep, n) });
    setErrors({});
    setMessage(undefined);
    focusAfterRender.current = "heading";
  };

  const setValue = (key: StepKey, name: string, value: FieldValue) => {
    setDraft((d) => d && { ...d, [key]: { ...d[key], [name]: value } });
    if (errors[name])
      setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== name)));
  };

  const chooseService = (key: ServiceKey) => {
    if (key === draft.service) return;
    if (draft.service && (hasAnswers(draft.details) || draft.files.length)) return setSwitchTo(key);
    setDraft({ ...draft, service: key });
    setErrors({});
  };

  const next = () => {
    if (step === 1 && !draft.service) {
      setErrors({ service: "Choose a service to continue." });
      focusAfterRender.current = "error";
      return;
    }
    if (step >= 2 && step <= 4) {
      const { key, fields } = fieldsFor[step as 2 | 3 | 4];
      const r = validateStep(fields, draft[key]);
      if (!r.ok) {
        setErrors(r.errors);
        focusAfterRender.current = "error";
        return;
      }
    }
    if (step === 5 && uploading) {
      setMessage("Please wait for your uploads to finish.");
      focusAfterRender.current = "error";
      return;
    }
    goTo(step + 1);
  };

  const submit = async () => {
    if (!service) return goTo(1);
    setSubmitting(true);
    setMessage(undefined);
    const r = await submitOnboarding(
      {
        submissionId: draft.submissionId,
        service: service.key,
        business: draft.business,
        goals: draft.goals,
        details: draft.details,
        files: draft.files,
      },
      token(),
    ).catch(() => ({
      ok: false as const,
      message: "Network error — check your connection and try again.",
    }));
    setSubmitting(false);
    if (r.ok) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setDoneName(String(draft.business.contactName ?? "").split(/\s+/)[0] || "there");
      focusAfterRender.current = "heading";
      return;
    }
    resetTurnstile(); // tokens are single-use
    if ("step" in r && r.step) {
      goTo(r.step);
      setErrors(r.errors ?? {});
      setMessage(r.message);
      focusAfterRender.current = "error";
    } else {
      setMessage(r.message);
      focusAfterRender.current = "error";
    }
  };

  const titles: Record<number, [string, string]> = {
    1: [
      "Which service are you starting with?",
      "Pick the main service to launch first — you can add more later.",
    ],
    2: ["Tell us about your business", "The basics, so we know who we're working with."],
    3: ["What does success look like?", "Your goals and budget shape the whole plan."],
    4: [
      `${service?.label ?? "Service"} details`,
      "A few specifics so we can hit the ground running.",
    ],
    5: ["Files and access", "Upload anything useful — every upload is optional."],
    6: ["Review and submit", "Check your answers, then send them to our team."],
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {resume && (
        <div className="border-brand/40 bg-brand/10 mb-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold">Welcome back.</span>{" "}
            <span className="text-muted-foreground">
              You have an unfinished onboarding saved in this browser.
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="brand"
              size="lg"
              className="rounded-full px-5"
              onClick={() => {
                setDraft(resume);
                setResume(null);
                focusAfterRender.current = "heading";
              }}
            >
              Continue where I left off
            </Button>
            <Button
              variant="brand-outline"
              size="lg"
              className="rounded-full px-5"
              onClick={() => {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {}
                setResume(null);
              }}
            >
              Start over
            </Button>
          </div>
        </div>
      )}

      {/* Step indicator + progress */}
      <nav aria-label="Onboarding progress">
        <ol className="grid grid-cols-6 gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const reachable = n <= draft.maxStep && n !== step;
            const content = (
              <>
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full border text-sm font-semibold transition-colors",
                    n === step &&
                      "from-brand to-brand-strong text-primary-foreground border-transparent bg-gradient-to-br",
                    n < step && "border-brand/60 text-brand",
                    n > step && "text-muted-foreground",
                  )}
                >
                  {n < draft.maxStep && n !== step ? <Check className="size-4" aria-hidden /> : n}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] font-semibold tracking-[0.1em] uppercase sm:block",
                    n === step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </>
            );
            return (
              <li key={label} className="flex justify-center">
                {reachable ? (
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    className="focus-visible:ring-ring/50 flex flex-col items-center gap-2 rounded-lg outline-none focus-visible:ring-3"
                    aria-label={`Step ${n}: ${label}`}
                  >
                    {content}
                  </button>
                ) : (
                  <span
                    className="flex flex-col items-center gap-2"
                    aria-current={n === step ? "step" : undefined}
                    aria-label={`Step ${n}: ${label}`}
                  >
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <Progress
        value={((step - 1) / (STEPS.length - 1)) * 100}
        className="mt-5 h-1"
        aria-label="Progress"
      />
      <p className="text-muted-foreground mt-2 text-sm" aria-live="polite">
        Step {step} of {STEPS.length}: {STEPS[step - 1]}
      </p>

      <div className="mt-10">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none sm:text-3xl">
          {titles[step][0]}
        </h2>
        <p className="text-muted-foreground mt-2">{titles[step][1]}</p>

        {message && (
          <p
            role="alert"
            tabIndex={-1}
            data-wizard-alert
            className="border-destructive/40 bg-destructive/10 mt-6 flex gap-2 rounded-lg border p-4 text-sm outline-none"
          >
            <AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" aria-hidden />
            {message}
          </p>
        )}

        <div className="mt-8">
          {step === 1 && (
            <fieldset aria-describedby={errors.service ? "service-error" : undefined}>
              <legend className="sr-only">Service</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {onboardingServices.map((s, i) => {
                  const checked = draft.service === s.key;
                  return (
                    <label
                      key={s.key}
                      className={cn(
                        "react-card has-focus-visible:ring-ring/40 flex cursor-pointer gap-4 rounded-2xl border p-5 has-focus-visible:ring-3",
                        checked ? "border-brand/60 bg-brand/10" : "bg-background/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={s.key}
                        checked={checked}
                        onChange={() => chooseService(s.key)}
                        className="sr-only"
                        aria-invalid={i === 0 && errors.service ? true : undefined}
                      />
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                          checked && "border-brand bg-brand",
                        )}
                        aria-hidden
                      >
                        {checked && <Check className="text-primary-foreground size-3" />}
                      </span>
                      <span>
                        <span className="block font-semibold">{s.label}</span>
                        <span className="text-muted-foreground block text-sm">{s.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.service && (
                <p
                  id="service-error"
                  className="text-destructive mt-3 flex items-center gap-1.5 text-sm"
                >
                  <AlertCircle className="size-4" aria-hidden /> {errors.service}
                </p>
              )}
            </fieldset>
          )}

          {step >= 2 && step <= 4 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {fieldsFor[step as 2 | 3 | 4].fields.map((f) => {
                const key = fieldsFor[step as 2 | 3 | 4].key;
                return (
                  <FieldInput
                    key={`${key}.${f.name}`}
                    field={f}
                    value={draft[key][f.name]}
                    error={errors[f.name]}
                    onChange={(v) => setValue(key, f.name, v)}
                  />
                );
              })}
            </div>
          )}

          {step === 5 && service && (
            <div className="space-y-10">
              <div className="grid gap-8 lg:grid-cols-2">
                {service.uploads.map((u) => (
                  <FileDrop
                    key={u.slot}
                    slot={u}
                    submissionId={draft.submissionId}
                    files={draft.files.filter((f) => f.slot === u.slot)}
                    totalFiles={draft.files.length}
                    onUploaded={(f) => setDraft((d) => d && { ...d, files: [...d.files, f] })}
                    onRemove={(path) =>
                      setDraft((d) => d && { ...d, files: d.files.filter((f) => f.path !== path) })
                    }
                    onBusyChange={onBusyChange}
                  />
                ))}
              </div>

              <div className="bg-background/40 rounded-2xl border p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <KeyRound className="text-brand size-5" aria-hidden /> Give us access — never
                  passwords
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Please don&apos;t send passwords. Instead, invite{" "}
                  <span className="text-foreground font-medium">{site.contact.email}</span> as a
                  user on each platform you use. You can do this now or after your kickoff call.
                </p>
                <ul className="mt-5 space-y-4">
                  {service.access.map((a) => (
                    <li key={a.platform} className="flex gap-3">
                      <Check className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>
                        <span className="block font-medium">{a.platform}</span>
                        <span className="text-muted-foreground text-sm">{a.how}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {step === 6 && service && (
            <div className="space-y-6">
              {(
                [
                  [1, "Service", [{ label: "Primary service", value: service.label }]],
                  ...([2, 3, 4] as const).map((n) => [
                    n,
                    STEPS[n - 1] === "Details" ? `${service.label} details` : STEPS[n - 1],
                    fieldsFor[n].fields
                      .map((f) => ({
                        label: f.label,
                        value: display(draft[fieldsFor[n].key][f.name]),
                      }))
                      .filter((x) => x.value),
                  ]),
                  [
                    5,
                    "Files",
                    draft.files.map((f) => ({
                      label: f.slot.replace(/_/g, " "),
                      value: f.fileName,
                    })),
                  ],
                ] as [number, string, { label: string; value: string }[]][]
              ).map(([n, title, rows]) => (
                <section key={n} className="bg-background/40 rounded-2xl border p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goTo(n)}
                      aria-label={`Edit ${title}`}
                    >
                      <Pencil /> Edit
                    </Button>
                  </div>
                  {rows.length ? (
                    <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                      {rows.map((r) => (
                        <div key={r.label + r.value} className="contents">
                          <dt className="text-muted-foreground">{r.label}</dt>
                          <dd className="break-words whitespace-pre-wrap">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-muted-foreground mt-3 text-sm">Nothing added.</p>
                  )}
                </section>
              ))}
              {turnstileWidget}
            </div>
          )}
        </div>
      </div>

      {/* Navigation: sticky on mobile so it's always reachable */}
      <div className="bg-card/95 sticky bottom-0 z-10 -mx-5 mt-10 flex items-center justify-between gap-3 border-t px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
        <Button
          type="button"
          variant="brand-outline"
          size="xl"
          onClick={() => goTo(step - 1)}
          disabled={step === 1 || submitting}
        >
          <ArrowLeft /> Back
        </Button>
        {step < 6 ? (
          <Button
            type="button"
            variant="brand"
            size="xl"
            onClick={next}
            disabled={step === 5 && uploading}
          >
            {step === 5 && uploading ? (
              <>
                <Loader2 className="animate-spin" /> Uploading…
              </>
            ) : (
              <>
                Continue <ArrowRight />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" variant="brand" size="xl" onClick={submit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Submit onboarding <ArrowRight />
              </>
            )}
          </Button>
        )}
      </div>

      <Dialog open={switchTo !== null} onOpenChange={(open) => !open && setSwitchTo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Switch to {getOnboardingService(switchTo ?? undefined)?.label}?
            </DialogTitle>
            <DialogDescription>
              Your {service?.label} details and uploaded files will be cleared. Business and goals
              answers are kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="brand-outline" onClick={() => setSwitchTo(null)}>
              Keep {service?.label}
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                // New service = new step-4 questions, so steps after Goals must be redone.
                setDraft({
                  ...draft,
                  service: switchTo!,
                  details: {},
                  files: [],
                  maxStep: Math.min(draft.maxStep, 3),
                });
                setSwitchTo(null);
              }}
            >
              Switch service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
