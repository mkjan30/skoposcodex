import { Reveal } from "@/components/sections/reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Use "h1" for page heroes; sections default to h2. */
  as?: "h1" | "h2";
  className?: string;
};

// Dot + small label, white-fade heading, muted paragraph; the block rises in on scroll.
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: Props) {
  const center = align === "center";
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("flex items-center gap-2", center && "justify-center")}>
          <span className="bg-brand size-1.5 rounded-full" aria-hidden />
          <span className="section-label">{eyebrow}</span>
        </p>
      )}
      <Heading
        className={cn(
          "text-heading mt-5 font-bold tracking-tight",
          Heading === "h1"
            ? "text-5xl leading-[1.05] sm:text-7xl"
            : "text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1]",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-muted-foreground mt-5 text-lg",
            center ? "mx-auto max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
