# Agent report — read only inventory on joey s windows machine

**Subagent transcript:** `docs/agent-transcripts/subagent-114c53da-91c5-46b1-a839-0cd137ce86a6.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 10:03 PM (UTC-4)</timestamp>
<user_query>
Read-only inventory on Joey's Windows machine (thoroughness: medium). Do NOT modify files.

Goal: find design/inspiration source material for "Midnight Rocket Racer" — a moody black-sky neon arcade racer (electric blue, magenta, acid lime on black; wet reflective surfaces; iridescent dotted LED waves).

Search these locations for reusable assets, exports, and code:
1. Spline: C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\assets\scene.splinecode and any other *.splinecode, SPLINE_* files or spline export folders anywhere under Desktop/Refract, Developer, Projects.
2. Figma: any figma_sync folders (e.g. figma_sync/organic_glow_blob/preview.png), Figma exports, or Figma-related scripts under C:\Users\joeyw (Desktop, Developer, Projects).
3. Unicorn Studio / Omnia / Penpot: any folders, exports, JSON, or HTML referencing unicorn.studio, omnia, penpot.
4. Python generative assets: Blender python scripts in C:\Users\joeyw like iridescent_dotted_wave_setup.py, create_pinterest_globe*.py, prepare_interactive_3d_assets.py — summarize what visual looks each encodes (colors, dot grids, wave patterns, materials).
5. GL shader studio: C:\Users\joeyw\.codex\skills\gl-shader-studio-master — what shader tooling/snippets exist there.

Return: a structured list of concrete file paths grouped by source (Spline / Figma / Unicorn-Omnia-Penpot / Python / shader tooling), each with a one-line description of what it contains and how it could feed the racer's look (track material, skybox, boost FX, HUD styling, hero car paint). Flag the top 5 highest-value items.
</user_query>

## Final answer

Read-only inventory done — nothing modified. Here is the concrete source material for **Midnight Rocket Racer**, grouped by source.

---

## TOP 5 HIGHEST-VALUE ITEMS

1. **`C:\Users\joeyw\Desktop\Refract\shader_export_ue_v1\out_v2\`** — ~40 ready-to-import **Unreal Engine `custom_node.hlsl` materials** (neon_torus, plasma_core, aurora_veil, galaxy_spiral, liquid_chrome, chronos_rings, caustics, voronoi_cells, fireflies, holographic_foil, solar_corona, nebula_drift...). These are the single biggest asset: drop-in track/wall/car-paint/boost shaders that already match the electric-blue/magenta/acid-lime-on-black brief.
2. **`C:\Users\joeyw\Desktop\Refract\shader_export_ue_v1\ue_apply_arena_v2.py`** — a working script that builds a UE map and assigns those shaders to scene roles (court/grid/wall/ball/rim/plasma). This is a near-exact template for wiring the racer's track, barriers, and hero car to the neon material library.
3. **`C:\Users\joeyw\iridescent_dotted_wave_setup.py`** (+ ~20 rendered `.blend` variants and 2 preview PNGs) — the canonical **iridescent dotted LED wave** generator: emissive dot grid, blue/violet ribbon sweep on near-black, EEVEE bloom. This is your skybox / track-side LED wall / boost-trail look, already art-directed.
4. **`C:\Users\joeyw\Desktop\Refract\shader_pipeline_v1\organic_glow_blob.frag.glsl`** — a single-source-of-truth morphing SDF + warping-grid glow shader with a portable `uTime/uMorph/uFlow/uHeat` uniform contract used across app, Figma, and React. Ideal for boost FX / energy-core HUD elements.
5. **`C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\SPLINE_PKG_v1\refract_materials_v1.json`** — the master PBR + shader-mode catalog (14 categories → shader modes 0–13, metal/stealth/gold PBR presets, black-background presentation config). Best single reference for consistent car-paint + material naming.

---

## 1. Spline
- `C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\assets\scene.splinecode` — **⚠ 111 bytes, an S3 "AccessDenied" XML stub, NOT a real scene.** Unusable as-is.
- `C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\SPLINE_PKG_v1\assets\scene.splinecode` — **⚠ same 111-byte stub.** A real scene must be re-published from app.spline.design.
- `C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\SPLINE_VIEWER_v1.html` (+ `SPLINE_PKG_v1\SPLINE_VIEWER_v1.html`) — Spline web viewer scaffold; reusable loader shell once a valid `.splinecode` exists.
- `...\ANTIGRAVITY\MOBILE\spline_file_meta.network-response` / `spline_file_open_response.network-response` — cached Spline Community metadata (a "smart watch" scene: realistic belt, metal/material tags). Reference only.
- `...\ANTIGRAVITY\MOBILE\spline_step.py`, `spline_full.py`; `C:\Users\joeyw\create_spline_doc.py` — Spline automation/CDP scripts. Feeds: pipeline plumbing, not visuals.

## 2. Figma
- `C:\Users\joeyw\Desktop\Refract_Motion_Studio_v4\figma_sync\organic_glow_blob\` — the figma_sync folder (`manifest.json`, `product-brief.md`, `main.ts`, `features.json`). `product-brief.md` fully specs the glow-blob look: metaball SDF, fbm-warped grid, emissive boundary glow, exposed Glow/Morph/Flow/Grid-warp controls. (Note: `preview.png` referenced in your rules is **not present** in this copy.) Feeds: boost-core FX + HUD glow styling with a documented control contract.
- `C:\Users\joeyw\Desktop\Refract\shader_pipeline_v1\figma_agent_prompt.txt` — instructions for pasting the glow-blob GLSL into a Figma shader fill. Feeds: promo/HUD art in Figma.
- `C:\Users\joeyw\Desktop\Refract\shader_pipeline_v1\react\RefractShaderStack.tsx` — React `<GlslLayer>` stack driving the same shaders (also mentions Penpot-style embedding). Feeds: web HUD/menu overlay.

## 3. Unicorn Studio / Omnia / Penpot
- **No dedicated assets, exports, JSON, or HTML found.** The only hit is a passing mention of **Penpot/Spline embeds** in `C:\Users\joeyw\.codex\skills\gl-shader-studio-master\SKILL.md` (and its `references/plugin-operations.md`). No unicorn.studio or Omnia material exists on disk.

## 4. Python generative assets (all in `C:\Users\joeyw`)
- `iridescent_dotted_wave_setup.py` — **electric-blue/violet emissive dot-grid wave** on deep-blue-black backing; 126×182 dot lattice, `wave_depth()` sine field, per-dot vertex-color energy ramp (r/g/b weighted to blue), EEVEE bloom + Filmic High Contrast, portrait camera. → **skybox / trackside LED wall / dotted boost trail.**
- Rendered outputs of the above: `iridescent_dotted_wave_preview.png0001.png`, `..._v2.png0001.png`, and ~20 `.blend` variants incl. `_unique_01_blue_macro_fold`, `_02_violet_cross_sweep`, `_04_cyan_lower_flare`, `_05_wave_tunnel`, `_06_magenta_blue_shimmer` — directly usable mood/skybox plates and the **`_05_wave_tunnel`** is a strong track-tunnel reference.
- `led_motion_board_iteration_01_iridescent_radar_scan.blend` — LED radar-scan motion board. → **HUD radar / minimap styling.**
- `create_pinterest_globe_v1_5_intermediate.py` — **black glossy globe covered in round emissive LED dots** (silver-blue land dots, dim graphite ocean, blue rim-glow silhouette), pure-black world, named move/spin controls, Unreal/Eagle export intent. → **hero car dotted-LED paint, or a background planet/skybox object.**
- `prepare_interactive_3d_assets.py` — batch Blender→**GLB exporter** (Draco, NLA animation clips, tangents, vertex colors) tuned for UE5 + three.js. → **pipeline to package the car/track meshes for the engine.**
- `start_blendermcp_for_iridescent.py` — launches Blender MCP for the iridescent scene (tooling).

## 5. GL shader tooling — `C:\Users\joeyw\.codex\skills\gl-shader-studio-master\`
- `SKILL.md` — full workflow for authoring/versioning/exporting GLSL (Figma plugin, Figma Make, standalone WebGL; Penpot/Spline/CodePen embeds).
- `assets\starter-shader\main.frag` + `uniforms.json` — a **looping soft-wave shader** (`uSpeed/uScale/uWaveStrength/uColorA/uColorB`) — clean starting point for animated neon backgrounds/HUD.
- `references\glsl-authoring.md`, `studio-architecture.md`, `plugin-operations.md`, `figma-make-workflow.md` — authoring/porting guidance.
- `scripts\scaffold_shader_project.mjs`, `validate_shader_project.mjs` — non-destructive project scaffold/validate helpers.

---

### Two flags before you build
- Both `scene.splinecode` files are **dead 111-byte stubs** — plan to re-publish a real Spline scene (or skip Spline and go straight to the UE HLSL library, which is far more complete).
- **No Unicorn Studio / Omnia / Penpot** assets exist locally; don't spend time hunting for them. Your real depth is the **Refract UE shader library + the iridescent-dotted-wave Blender assets**, which already encode the exact moody-neon-on-black look you described.
