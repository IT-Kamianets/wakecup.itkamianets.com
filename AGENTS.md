# Agent Guide

This repository contains an Angular 21 HoReCa template workspace with two targets:

- `app`: the local static, prerender-first marketing website used for development and verification
- `ngx-horeca`: the publishable library under `projects/ngx-horeca`, intended to be released as `@wawjs/ngx-horeca`

When working inside this repository, the app can use the local library project. When this template is applied to a real business project, do not assume `projects/ngx-horeca` exists; reusable HoReCa code must be consumed from the npm package `@wawjs/ngx-horeca`.

## Quick Reference

- Stack: Angular 21, TypeScript 5, Angular SSR/prerender, Tailwind CSS, SCSS
- Package manager: `npm`
- Main goal: fast, clean, SEO-friendly HoReCa landing pages
- Primary output: prerendered static site from `dist/app/browser`
- Local app source: `src/`
- Local library source: `projects/ngx-horeca/src/`
- Reusable feature contracts/services: `projects/ngx-horeca/src/feature/`
- App-owned data bridge and company profile: `src/app/feature/bootstrap/` and
  `src/app/feature/company/`
- AI guidance source: `projects/ngx-horeca/ai/`

## Universal Rules

- Treat this repo as a marketing website first, not as a complex application shell.
- Prefer simple, static, content-first pages over heavy abstractions.
- Preserve prerender compatibility by default.
- Keep changes small, clear, and easy to review.
- Prefer Tailwind for layout, spacing, typography, sizing, responsive behavior, and utility styling.
- Use local page content/config over new services unless reuse is real and repeated.
- Do not introduce CMS, API fetching, dashboards, or heavy state management unless explicitly requested.

## Default Technical Stance

Use these as defaults unless the local code or the task gives a concrete reason to do otherwise:

- Angular 21 modern patterns only.
- Standalone components are the default. Do not add NgModules for new work.
- Use `changeDetection: ChangeDetectionStrategy.OnPush` on new or touched components.
- Use signals for local UI state and derived state.
- Prefer native control flow (`@if`, `@for`, `@switch`) in templates.
- Use Angular bindings instead of manual DOM work.
- Use `NgOptimizedImage` for static images when feasible.
- Keep browser-only code guarded so prerender remains safe.

## Asset Paths

- Do not assume Angular assets are served from `/assets`.
- Treat `src/assets` as a source folder, not a runtime URL.
- Check `angular.json` before answering questions or editing templates that reference static files.
- In this repo, files from `src/assets` are published from the site root, so `src/assets/logo.webp` is referenced as `/logo.webp` or `logo.webp`, not `assets/logo.webp`.

## Decision Memory

Durable repo-wide rules belong in `projects/ngx-horeca/ai/decisions/`, not duplicated ad hoc across docs or task notes.

Read `projects/ngx-horeca/ai/decisions/index.md` when:

- a task changes a long-lived repo convention
- a task resolves an ambiguity likely to come up again
- you are unsure whether a rule is temporary guidance or a durable policy

## Read Only What You Need

Start here, then open only the one or two relevant files in `projects/ngx-horeca/ai/`:

- `projects/ngx-horeca/ai/onboarding.md`
- `projects/ngx-horeca/ai/architecture.md`
- `projects/ngx-horeca/ai/code-style.md`
- `projects/ngx-horeca/ai/content-pages.md`
- `projects/ngx-horeca/ai/seo.md`
- `projects/ngx-horeca/ai/media.md`
- `projects/ngx-horeca/ai/tooling.md`
- `projects/ngx-horeca/ai/task-execution.md`

Suggested loading order:

1. `AGENTS.md`
2. one or two relevant `projects/ngx-horeca/ai` guides
3. `projects/ngx-horeca/ai/decisions/index.md` only if the task may affect durable policy
