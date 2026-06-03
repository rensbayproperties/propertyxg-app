import { SitePageShell } from "../_components/SitePageShell";

const PROJECTS = [
  {
    name: "Marina Heights",
    location: "Dubai Marina",
    handover: "Q4 2026",
    starting: "1.85M",
  },
  {
    name: "Palm Residences",
    location: "Palm Jumeirah",
    handover: "Q2 2027",
    starting: "4.20M",
  },
  {
    name: "Downtown Vista",
    location: "Downtown Dubai",
    handover: "Q3 2026",
    starting: "2.40M",
  },
  {
    name: "Creek Harbour Towers",
    location: "Dubai Creek Harbour",
    handover: "Q1 2027",
    starting: "1.50M",
  },
];

export default function PublicDxbProjectsPage() {
  return (
    <SitePageShell pageKey="dxb-projects">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">DXB Projects</h1>
          <p className="mt-2 text-muted-foreground">
            A selection of Dubai projects we work with.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <div
                key={p.name}
                className="overflow-hidden rounded-lg border bg-card"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-200 to-slate-400" />
                <div className="p-4">
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.location}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Handover {p.handover}
                    </span>
                    <span className="font-semibold">From AED {p.starting}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SitePageShell>
  );
}
