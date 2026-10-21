import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Faq = { question: string; answer: string };

// Also emits FAQPage JSON-LD (TRD §10), so pages get rich results by just rendering this.
export function FaqAccordion({ items }: { items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Accordion type="single" collapsible className="divide-border border-y">
        {items.map((f, i) => (
          <AccordionItem key={f.question} value={`faq-${i}`}>
            <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline sm:text-lg">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5 text-base">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
