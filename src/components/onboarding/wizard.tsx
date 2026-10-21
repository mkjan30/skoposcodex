"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";

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
import { businessFields, goalsFields, onboardingUploads } from "@/content/onboarding/shared";
import { getOnboardingService, onboardingServices } from "@/content/onboarding/services";
import { validateStep } from "@/lib/onboarding/schema";
import type {
  Field,
  FieldValue,
  ServiceKey,
  StepValues,
  UploadedFile,
} from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

// v2: 3-step form. Bumped so drafts saved by the old 6-step form start fresh instead of breaking.
const STORAGE_KEY = "onboard-draft-v2";
const STEPS = ["Service", "About you", "Goals"] as const;
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
  // Step 3 holds two groups (shared goals + this service's questions), validated together.
  const groups: Record<2 | 3, { key: StepKey; fields: Field[]; title?: string }[]> = {
    2: [{ key: "business", fields: businessFields }],
    3: [
      // Service questions first, so the optional "anything else?" box in goals comes last.
      {
        key: "details",
        fields: service?.details ?? [],
        title: `About your ${service?.label ?? "project"}`,
      },
      { key: "goals", fields: goalsFields, title: "Goals and budget" },
    ],
  };
  // Validates a step; when it passes, writes the cleaned values back (phone as
  // "(555) 123-4567", website with https://) so the form shows what will be saved.
  const validate = (n: 2 | 3) => {
    const errs: Record<string, string> = {};
    const cleaned: Partial<Record<StepKey, StepValues>> = {};
    for (const g of groups[n]) {
      const r = validateStep(g.fields, draft[g.key]);
      if (r.ok) cleaned[g.key] = r.data;
      else Object.assign(errs, r.errors);
    }
    if (!Object.keys(errs).length) {
      setDraft((d) => {
        if (!d) return d;
        const next = { ...d };
        for (const [k, v] of Object.entries(cleaned) as [StepKey, StepValues][]) {
          next[k] = { ...d[k], ...v };
        }
        return next;
      });
    }
    return errs;
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
    if (draft.service && hasAnswers(draft.details)) return setSwitchTo(key);
    setDraft({ ...draft, service: key });
    setErrors({});
  };

  const next = () => {
    if (step === 1 && !draft.service) {
      setErrors({ service: "Choose a service to continue." });
      focusAfterRender.current = "error";
      return;
    }
    if (step === 2) {
      const errs = validate(2);
      if (Object.keys(errs).length) {
        setErrors(errs);
        focusAfterRender.current = "error";
        return;
      }
    }
    goTo(step + 1);
  };

  const submit = async () => {
    if (!service) return goTo(1);
    const errs = validate(3);
    if (Object.keys(errs).length || uploading) {
      setErrors(errs);
      setMessage(uploading ? "Please wait for your upload to finish." : undefined);
      focusAfterRender.current = "error";
      return;
    }
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
    1: ["Which service are you starting with?", "Pick the main one — you can add more later."],
    2: ["About you", "So we know who we're working with and how to reach you."],
    3: [
      "What are you aiming for?",
      "A few quick answers. Anything else, we'll cover on the kickoff call.",
    ],
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
        <ol className="grid grid-cols-3 gap-2">
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
                    "text-[11px] font-semibold tracking-[0.1em] uppercase",
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

          {(step === 2 || step === 3) && (
            <div className="space-y-10">
              {groups[step].map((g) => (
                <div key={g.key}>
                  {g.title && <h3 className="mb-5 text-lg font-semibold">{g.title}</h3>}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {g.fields.map((f) => (
                      <FieldInput
                        key={`${g.key}.${f.name}`}
                        field={f}
                        value={draft[g.key][f.name]}
                        error={errors[f.name]}
                        onChange={(v) => setValue(g.key, f.name, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {step === 3 && (
                <>
                  {onboardingUploads.map((u) => (
                    <FileDrop
                      key={u.slot}
                      slot={u}
                      submissionId={draft.submissionId}
                      files={draft.files.filter((f) => f.slot === u.slot)}
                      totalFiles={draft.files.length}
                      onUploaded={(f) => setDraft((d) => d && { ...d, files: [...d.files, f] })}
                      onRemove={(path) =>
                        setDraft(
                          (d) => d && { ...d, files: d.files.filter((f) => f.path !== path) },
                        )
                      }
                      onBusyChange={onBusyChange}
                    />
                  ))}
                  {turnstileWidget}
                </>
              )}
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
        {step < STEPS.length ? (
          <Button type="button" variant="brand" size="xl" onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button
            type="button"
            variant="brand"
            size="xl"
            onClick={submit}
            disabled={submitting || uploading}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Submit <ArrowRight />
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
              Your answers to the {service?.label} questions will be cleared. Everything else,
              including uploaded files, is kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="brand-outline" onClick={() => setSwitchTo(null)}>
              Keep {service?.label}
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                // Only the service's own questions change; files and other answers stay.
                setDraft({ ...draft, service: switchTo!, details: {} });
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
