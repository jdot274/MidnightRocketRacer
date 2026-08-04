# MIDNIGHT // ROCKET RACER

Moody, stylized-futuristic arcade rocket racer — black-sky reflective world, neon light-rings, iridescent chrome, thin parametric line-geometry. Everything in the experience is 3D (diegetic frosted-glass panels in space, no flat DOM UI), in the spirit of Spline Hana.

Two additive slices live in this repo:

| Slice | Path | Status |
|---|---|---|
| **Web-native vertical slice** (Vite + Three.js) | `web/` | Playable — primary iteration target |
| **Unreal Engine 5.8 C++ slice** | `Source/`, `Config/`, `Content/` | Parked artifact — compiles, kept additive |

## Run the web slice

```bash
cd web
npm install
npm run dev   # http://localhost:8140
```

Controls: `W/S` throttle · `A/D` steer · `Shift` boost · `Space` drift/jump · `R` reset.

## Art direction (canon)

Sourced from Joey's Pinterest "Board" (4,263 pins), the Refract shader lineage, and the `iridescent_dotted_wave` Blender series:

- **Absolute black stage** — no grey studios, no skyboxes.
- **Glossy black-chrome + rainbow spectral rim** on hero surfaces.
- **Thin parametric line-geometry** — wireframe line-spheres, single-line tori, concentric dot-discs.
- **Neon light-rings** — blue / purple / cyan glowing torus loops; magenta and acid-lime accents.
- **One-off WOW assets** — every shader is its own unique piece, not a reusable library part.
- **Banned:** cyberpunk city clutter, retro/synthwave grain, flat traditional UI.

Bespoke GLSL lives in `web/src/shaders/` (`trackEnergy.js`, `boostPad.js`).

## Agent team

This project was built by a coordinated agent team (art director, producer, shader master, gameplay programmer, researchers). Polished reports live in `docs/agent-reports/`, raw transcripts in `docs/agent-transcripts/`.
