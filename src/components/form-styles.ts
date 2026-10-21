// Shared input styling for the contact form and onboarding wizard.
export const fieldClass =
  "bg-background/60 placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-ring/40 aria-invalid:border-destructive w-full rounded-lg border px-4 text-base outline-none focus-visible:ring-3";

/** Chevron for native <select>s (appearance-none hides the browser's). */
export const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239fb3c8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};
export const selectClass =
  "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10";
