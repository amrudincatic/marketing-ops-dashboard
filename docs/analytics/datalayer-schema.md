# dataLayer Schema

This defines the GTM `dataLayer` object shape used across the site. Every
push follows the same envelope: an `event` name, a `user` object, and an
`attribution` object, plus event-specific properties.

## Shape

```
{
  event: string,            // matches an event name from tracking-plan.md
  user: {
    user_id: string | null, // set once known, otherwise null for anonymous
    email_hash: string | null, // SHA-256 hashed, never raw PII
    is_returning: boolean,
  },
  attribution: {
    channel: string,        // one of: Google Ads, Meta, LinkedIn, Organic Search, Email
    utm_source: string,
    utm_medium: string,
    utm_campaign: string,
    utm_term: string | null,
    utm_content: string | null,
  },
  // ...event-specific properties (see tracking-plan.md)
}
```

`user` and `attribution` are pushed on every event so any GTM trigger can
read them without an extra lookup. `attribution` is captured once per session
(first-touch) and persisted in a first-party cookie or `sessionStorage` key so
it survives across page views to `purchase`.

## Example: `form_submit`

```json
{
  "event": "form_submit",
  "user": {
    "user_id": null,
    "email_hash": "b1946ac92492d2347c6235b4d2611184",
    "is_returning": false
  },
  "attribution": {
    "channel": "Meta",
    "utm_source": "facebook",
    "utm_medium": "paid_social",
    "utm_campaign": "q3_demo_request",
    "utm_term": null,
    "utm_content": "carousel_ad_2"
  },
  "form_id": "demo-request-form",
  "form_name": "Demo Request",
  "fields_completed": 5
}
```

## Example: `purchase`

```json
{
  "event": "purchase",
  "user": {
    "user_id": "usr_88213",
    "email_hash": "9e107d9d372bb6826bd81d3542a419d6",
    "is_returning": true
  },
  "attribution": {
    "channel": "Google Ads",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "brand_search_us",
    "utm_term": "marketing ops dashboard",
    "utm_content": null
  },
  "transaction_id": "txn_20260718_4471",
  "value": 149.0,
  "currency": "USD",
  "plan": "growth_monthly"
}
```

## GTM variable and trigger mapping

| dataLayer path | GTM variable | Used by |
| --- | --- | --- |
| `event` | Built-in `Event` | All triggers (Custom Event trigger matching event name) |
| `attribution.channel` | DLV `dlv.attribution.channel` | GA4 event parameter `channel`, channel-mix reporting |
| `attribution.utm_source`, `utm_medium`, `utm_campaign` | DLV variables per field | GA4 event parameters, forwarded to GA4 Data Import / channel grouping |
| `user.user_id` | DLV `dlv.user.user_id` | GA4 User-ID feature, cross-device stitching |
| `form_id`, `form_name` | DLV variables | Trigger condition on `form_submit` (fires GA4 tag with these as event params) |
| `transaction_id`, `value`, `currency` | DLV variables | GA4 Purchase tag (Ecommerce), mapped to GA4's standard `purchase` event schema |
| `lead_id` | DLV `dlv.lead_id` | Joins `lead_created`, `mql_qualified`, `sql_accepted` in server-side container for funnel stitching |

Triggers: each event name gets one Custom Event trigger in GTM (for example
"CE - form_submit"), firing a corresponding GA4 Event tag that reads the
`dataLayer` variables above into GA4 event parameters. `purchase` uses GA4's
built-in Ecommerce tag type instead of a generic event tag so `value` and
`currency` populate GA4's revenue reporting correctly.
