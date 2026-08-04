# Midnight Rocket Racer — Sprint 1

**Dates:** Aug 3 – Aug 14, 2026 (2 weeks)
**Target:** Web-first Three.js vertical slice at `web/` (port 8140). UE 5.8 twin at project root is **parked** this sprint.
**Producer:** this doc is the single source of truth for sprint scope. Task state lives in `task-board.md`.

## Sprint Goal

> Ship a **playable, screenshot-verifiable** neon arcade rocket-racer slice running in the browser at 60fps, pushed to GitHub, with the art/shader/aesthetic research pipeline delivering source material that the slice can actually consume.

One sentence test: *Joey opens `localhost:8140`, races a lap through 4 gates with boost/drift/jump, and the screenshot looks like the art bible.*

## Milestone: "Playable Slice" — Acceptance Criteria

The slice is **accepted** only when all of the following are demonstrated live in-browser:

| # | Criterion | Verification |
|---|-----------|--------------|
| A1 | Countdown sequence (3-2-1-GO) gates player input | Screen recording / screenshot of countdown state |
| A2 | 4 gates in sequence, each registering pass-through exactly once | HUD gate counter increments 1→4 |
| A3 | Finish timer starts on GO, stops on final gate, displays final time | HUD shows frozen final time |
| A4 | Boost functional — measurable speed delta + visual/FOV response | Input test, HUD speed readout |
| A5 | Drift functional — lateral slip on turn-in, recovers on release | Input test, visible trail/skid |
| A6 | Jump functional — airtime, landing, no clipping through track | Input test |
| A7 | **60fps sustained** on Joey's machine at 1080p (no drops below 55) | Stats overlay / DevTools performance trace |
| A8 | Neon look verified via screenshot against art bible palette | Screenshot pasted in chat, compared to `design/art/art-bible.md` |
| A9 | Runs from clean clone: `npm install && npm run dev` | Fresh-clone smoke test |
| A10 | Pushed to GitHub under `jdot274` | Repo URL + green clone test |

## Definition of Done (per task)

A task is Done only when:
1. Code runs in the live dev server with **no console errors**.
2. Change is visually verified in the browser (screenshot for anything visual).
3. No hardcoded secrets, no absolute local paths in committed source.
4. Frame budget respected — feature does not cost >2ms/frame without producer sign-off.
5. Committed and pushed; task moved on `task-board.md` in the same turn.

## Workstreams & Tasks

Owner = the agent/subagent doing the work. Main thread = the primary coding agent.

### WS-1 — Game Core (main thread) — **CRITICAL PATH**

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| C1 | `arena.js` — track, gates, boost pads, environment | main | 1d | — | **Done** |
| C2 | `car.js` — rocket-car mesh, arcade physics (boost/drift/jump) | main | 1.5d | — | **Done** |
| C3 | `race.js` — countdown, 4-gate progression, lap/finish timer | main | 1d | C1, C2 | **In Progress** |
| C4 | `hud.js` — countdown, speed, gate counter, timer, boost meter | main | 1d | C3 | **In Progress** |
| C5 | `main.js` — bootstrap, render loop, post-processing, input wiring | main | 1d | C1–C4 | **In Progress** |
| C6 | `npm install` — lock deps (three ^0.170, vite ^6) | main | 0.25d | C5 | Backlog |
| C7 | Dev server up on **port 8140** (`--strictPort`) | main | 0.25d | C6 | Backlog |
| C8 | Live browser verification pass — A1–A8 checklist | main | 0.5d | C7 | Backlog |
| C9 | GitHub repo + initial push (`gh`, account `jdot274`, authenticated) | main | 0.25d | C8 | Backlog |

**Critical path:** C3 → C4 → C5 → C6 → C7 → C8 → C9. Everything else is enrichment; if a research workstream slips, the slice still ships.

### WS-2 — Shader Harvest (subagent)

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| S1 | Extract Refract legacy GLSL engines from `legacy_engines.v6.js` (~23 shaders) | shader subagent | 1d | — | **In Progress** |
| S2 | Catalog each shader: uniforms, cost, visual role | shader subagent | 0.5d | S1 | Backlog |
| S3 | Map shaders → racer surfaces (track, sky, gates, boost pads, car body, trails) | shader subagent | 0.5d | S2 | Backlog |
| S4 | Port **max 3** shaders into `web/src/shaders/` for the slice | shader subagent | 1d | S3, C5 | Backlog |

> **Scope fence:** only 3 shaders land in Sprint 1. The rest are cataloged for Sprint 2. See RISK-3.

