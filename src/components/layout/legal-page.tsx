import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/sections/reveal";

// TODO(launch): have the policy texts reviewed by a lawyer before going live.
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Last updated ${updated}`} />
      <Reveal className="text-muted-foreground [&_a]:text-brand [&_h2]:text-foreground [&_strong]:text-foreground container-page max-w-3xl space-y-5 pb-24 leading-relaxed md:pb-36 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </Reveal>
    </>
  );
}
