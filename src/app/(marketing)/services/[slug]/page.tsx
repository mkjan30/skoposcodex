import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { services } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: services.find((s) => s.slug === slug)?.title };
}

// Placeholder; the service template is built in Phase 3.
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <section className="container-page py-24">
      <h1 className="text-4xl font-bold sm:text-6xl">{service.title}</h1>
      <p className="text-muted-foreground mt-4">{service.summary}</p>
    </section>
  );
}
