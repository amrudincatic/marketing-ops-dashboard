# GA4 and GTM Setup Checklist

> Demo note: this is a portfolio sample by Amrudin Catic
> ([amrudincatic.com](https://amrudincatic.com)). It documents the analytics
> setup for a marketing ops dashboard that runs on simulated data, and mirrors
> the tracking work delivered for real clients.

A practical, in-order checklist for standing up the tracking plan in
`tracking-plan.md` on a real site. This is written the way it would be handed
to a data or engineering team, not as a conceptual overview.

1. **Create the GA4 property.** One property per brand or product, one data
   stream per site or app. Note the Measurement ID (`G-XXXXXXX`).
2. **Install GA4 via GTM, not the raw gtag.js snippet.** Add the GTM
   container snippet to the site's `<head>`, then configure a GA4
   Configuration tag inside GTM pointed at the Measurement ID. This keeps all
   future tagging changes deployable without a code release.
3. **Wire the base dataLayer.** Ship the `user` and `attribution` objects
   (see `datalayer-schema.md`) on every page load before GTM fires, so every
   subsequent event push can read them.
4. **Define custom events in GTM.** For each event in `tracking-plan.md`,
   create a Custom Event trigger matching the event name, and a GA4 Event tag
   that reads the relevant dataLayer variables into GA4 event parameters.
   Use the built-in GA4 Ecommerce tag type for `purchase` specifically, so
   `value` and `currency` populate GA4 revenue reporting correctly.
5. **Mark key events as conversions.** In GA4 Admin, under Events, mark
   `lead_created`, `demo_requested`, and `purchase` as key events
   (conversions). These are the three moments that matter for marketing
   attribution and should drive Google Ads and Meta conversion imports.
6. **Configure UTM conventions.** Enforce lowercase, hyphenated `utm_source`,
   `utm_medium`, and `utm_campaign` values across every paid and email
   platform (for example `utm_source=google`, `utm_medium=cpc`). Inconsistent
   casing or naming silently splits channel data in reporting.
7. **Set up channel grouping.** Confirm GA4's default channel grouping
   correctly buckets traffic into the five channels this dashboard tracks
   (Google Ads, Meta, LinkedIn, Organic Search, Email). Override the default
   rules in GA4 Admin if any paid channel is landing in "Unassigned" or
   "Referral" instead of its own paid bucket.
8. **Connect server-side events.** Route `mql_qualified` and `sql_accepted`
   from the CRM or marketing automation platform into GTM's server-side
   container (or directly into GA4 via the Measurement Protocol), keyed on
   `lead_id`, so the funnel stitches together across systems instead of
   stopping at `lead_created`.
9. **Connect GA4 to the dashboard export.** Export GA4 data (via BigQuery
   linking, or the GA4 Data API) into whatever feeds this dashboard's data
   layer, matching the row shape in `src/data/mockData.json`
   (`date`, `channel`, `spend`, `impressions`, `clicks`, `visitors`, `leads`,
   `mql`, `sql`, `customers`, `revenue`). In production this replaces the
   seeded mock generator with a real, scheduled ETL job.
10. **Validate before launch.** Use GTM Preview mode plus GA4 DebugView to
    confirm every event in `tracking-plan.md` fires with the correct
    properties before publishing the container.
