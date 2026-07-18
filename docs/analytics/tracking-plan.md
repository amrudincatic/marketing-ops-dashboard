# Tracking Plan

> Demo note: this is a portfolio sample by Amrudin Catic
> ([amrudincatic.com](https://amrudincatic.com)). It documents the analytics
> setup for a marketing ops dashboard that runs on simulated data, and mirrors
> the tracking work delivered for real clients.

This is the event tracking plan behind the marketing ops dashboard. It defines
every event a marketing engineer would implement through Google Tag Manager
(GTM) to feed the funnel this dashboard visualizes (Visitors, Leads, MQL, SQL,
Customers).

## Naming convention

- Events use `snake_case` and an `object_action` shape, for example
  `form_submit`, `lead_created`, `cta_click`. This keeps event names readable
  in GA4's event list and consistent with GTM's default trigger naming.
- Every event carries a shared attribution payload: `channel` plus the
  standard UTM fields (`utm_source`, `utm_medium`, `utm_campaign`, and
  `utm_term` and `utm_content` where relevant). This lets any event be joined
  back to the channel breakdown used elsewhere in the dashboard (Google Ads,
  Meta, LinkedIn, Organic Search, Email) without a separate lookup.
- Properties are flat and typed consistently: monetary values are numbers in
  minor-unit-free decimal form (`149.00`, not `"$149"`), identifiers are
  strings, and timestamps are ISO 8601.

## Event taxonomy

| Event name | Trigger | Key properties | Funnel stage |
| --- | --- | --- | --- |
| `page_view` | Standard GTM history change / initial load trigger fires on every route render | `page_path`, `page_title`, `referrer`, `channel`, `utm_source`, `utm_medium`, `utm_campaign` | Visitors |
| `cta_click` | Click trigger on primary CTA elements (`data-cta` attribute) such as "Book a demo" or "Start free trial" | `cta_id`, `cta_label`, `page_path`, `channel`, `utm_source`, `utm_medium` | Visitors |
| `form_start` | Trigger fires on first `focus` inside a lead-capture form (dedup by `form_id` per session) | `form_id`, `form_name`, `page_path`, `channel`, `utm_source`, `utm_campaign` | Visitors |
| `form_submit` | Custom event pushed by the form handler on successful client-side validation, before the network call resolves | `form_id`, `form_name`, `fields_completed`, `channel`, `utm_source`, `utm_medium`, `utm_campaign` | Leads |
| `lead_created` | Server-side or CRM webhook confirms the lead record was persisted (fires after `form_submit`, decoupled from client validation) | `lead_id`, `lead_source`, `email_domain`, `company_size`, `channel`, `utm_source`, `utm_campaign` | Leads |
| `mql_qualified` | Marketing automation platform (for example HubSpot or Marketo) pushes a server-side event when lead score crosses the MQL threshold | `lead_id`, `lead_score`, `qualification_reason`, `channel` | MQL |
| `sql_accepted` | Sales team accepts the lead in the CRM (SQL handoff), pushed via CRM webhook into GTM server container | `lead_id`, `opportunity_id`, `owner_id`, `channel` | SQL |
| `demo_requested` | Custom event fired when a user completes the demo-booking flow (calendar confirmation step) | `lead_id`, `demo_date`, `demo_type`, `channel`, `utm_source` | SQL |
| `purchase` | Fires on the order confirmation / thank-you page, or server-side via payment webhook | `transaction_id`, `value`, `currency`, `plan`, `channel`, `utm_source`, `utm_medium`, `utm_campaign` | Customers |

## Notes on implementation

- `page_view`, `cta_click`, and `form_start` are client-side events pushed
  directly to `dataLayer` by the site.
- `form_submit` is client-side (confirms intent) while `lead_created` is
  ideally server-confirmed, so a submitted form that fails downstream
  processing does not inflate the Leads count.
- `mql_qualified` and `sql_accepted` originate outside the website (marketing
  automation and CRM), and are pushed into the GTM server container or sent
  directly to GA4 via Measurement Protocol so the funnel stays in one
  timeline.
- `purchase` should be deduplicated by `transaction_id` if it can fire from
  both a client redirect and a server webhook.

See `datalayer-schema.md` for the exact JSON shape of these pushes and
`ga4-setup.md` for how they map to GA4 conversions.
