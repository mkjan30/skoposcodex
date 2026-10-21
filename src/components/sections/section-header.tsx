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

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="text-brand text-xs font-semibold tracking-[0.12em] uppercase">{eyebrow}</p>
      )}
      <Heading
        className={cn(
          "mt-4 font-bold",
          Heading === "h1"
            ? "text-5xl leading-[1.05] sm:text-7xl"
            : "text-3xl leading-tight sm:text-5xl",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="text-muted-foreground mt-5 text-base sm:text-lg">{description}</p>
      )}
    </div>
  );
}
