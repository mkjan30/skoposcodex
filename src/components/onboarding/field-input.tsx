"use client";

import { AlertCircle, Check } from "lucide-react";

import { fieldClass, selectArrow, selectClass } from "@/components/form-styles";
import type { Field, FieldValue } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

type Props = {
  field: Field;
  value: FieldValue | undefined;
  error?: string;
  onChange: (value: FieldValue) => void;
};

const AUTOCOMPLETE: Record<string, string> = {
  contactName: "name",
  businessName: "organization",
  email: "email",
  phone: "tel",
  websiteUrl: "url",
  streetAddress: "street-address",
  city: "address-level2",
  state: "address-level1",
  zip: "postal-code",
  country: "country-name",
};

/** Renders one catalogue field with label, help text and error, wired for screen readers. */
export function FieldInput({ field: f, value, error, onChange }: Props) {
  const id = `f-${f.name}`;
  const describedBy =
    [f.help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: f.name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": f.required || undefined,
  };
  const str = typeof value === "string" ? value : "";
  const arr = Array.isArray(value) ? value : [];
  const isGroup = f.type === "radio" || f.type === "checkboxes";

  const label = (
    <>
      {f.label}
      {f.required && (
        <span className="text-brand" aria-hidden>
          {" "}
          *
        </span>
      )}
    </>
  );

  let control: React.ReactNode;
  if (f.type === "textarea") {
    control = (
      <textarea
        {...common}
        rows={4}
        value={str}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, "py-3")}
      />
    );
  } else if (f.type === "select") {
    control = (
      <select
        {...common}
        value={str}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, selectClass, !str && "text-muted-foreground")}
        style={selectArrow}
      >
        <option value="">Select…</option>
        {f.options?.map((o) => (
          <option key={o} value={o} className="text-foreground">
            {o}
          </option>
        ))}
      </select>
    );
  } else if (isGroup) {
    const multi = f.type === "checkboxes";
    control = (
      <div className="flex flex-wrap gap-2">
        {f.options?.map((o, i) => {
          const checked = multi ? arr.includes(o) : str === o;
          return (
            <label
              key={o}
              className={cn(
                "has-focus-visible:ring-ring/40 flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors has-focus-visible:ring-3",
                checked
                  ? "border-brand/60 bg-brand/10 text-foreground"
                  : "text-muted-foreground hover:border-white/30",
              )}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={f.name}
                value={o}
                checked={checked}
                // Only the first input carries the ids, so error focus lands in the group.
                {...(i === 0 ? { id, "aria-invalid": common["aria-invalid"] } : {})}
                onChange={() =>
                  onChange(multi ? (checked ? arr.filter((x) => x !== o) : [...arr, o]) : o)
                }
                className="sr-only"
              />
              <Check className={cn("size-3.5", checked ? "text-brand" : "opacity-0")} aria-hidden />
              {o}
            </label>
          );
        })}
      </div>
    );
  } else {
    control = (
      <input
        {...common}
        type={f.type === "url" ? "text" : f.type}
        inputMode={f.type === "url" ? "url" : undefined}
        autoComplete={AUTOCOMPLETE[f.name] ?? "off"}
        value={str}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, "h-12")}
      />
    );
  }

  const helpAndError = (
    <>
      {f.help && (
        <p id={`${id}-help`} className="text-muted-foreground text-sm">
          {f.help}
          {f.type === "checkboxes" && f.max ? ` Choose up to ${f.max}.` : ""}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </>
  );

  return isGroup ? (
    <fieldset
      className={cn("space-y-2", !f.half && "sm:col-span-2")}
      aria-describedby={describedBy}
    >
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {control}
      {helpAndError}
    </fieldset>
  ) : (
    <div className={cn("space-y-2", !f.half && "sm:col-span-2")}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {control}
      {helpAndError}
    </div>
  );
}
