import { Quote, Star } from "lucide-react";

export type Testimonial = { quote: string; name: string; role: string; company: string };

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="bg-card flex h-full flex-col rounded-2xl border p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="text-brand flex gap-0.5" role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-4 fill-current" aria-hidden />
          ))}
        </div>
        <Quote className="text-brand/30 size-8" aria-hidden />
      </div>
      <blockquote className="mt-6 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
      <figcaption className="mt-6 border-t pt-6">
        <p className="font-semibold">{t.name}</p>
        <p className="text-muted-foreground text-sm">
          {t.role}, {t.company}
        </p>
      </figcaption>
    </figure>
  );
}
