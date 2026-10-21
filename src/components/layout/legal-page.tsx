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
    <article className="container-page max-w-3xl py-16 sm:py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
      <p className="text-muted-foreground mt-4 text-sm">Last updated {updated}</p>
      <div className="text-muted-foreground [&_a]:text-brand [&_h2]:text-foreground [&_strong]:text-foreground mt-12 space-y-5 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
