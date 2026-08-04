# Midnight Rocket Racer — Task Board

Kanban for Sprint 1 (Aug 3–14, 2026). Move cards the same turn work changes state.
Task IDs and full detail live in `sprint-plan.md`. **Critical path is marked ⚡.**

---

## Done

- ⚡ **C1** `arena.js` — track, gates, boost pads, environment
- ⚡ **C2** `car.js` — rocket-car mesh, arcade physics (boost/drift/jump)

---

## In Progress

**Game core (main thread)**
- ⚡ **C3** `race.js` — countdown, 4-gate progression, finish timer
- ⚡ **C4** `hud.js` — countdown, speed, gate counter, timer, boost meter
- ⚡ **C5** `main.js` — bootstrap, render loop, post-processing, input wiring

**Research & content (subagents, parallel — must not block critical path)**
- **S1** Extract Refract legacy GLSL from `legacy_engines.v6.js` (~23 shaders)
- **D1** Inventory local Spline / Figma / Unicorn / Omnia / Penpot / Blender-python assets
- **R1–R3** Three.js racer research: reflections, bloom pipeline, arcade physics
- **A1** Stylized-futuristic keyword board *(banned: cyberpunk, synthwave, retro)*
- **B1** `design/art/art-bible.md` (art-director)
- **V1** Secrets vault GUI — Windows Credential Manager via `keyring`

---

## Backlog — Sprint 1

**Ship the slice (in order)**
- ⚡ **C6** `npm install` — lock three ^0.170 / vite ^6
- ⚡ **C7** Dev server up on port 8140 (`--strictPort`)
- ⚡ **C8** Live browser verification — countdown, 4 gates, finish timer, boost/drift/jump, 60fps, neon screenshot
- ⚡ **C9** GitHub repo + push (`gh`, account `jdot274`)

**Supporting**
- **S2** Catalog shaders: uniforms, cost, visual role
- **S3** Map shaders → racer surfaces (track, sky, gates, pads, car body, trails)
- **S4** Port **max 3** shaders into `web/src/shaders/` — hard cap
- **D2** Shortlist reusable local assets
- **D3** Hand shortlist to art-director
- **R4** One-page implementable recommendation (due before C5 post-processing)
- **A2** Palette board — neon accents on deep black
- **A3** Reference plate assembly (needs V3)
- **B2** Screenshot acceptance bar for the neon-look check
- **V2** Agent read-helper — credential by name, never echoed to chat
- **V3** Authenticated Pinterest / Google board access

---

## Next Milestones (post-Sprint 1)

| Milestone | Summary | Gate to start |
|-----------|---------|---------------|
| **M1 — Playable slice** | C1–C9 complete, acceptance A1–A10 signed off | *in flight* |
| **M2 — Packaged deploy (Vercel)** | `vite build` clean, deployed URL, 60fps on deployed build, shareable link | M1 accepted |
| **M3 — Hero-car v2 model** | Replace placeholder car with art-bible-compliant hero mesh + materials; LODs; silhouette reads at speed | M1 accepted + art bible final |
| **M4 — Attract mode** | Camera-on-rails demo loop, idle timeout, title treatment, seamless loop back to race | M2 shipped |
| **M5 — UE 5.8 twin revisit** | Unpark the UE project, port arena + car feel, decide web-vs-UE as the flagship path | M2 + M3 shipped |

---

## Parked / Out of Scope

Multiplayer · AI opponents · additional tracks · car customization · full audio mix · menu system · save & progression · the other ~20 harvested shaders · all UE work until M5.

---

## Board Rules

1. One owner per card. No card sits In Progress more than 3 days without a status note.
2. A card moves to Done only when it meets the Definition of Done in `sprint-plan.md`.
3. Anything not on this board is not in the sprint — new work goes to Backlog and swaps out an equal-size card.
4. Never write `cyberpunk`, `synthwave`, or `retro` on this board or in any deliverable.