### WS-3 — Local Design Source Harvest (subagent)

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| D1 | Inventory local Spline / Figma / Unicorn / Omnia / Penpot / Blender-python assets | design-harvest subagent | 1d | — | **In Progress** |
| D2 | Shortlist assets reusable for the racer (track kit, car silhouettes, HUD frames) | design-harvest subagent | 0.5d | D1 | Backlog |
| D3 | Hand shortlist to art-director for art bible reference plates | design-harvest subagent | 0.25d | D2 | Backlog |

### WS-4 — Web Technique Research (subagent)

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| R1 | Three.js racer best practices: reflections (probes vs SSR vs cubemap) | research subagent | 0.5d | — | **In Progress** |
| R2 | Bloom / post pipeline options at 60fps budget | research subagent | 0.5d | — | **In Progress** |
| R3 | Arcade racer physics patterns (drift model, boost curve, airtime) | research subagent | 0.5d | — | **In Progress** |
| R4 | Deliver a one-page recommendation the main thread can implement directly | research subagent | 0.25d | R1–R3 | Backlog |

> R4 must land **before C5 post-processing work** or main thread ships a default bloom and moves on.

### WS-5 — Aesthetic Brief (subagent)

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| A1 | Stylized-futuristic keyword board | aesthetic subagent | 0.5d | — | **In Progress** |
| A2 | Palette board (hex swatches, neon accents on deep black) | aesthetic subagent | 0.5d | A1 | Backlog |
| A3 | Reference plate assembly (Pinterest/Google boards) | aesthetic subagent | 0.5d | A2, V3 | Backlog |

> **Banned vocabulary — hard constraint:** `cyberpunk`, `synthwave`, `retro`. These words must not appear in briefs, prompts, search queries, or committed docs. Violations get the deliverable bounced.

### WS-6 — Art Bible (art-director subagent)

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| B1 | Author `design/art/art-bible.md` — silhouette, material, lighting, palette rules | art-director | 1d | A1, A2 | **In Progress** |
| B2 | Define the screenshot acceptance bar used by A8 | art-director | 0.25d | B1 | Backlog |

### WS-7 — Secure Sign-In / Secrets Vault

| ID | Task | Owner | Est | Depends on | Status |
|----|------|-------|-----|------------|--------|
| V1 | Local secrets vault GUI backed by Windows Credential Manager (`keyring`) | tools | 1d | — | **In Progress** |
| V2 | Agent-side read helper — fetch credential by name, never echo to chat | tools | 0.5d | V1 | Backlog |
| V3 | Authenticated Pinterest / Google board access for reference harvest | tools | 0.5d | V2 | Backlog |

> **Non-negotiable:** no secret ever appears in chat, logs, commits, or screenshots. Vault is local-only, never committed.

## Capacity

- 9 core tasks on the critical path ≈ 6.5d of main-thread work.
- 20% buffer (≈1.5d) reserved for unplanned work and bug fixes — **do not schedule into it.**
- Research workstreams run parallel and must not block C3–C9.

## Risks

| ID | Risk | Prob | Impact | Owner | Mitigation |
|----|------|------|--------|-------|------------|
| RISK-1 | Browser session auth for Pinterest/Google harvest fails or expires mid-run | High | Med | tools | Ship V1–V2 before any harvest run; if auth blocks, fall back to local design sources (WS-3) and public reference — **never** block the slice on it. Report the blocker, don't retry-loop. |
| RISK-2 | Port conflicts on 8140 (strictPort will hard-fail) | Med | Low | main | Check port before `npm run dev`; kill stale node processes. Fallback ladder 8140 → 8142 → 8144, documented in the push. |
| RISK-3 | Scope creep on shaders — 23 shaders is a month of work, not a sprint | High | High | producer | Hard cap of **3 shaders** in Sprint 1 (S4). Remaining 20 are cataloged only. Any addition requires producer sign-off and a swap-out. |
| RISK-4 | Research deliverables land after main thread already implemented | Med | Med | producer | R4 has a hard deadline at C5 start; late research becomes Sprint 2 refactor, not a Sprint 1 rework. |
| RISK-5 | 60fps target missed once bloom + reflections + shaders stack | Med | High | main | Measure at C8 with the stats overlay. Post effects are the first thing cut. Budget: ≤2ms/frame per feature. |
| RISK-6 | UE 5.8 twin pulls attention from the web slice | Low | High | producer | UE is explicitly **parked**. No UE tasks in Sprint 1. |

## Out of Scope (Sprint 1)

Multiplayer, AI opponents, multiple tracks, car customization, audio mix, menu system, save/progression, UE twin work, the other 20 shaders. All parked to `task-board.md` backlog.

## Cadence

- Daily: main thread posts critical-path status (which C-task is live).
- Mid-sprint (Aug 8): risk review, shader cap check, research delivery check.
- Sprint end (Aug 14): slice demo against A1–A10, retro, Sprint 2 plan.
