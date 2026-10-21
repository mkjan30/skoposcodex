import type { Metadata } from "next";

export const metadata: Metadata = { title: "Why Us" };

// Placeholder; built in a later phase (docs/06-Implementation-Plan.md).
export default function WhyUsPage() {
  return (
    <section className="container-page py-24">
      <h1 className="text-4xl font-bold sm:text-6xl">Why Us</h1>
      <p className="text-muted-foreground mt-4">Coming soon.</p>
    </section>
  );
}
