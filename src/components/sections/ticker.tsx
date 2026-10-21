import { Sparkle } from "lucide-react";

// Pure CSS marquee: the list is rendered twice and shifted by -50%; the copy is aria-hidden.
// Under reduced motion it becomes a static wrapped list (see .animate-ticker in globals.css).
export function Ticker({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0"
    >
      {items.map((item) => (
        <li
          key={item}
          className="font-heading text-muted-foreground flex items-center gap-10 text-xl font-semibold whitespace-nowrap sm:text-2xl"
        >
          {item}
          <Sparkle className="text-brand size-4" aria-hidden />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={label}
      className="group overflow-hidden border-y [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8 motion-reduce:[mask-image:none]"
    >
      <div className="animate-ticker flex w-max group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
        {row(false)}
        <div className="contents motion-reduce:hidden">{row(true)}</div>
      </div>
    </section>
  );
}
