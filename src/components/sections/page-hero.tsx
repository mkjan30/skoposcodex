import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Second heading line, shown in the brand gradient inside a glass pill. */
  highlight?: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons row. */
  actions?: React.ReactNode;
  /** Extra block under the hero (stat, badges…), lifted in last. */
  children?: React.ReactNode;
  className?: string;
};

// Inner-page version of the home hero: same glow and staggered page-load entrances (en-* classes).
export function PageHero({
  eyebrow,
  icon,
  title,
  highlight,
  description,
  actions,
  children,
  className,
}: Props) {
  return (
    <section
      className={cn("relative -mt-18 overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24", className)}
    >
      <div className="hero-glow" aria-hidden />
      <div className="container-page relative z-10 text-center">
        <div className="en-settle" style={{ animationDelay: ".12s" }}>
          <span className="pill-badge">
            {icon}
            {eyebrow}
          </span>
        </div>
        <h1 className="mx-auto mt-8 max-w-5xl text-[clamp(2.5rem,7vw,5.25rem)] leading-[1.04] font-semibold tracking-tight">
          <span className="text-heading en-wipe block pb-1" style={{ animationDelay: ".34s" }}>
            {title}
          </span>
          {highlight && " "}
          {highlight && (
            <span className="en-wipe mt-4 block" style={{ animationDelay: ".44s" }}>
              <span className="glass-pill">
                <span className="text-gradient">{highlight}</span>
              </span>
            </span>
          )}
        </h1>
        {description && (
          <p
            className="en-lift mx-auto mt-8 max-w-2xl text-[17px] leading-relaxed text-zinc-200 md:text-[19px]"
            style={{ animationDelay: ".74s", animationDuration: ".7s" }}
          >
            {description}
          </p>
        )}
        {actions && (
          <div
            className="en-lift-line mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: ".94s" }}
          >
            {actions}
          </div>
        )}
        {children && (
          <div
            className="en-lift mx-auto mt-14 md:mt-16"
            style={{ animationDelay: "1.08s", animationDuration: ".8s" }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
