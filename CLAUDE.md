# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

A marketing ops dashboard and analytics setup, built as a proof-of-work
portfolio piece for Amrudin Catic (marketing engineer, amrudincatic.com).
It shows full-funnel marketing operations (spend, leads, CPL, ROAS, channel
mix, funnel stages, organic/SEO) alongside a documented analytics tracking
plan. The goal is to let a prospective client or employer see the quality of
work delivered in this space. Keep it focused and small.

## Hard rules

1. No em-dashes and no en-dashes anywhere. Not in code, comments, docs, commit
   messages, or chat. Use hyphens, commas, colons, or parentheses instead. This
   is non-negotiable.
2. Log every meaningful step in progress.md as work happens. Newest entries at
   the bottom.
3. Keep it small. This is a focused proof-of-work piece, not a product. Apply
   YAGNI ruthlessly.

## Confirmed decisions

- Focus: full-funnel marketing ops overview
- Scope: dashboard UI plus an analytics tracking plan (documentation)
- Stack: React + Vite + Recharts
- Aesthetic: 80s synthwave (neon magenta and cyan on deep purple, grid horizon,
  glow), delivered through the frontend-design skill
- Shape: single-page command center (Approach A) with interactive filters that
  recompute the numbers client-side
- Data: a realistic mock dataset served through a small data-layer module so it
  reads like it is fetching from an API
- Deploy: GitHub Pages via GitHub Actions (live link, not just a repo)

## Stack conventions

To be filled in during implementation.

## Structure

To be filled in during implementation.
