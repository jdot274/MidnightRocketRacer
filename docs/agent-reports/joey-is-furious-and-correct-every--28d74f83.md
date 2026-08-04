# Agent report: joey is furious and correct every

- **Agent id:** `28d74f83-0151-4968-9b49-89d89b59450b`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/28d74f83-0151-4968-9b49-89d89b59450b.jsonl`

## Task brief

<user_query>
Joey is furious and correct: every night agents ship incomplete Refract builds that drop shaders/features from other versions. He wants ALL shaders from ALL versions. He asked for planning mode — DO NOT implement yet. Produce a concrete plan for the ONE major architectural change.

Context:
- MOBILE path: C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\
- Versions: REFRACT_MASTER_v1–v17, REFRACT_APP_v*, CONFIGURATOR_v*, etc.
- Mistake pattern: picking one "pretty" file (v35) or half-merging (v17 liquid only for Liquid category) instead of unifying the full shader catalog.
- He asked: "literally what major change do we have to make"

Your job (PLAN ONLY):
1. Inventory every distinct face/shader engine across ALL Refract HTML versions (FRAG, FRAG2, SPECS, liquid raymarch, category shaders, older palette engines, CONFIGURATOR variants, etc.). Deduplicate by actual GLSL/source identity, not filename.
2. State the ONE major change in one sentence (e.g. "single shader registry that every route/version consumes" — refine based on evidence).
3. Plan the architecture: how MASTER_v18 (or whatever) becomes the union — registry of all shaders, UI to pick any of them, 2D+3D both use the same registry, no category-gated loss.
4. Migration steps, risks, what NOT to do (don't pick a winner version again).
5. Open preference forks only if truly blocking.

Write the plan to: C:\Users\joeyw\.cursor\plans\refract_all_shaders_union.plan.md (create/update). Also return the plan summary in your response: the one major change first, then inventory count, then steps.

Additive only. No feature implementation in this pass beyond the plan file.
</user_query>

## Final report

Plan delivered. Here's what Joey needs.

## The one major change
Move Refract out of opaque single-file HTML into a structured **Vite + React + React-Three-Fiber Git repo** where every shader is an individual, browsable, editable module in a **Shader Registry** — with a **Vercel preview URL per commit** so Joey sees and approves every change before it lands.

## Recommended platform (1 line)
**Vite + React + R3F repo, edited in Cursor, Git/GitHub + Vercel preview deploys** — with Spline optionally added later just for the 3D watch body.

**Why:** each shader becomes its own file plus a registry entry Joey can browse and toggle; Git gives reviewable diffs, per-commit previews let him approve before "live," and a `leva` panel exposes every uniform as a slider he drives himself. GLSL bodies port over byte-for-byte, so nothing is lost.

## Shader inventory count
**8 distinct fragment engine source bodies** (deduped by GLSL hash, not filename — most of the 50 files just re-embed one of these), expanding into a registry of:
- 62 named SPECS designs (v15–v17 FRAG2 engine)
- 80 legacy named catalog faces (v1–v9)
- 14 uMode procedural faces (v14–v17)
- 14 FRAG2 pattern algorithms
- 1 liquid raymarch OLED face (APP_v35 → v17)

The v17 `useLiquidFace(){ return state.category==='Liquid'; }` gate is the exact half-merge bug you called out — it gets deleted, not reproduced. The 30 `CONFIGURATOR_*_AG.html` files are watch UI/material shells, not shader sources.

## Top decision for Joey
**Just pick the platform.** Say **"yes, R3F repo"** and the next pass scaffolds the repo and ports the first engine. Web-shell choice (Framer/Webflow vs plain React) and the Spline watch-body layer are separate, later, non-blocking decisions.

Full plan (assessment, alternatives, architecture with diagram, migration steps, risks, and the "what NOT to do" hard rules) is in `refract_all_shaders_union.plan.md`. No code rebuilt this pass, and no existing HTML touched — additive only.
