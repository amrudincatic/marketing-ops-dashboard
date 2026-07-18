# SIGNAL, a Marketing Ops Dashboard

A full-funnel marketing operations dashboard: one screen that shows how a
company's marketing is performing, from ad spend all the way to customers and
revenue, across every channel.

> **This is a demonstration project.** It is a self-contained sample built to
> show the kind of marketing analytics and reporting work I deliver for clients.
> All numbers are simulated. There is no backend, no login, and no real ad
> account or CRM connected. It runs entirely in your browser on realistic
> sample data, so it is safe to open and share without exposing anyone's real
> campaign numbers.

Built by Amrudin Catic. More of my work: [amrudincatic.com](https://amrudincatic.com).

## What is this, in plain words

Marketing teams spend money in a lot of places (Google Ads, Meta, LinkedIn,
search/SEO, email) and it is hard to see, at a glance, what is actually working.
This dashboard pulls it all into a single view and answers the questions a
business owner or marketing lead actually asks:

- How much are we spending, and what are we getting back for it?
- Where are the leads and customers coming from?
- Which channels make money, and which ones lose it?
- Where do people drop off on the way to becoming customers?

You can change the time range (last 7, 30, or 90 days) and turn individual
channels on and off. Every number, chart, and table on the screen updates
instantly to match.

## Why this matters (what a client gets)

Most businesses have their marketing data scattered across five different
tools that each tell a slightly different story. The value here is not the
chart, it is the single source of truth behind it:

- **One honest view of the whole funnel**, from a visitor landing on the site
  to a paying customer, with the drop-off rate at every step.
- **True cost and return per channel**, so budget goes to what works instead of
  what is loudest.
- **Definitions everyone agrees on.** "Cost per lead" and "return on ad spend"
  mean exactly one thing here, documented, so reports stop contradicting each
  other.
- **A measurement plan that makes the data trustworthy in the first place**
  (see "The analytics setup" below). This is the unglamorous part that most
  dashboards skip, and it is the reason the numbers can be believed.

## How to read the dashboard

- **Top row (the KPIs):** the headline numbers. Spend, Leads, Cost Per Lead
  (CPL), Return On Ad Spend (ROAS), Revenue, and Customer Acquisition Cost
  (CAC). Each shows how it changed versus the previous period, and a small
  trend line. Green means the change is good, red means it needs attention (for
  example, CPL going down is good, so a drop shows green).
- **Funnel:** the journey from Visitors to Leads to Marketing Qualified Leads
  (MQL) to Sales Qualified Leads (SQL) to Customers, with the conversion rate
  between each step. This is where you spot the leaks.
- **Trend:** how spend, revenue, or leads moved day by day over the selected
  period.
- **ROAS by channel:** which channels return the most for every dollar spent.
- **Spend mix:** where the budget is actually going.
- **Channel breakdown:** the full table, sortable by any column, for the people
  who want the detail behind the charts.

## The analytics setup (the part clients rely on but never see)

A dashboard is only as trustworthy as the tracking behind it. This project
includes the measurement plan a marketing engineer would hand to a data or
web team, in [`docs/analytics/`](docs/analytics/):

- **`tracking-plan.md`** - the list of events to track (page views, form
  submissions, demo requests, purchases) and which funnel stage each one feeds.
- **`datalayer-schema.md`** - the exact data structure to push into Google Tag
  Manager, with examples.
- **`metric-definitions.md`** - the precise formula for every KPI. These match
  the dashboard's actual math exactly, so the documentation and the product can
  never drift apart.
- **`ga4-setup.md`** - a practical Google Analytics 4 and GTM setup checklist.

## Screenshot

![Marketing ops dashboard showing KPIs, funnel, trend, channel charts, and a data table in a neon synthwave theme](docs/screenshot.png)

## What this project demonstrates about my work

- Full-funnel marketing operations thinking, from spend to revenue.
- The engineering to make it real: the filters genuinely recompute every metric
  in the browser (no faked static charts), and the money math is unit tested.
- The measurement discipline (tracking plan, dataLayer schema, agreed metric
  definitions) that makes marketing reporting trustworthy.
- Product and design sense: a distinctive, considered interface rather than a
  templated one.

## Tech

React, Vite, and Recharts. Plain CSS with a design-token system. Tested with
Vitest and React Testing Library. Deployed as a static site to GitHub Pages.
No backend and no database, by design: the dashboard reads from a seeded,
realistic sample dataset through a small data-service layer that behaves like
an API.

## Running it locally

```bash
npm install
npm run gen:data
npm run dev
```

Then open the local URL that Vite prints in the terminal.

Run the tests:

```bash
npm test
```

Build the production site:

```bash
npm run build
```

## Live link and deployment

Once this repository is pushed to GitHub and Pages is enabled (source: GitHub
Actions), the included workflow at `.github/workflows/deploy.yml` builds and
deploys the site automatically on every push to `main`. The live URL will be:

```
https://<your-username>.github.io/marketing-ops-dashboard/
```

## About

I am Amrudin Catic, a marketing engineer who works across paid media, SEO, AI
workflows, and growth systems, and ships the product too, not just the funnel.
This dashboard is a small proof-of-work sample. To see more or to talk about a
project, visit [amrudincatic.com](https://amrudincatic.com).

## A note on the data

Every number here is generated by a seeded sample-data script
(`npm run gen:data`), not pulled from a live ad account or CRM. It is shaped to
look and behave like real marketing data so the interactivity and the math can
be judged honestly, without exposing any real client's campaign numbers.
