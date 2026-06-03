import { SitePageShell } from "../_components/SitePageShell";

const POSTS = [
  {
    title: "Dubai property market — what's changed in 2026",
    excerpt:
      "A short look at where prices, demand, and inventory landed this year.",
    date: "Apr 12, 2026",
  },
  {
    title: "Off-plan vs ready: a practical comparison",
    excerpt:
      "When does it make sense to buy off-plan, and when is ready property the smarter call?",
    date: "Mar 30, 2026",
  },
  {
    title: "Five Marina towers worth a second look",
    excerpt:
      "Quietly excellent buildings that often slip under the radar.",
    date: "Mar 18, 2026",
  },
];

export default function PublicBlogsPage() {
  return (
    <SitePageShell pageKey="blogs">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Notes from our team on the Dubai market.
          </p>
          <div className="mt-8 space-y-4">
            {POSTS.map((p) => (
              <article
                key={p.title}
                className="rounded-lg border bg-card p-5 transition hover:border-brand"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {p.date}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SitePageShell>
  );
}
