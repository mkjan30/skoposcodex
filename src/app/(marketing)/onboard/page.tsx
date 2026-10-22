import type { Metadata } from "next";
import { FileLock2, Lock, UserCheck, Zap } from "lucide-react";

import { OnboardingWizard } from "@/components/onboarding/wizard";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = {
  title: "Client Onboarding",
  description:
    "Share your business details, goals and assets so we can build your growth strategy.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/onboard" },
};

const badges = [
  { icon: Lock, title: "Secure & private", text: "Encrypted, stored privately, never shared." },
  { icon: Zap, title: "24-hour response", text: "A strategist reviews it within a day." },
  { icon: UserCheck, title: "Senior team", text: "Read by senior strategists only." },
  { icon: FileLock2, title: "NDA available", text: "Happy to sign one before we talk strategy." },
];

export default function OnboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Client onboarding"
        icon={<UserCheck className="text-brand size-3.5" aria-hidden />}
        title="Let's build your"
        highlight="growth strategy."
        description="Three quick steps, about 3 minutes. We’ll cover the rest on your kickoff call. Your answers save automatically in this browser."
        className="md:pb-16"
      >
        <ul className="grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <li key={b.title} className="bg-card flex gap-3 rounded-2xl border p-4">
              <span className="bg-brand/10 text-brand grid size-9 shrink-0 place-items-center rounded-lg">
                <b.icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{b.title}</span>
                <span className="text-muted-foreground text-sm">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container-page pb-24 md:pb-36">
        <Reveal className="bg-card rounded-3xl border p-5 sm:p-10">
          <noscript>
            <p className="text-muted-foreground">
              Onboarding needs JavaScript. Please enable it, or email us and we&apos;ll send the
              questions directly.
            </p>
          </noscript>
          <OnboardingWizard />
        </Reveal>
      </section>
    </>
  );
}
