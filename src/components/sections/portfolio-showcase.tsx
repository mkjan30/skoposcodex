import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import type { PortfolioProject } from "@/content/portfolio";
import { cn } from "@/lib/utils";

// Hovering (or focusing the project link) slowly scrolls each screenshot from top to bottom.
// Reduced motion keeps it at the top.
const scrollShot =
  "object-cover object-top transition-[object-position] duration-[7000ms] ease-in-out group-hover:object-bottom group-focus-within:object-bottom motion-reduce:group-hover:object-top motion-reduce:group-focus-within:object-top";

function Showcase({ p }: { p: PortfolioProject }) {
  const host = new URL(p.url).host;
  return (
    <div className="relative pr-10 pb-12 sm:pr-16">
      {/* Desktop: browser window */}
      <div className="bg-card overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
          </span>
          <span className="text-muted-foreground mx-auto truncate rounded-md bg-white/5 px-3 py-1 text-xs">
            {host}
          </span>
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src={p.desktop}
            alt={`${p.name} website on desktop`}
            fill
            sizes="(min-width: 1024px) 680px, 100vw"
            placeholder="blur"
            className={scrollShot}
          />
        </div>
      </div>

      {/* Mobile: phone overlapping the bottom-right corner */}
      <div className="absolute right-0 bottom-0 w-[30%] max-w-[190px] min-w-[110px] rounded-[1.6rem] border-[5px] border-[#1a2433] bg-[#1a2433] shadow-[0_25px_60px_-15px_rgb(0_0_0/0.9)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.2rem]">
          <Image
            src={p.mobile}
            alt={`${p.name} website on mobile`}
            fill
            sizes="190px"
            placeholder="blur"
            className={scrollShot}
          />
        </div>
      </div>
    </div>
  );
}

/** "Recent work": desktop + mobile previews with a live link for each project. */
export function PortfolioShowcase({ projects }: { projects: PortfolioProject[] }) {
  return (
    <section className="container-page pb-24 md:pb-36">
      <SectionHeader
        eyebrow="Recent work"
        title={
          <>
            Websites we&apos;ve <span className="text-gradient">designed and built</span>
          </>
        }
        description="Real sites, live today. Hover a preview to scroll through it, or open the live site."
        className="mb-14"
      />
      <ul className="space-y-20 sm:space-y-28">
        {projects.map((p, i) => (
          <li key={p.url}>
            <Reveal
              className={cn(
                "group grid items-center gap-10 lg:gap-14",
                i % 2 === 0 ? "lg:grid-cols-[1.45fr_1fr]" : "lg:grid-cols-[1fr_1.45fr]",
              )}
            >
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <Showcase p={p} />
              </div>
              <div>
                <p className="section-label">{p.industry}</p>
                <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{p.name}</h3>
                <p className="text-muted-foreground mt-4">{p.summary}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <Check className="text-brand size-4 shrink-0" aria-hidden /> {h}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="brand-outline" size="xl" className="mt-8">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    Visit live site <ArrowUpRight />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
