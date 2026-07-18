# Metric Definitions

> Demo note: this is a portfolio sample by Amrudin Catic
> ([amrudincatic.com](https://amrudincatic.com)). It documents the analytics
> setup for a marketing ops dashboard that runs on simulated data, and mirrors
> the tracking work delivered for real clients.

The formulas below are the exact math implemented in `src/data/metrics.js`.
Every KPI tile, chart, and table column in the dashboard traces back to one
of these rows. Nothing here is aspirational or simplified for the doc, it is
a description of the code.

| Metric | Formula | Notes |
| --- | --- | --- |
| Spend | sum(spend) | Sum of daily spend across the filtered rows |
| Leads | sum(leads) | Sum of daily leads across the filtered rows |
| Revenue | sum(revenue) | Sum of daily revenue across the filtered rows |
| CPL (Cost Per Lead) | Spend / Leads | Lower is better |
| ROAS (Return On Ad Spend) | Revenue / Spend | Higher is better, expressed as a multiple (for example 4.20x) |
| CAC (Customer Acquisition Cost) | Spend / Customers | Lower is better |
| CTR (Click-Through Rate) | Clicks / Impressions | Expressed as a percentage |
| CPC (Cost Per Click) | Spend / Clicks | Lower is better |
| Lead CVR (Lead Conversion Rate) | Leads / Visitors | Visitor-to-lead conversion, expressed as a percentage |
| Funnel step rate | stage count / previous stage count | Applied at each funnel stage (Visitors, Leads, MQL, SQL, Customers) to show stage-to-stage conversion |

Divide-by-zero yields 0. If the denominator of any formula above is zero
(for example zero spend in a filtered range), the metric renders as 0 instead
of `Infinity` or `NaN`.

## Where these live in code

- `sumMetrics(rows)` computes the raw sums (spend, leads, revenue, clicks,
  impressions, visitors, customers, and so on) for a filtered set of rows.
- `deriveKpis(totals)` computes CPL, ROAS, CAC, CTR, CPC, and CVR from those
  sums using the safe-divide helper described above.
- `buildFunnel(totals)` computes each stage's count, its share of the top of
  funnel (`pctOfTop`), and its `stepRate` against the immediately preceding
  stage.
- `byChannel(rows)` re-runs the same sum and derive steps once per channel so
  the channel breakdown table and charts use identical math to the top-level
  KPI tiles, just scoped to one channel's rows.
