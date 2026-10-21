import { cn } from "@/lib/utils";

// Pill chip whose label rolls up to reveal a brand-coloured copy on hover.
function Chip({ label }: { label: string }) {
  return (
    <span className="roll relative mr-4 block overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.03] px-7 py-3.5 text-lg font-medium text-white/90 backdrop-blur-sm">
      <span className="roll-text block whitespace-nowrap">{label}</span>
      <span
        className="roll-text text-brand absolute inset-x-7 top-full block whitespace-nowrap"
        aria-hidden
      >
        {label}
      </span>
    </span>
  );
}

/**
 * Two rows of industry chips drifting in opposite directions (CSS .marquee, paused on hover).
 * Each row renders the list twice and slides -50% for a seamless loop; the copy is aria-hidden.
 * Under reduced motion it becomes one static wrapped row.
 */
export function IndustriesMarquee({ items }: { items: string[] }) {
  return (
    <div className="space-y-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none]">
      {[false, true].map((reverse) => (
        <div
          key={String(reverse)}
          className={cn(
            "marquee flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3",
            reverse && "motion-reduce:hidden",
          )}
          data-reverse={reverse || undefined}
          aria-hidden={reverse || undefined}
        >
          <ul className="flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3">
            {items.map((item) => (
              <li key={item}>
                <Chip label={item} />
              </li>
            ))}
          </ul>
          <ul className="flex motion-reduce:hidden" aria-hidden>
            {items.map((item) => (
              <li key={item}>
                <Chip label={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
