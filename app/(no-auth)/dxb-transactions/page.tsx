import { SitePageShell } from "../_components/SitePageShell";

const TRANSACTIONS = [
  {
    date: "Apr 18, 2026",
    type: "Sale",
    area: "Dubai Marina",
    bedrooms: "2BR",
    price: "2,650,000",
  },
  {
    date: "Apr 11, 2026",
    type: "Sale",
    area: "Downtown Dubai",
    bedrooms: "1BR",
    price: "1,840,000",
  },
  {
    date: "Apr 04, 2026",
    type: "Lease",
    area: "JBR",
    bedrooms: "3BR",
    price: "260,000 / yr",
  },
  {
    date: "Mar 28, 2026",
    type: "Sale",
    area: "Palm Jumeirah",
    bedrooms: "Villa",
    price: "12,500,000",
  },
];

export default function PublicDxbTransactionsPage() {
  return (
    <SitePageShell pageKey="dxb-transactions">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Recent transactions</h1>
          <p className="mt-2 text-muted-foreground">
            Anonymized snapshot of activity our team has helped close.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-card-alt text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">Beds</th>
                  <th className="px-4 py-3 text-right font-medium">Price (AED)</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t) => (
                  <tr key={`${t.date}-${t.area}`} className="border-t">
                    <td className="px-4 py-3">{t.date}</td>
                    <td className="px-4 py-3">{t.type}</td>
                    <td className="px-4 py-3">{t.area}</td>
                    <td className="px-4 py-3">{t.bedrooms}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {t.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SitePageShell>
  );
}
