import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

// Placeholder; built in a later phase (docs/06-Implementation-Plan.md).
export default function ContactPage() {
  return (
    <section className="container-page py-24">
      <h1 className="text-4xl font-bold sm:text-6xl">Contact</h1>
      <p className="text-muted-foreground mt-4">Coming soon.</p>
    </section>
  );
}
