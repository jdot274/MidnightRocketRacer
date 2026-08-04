# Agent report — read only exploration only inventory joey s web

**Subagent transcript:** `docs/agent-transcripts/subagent-25570fd3-4544-40f4-adef-43240f1243ce.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 9:42 PM (UTC-4)</timestamp>
<user_query>
Read-only exploration only. Inventory Joey's web-native and design-source stack for a proposed third massive project. Find evidence of Three.js/R3F/WebGL, Spline, Unicorn Studio, Omnia/other named web creators, Vercel, Figma, and related existing project/source folders. Search Desktop, Developer, Projects, and Cursor/Claude memories/transcripts selectively. Do not edit. Return source map: capability, concrete path/URL/evidence, what should be harvested vs merely used as an authoring surface. Highlight candidate content from wavy spheres/golf/LEDVolume and other visual work.
</user_query>

## Final answer

Read-only exploration complete. Here is the source map for the proposed third massive project.

## Web-native + design-source stack — source map

Legend: **[HARVEST]** = mine the actual assets/code into the new project. **[SURFACE]** = keep as an authoring/deploy tool you use, not something to copy.

---

### 1. Three.js / R3F / WebGL

| Capability | Concrete path / evidence | Verdict |
|---|---|---|
| **Flagship web-3D engine (CORE)** | `C:\Users\joeyw\Projects\CORE` — pnpm monorepo. `apps/web` = "Vite + React 19 + R3F 9 + drei 10 + three 0.170 + WebGPU SPA"; `apps/spatial-platform` = R3F/three compositing; `web3d-to-engine/packages/r3f-loader` = splat consumer; custom **Rust/wgpu runtime + Tauri v2** shell. Design intent captured in `Developer\joeyw-agent-rules\wiki\better-solutions\2026-08-03-core-as-limitless-shader-host.md`. | **[HARVEST]** — this is the strongest reusable engine/architecture. Treat CORE as the base the third project extends. |
| **Golf hole-portal engine** | `Developer\vanguard-golf-hole-portal-v1` and `-v2` — R3F 9 + drei + `@react-three/postprocessing` + three 0.175. Feature modules in `src/engine/`: `graphicsUber.ts`, `holePortalHud.ts`, `stageArtillery.ts` (mirrored into `Developer\cursor-personal-skills\skills\engine-fork\runtime\`). | **[HARVEST]** — reusable HUD + shader-uniform deck (MORPH/FLOW/HEAT/GLASS) and postprocessing setup. |
| **Unicorn-style WebGL shader** | `neon-stage-artillery\src\game\webgl\shaderFlowField.ts` (memory notes it as "Unicorn.studio-style" iq domain-warped lime/gold contour) + `shaderBackdrop.ts`. Phaser 4 host. | **[HARVEST]** — the shader itself. |
| **Web shader engine (edge)** | `orbit-visual-canvas` → "orbit-visual-shader-engine" (Next 16 + vinext + Cloudflare vite plugin + drizzle). | **[HARVEST]** shader code; **[SURFACE]** for the Cloudflare/edge delivery pattern. |
| **Sphere / glass WebGL experiments** | `Desktop\GlassCube`, `GlassSphereProject\glass_sphere_viewer.html`, `FresnelSphereApp`, `Desktop\usd-bsdf-sphere.html`, `Desktop\spherical-resonance.html`. | **[HARVEST]** — wavy/glass sphere material studies (see §7). |
| **Scaffold** | `Developer\enterprise-3d-portal` (Vite + React 19, thin), `Desktop\Scene3D`, `final-3d-solution-a`. | **[SURFACE]** — starting points only. |

---

### 2. Spline

| Capability | Concrete path / evidence | Verdict |
|---|---|---|
| **Captured Spline source** | `Desktop\SplineCapture_Full\` (`spline_capture_material_frag.glsl`, `_vert.glsl`, `_uniforms.json`, `.usda`, `_mesh.obj`), `Desktop\SplineAPK_BestScene\*.gltf`, `Desktop\SplineToUE\spline_extract.py` + `spline_widget.html`, `Desktop\spline_decode.py`, `SplineToUnrealPipeline`, `SplineAPKToUE_Audit`. Plus `Refract\...\MOBILE\assets\scene.splinecode`. | **[HARVEST]** — real extracted shaders/geometry + the capture→engine pipeline scripts. |
| **Joey's own Spline products** | `Desktop\spline-style-editor` (monorepo: web editor + runtime + Tauri desktop); `Desktop\NodeForgeStudio` = "**pristine**" monorepo with `@pristine/spline-bridge`; memory `blurfocus_splinestudio.md` + `spin_project.md` (BlurFocus/SPIN Spline Studio = his "Photoshop-layers-for-3D" IP, UE `SPINSplineStudio`). | **[HARVEST]** the runtime/bridge + product concept; **[SURFACE]** spline.design itself as authoring tool. |
| **Inspiration** | `vanguard-golf-hole-portal-v2\inspiration\_canvas_thumbs\01-spline-my-files.b64`. | **[SURFACE]** reference. |

---

### 3. Unicorn Studio

- **No installed SDK/package anywhere.** It exists only as a reproduced aesthetic:
  - `neon-stage-artillery\src\game\webgl\shaderFlowField.ts` (explicitly "Unicorn.studio-style").
  - Blender: `Desktop\LEDVolume_Waves_scene_v03_UNICORN_GOLF_SDF.blend`, `v04_UNICORN_EXACT_PIPELINE_GOLF.blend`, `v05_SPLINE_UNICORN_GOLF_HOLE.blend`.
  - Memory `blender_fx_asset_library.md`: "Unicorn/Spline-style draggable node-group FX."
- **Verdict:** **[SURFACE]** — unicorn.studio is a web authoring tool to use for look-dev; **[HARVEST]** the shaders/blends you already recreated from it.

### 4. Omnia / other named creators

- **No meaningful footprint.** Exhaustive content search across `.claude`, Desktop, Developer, Projects returned only one false-positive base64 hit. **[SURFACE]** — treat as an external tool to evaluate; nothing local to harvest.

---

### 5. Vercel (deploy surface)

- Org: `team_L3UZHZu5OrFbgrjvcmjZDZI6`. Linked projects:
  - `Desktop\axiom-landing\.vercel` → `prj_ACQLnN1y2AYb9Qojj7qdu4NVvUdi`
  - `Desktop\final-3d-deploy\.vercel` → `prj_HDjRZFvNGrH7aOOpraIqi3UsR0cc`
  - `Desktop\spin-site\.vercel`
  - **Refract** deploy chain: `deploy`, `deploy_master_v17`, `deploy_v24/28/29/30/31/32/33/34/35`, `deploy_v35_master`…`deploy_v40_master`, `deploy_v40_promotion_gate`, `field-studio-v1`, `ANTIGRAVITY\MOBILE`.
- **Verdict:** **[SURFACE]** — this is your web deploy target. Reuse the existing org/project linkage rather than harvesting.

---

### 6. Figma (design source)

| Evidence | Verdict |
|---|---|
| `Desktop\Refract_Motion_Studio_v4\figma_sync\organic_glow_blob\` — real Figma file `PXvQ53bYTaU5vHhKl2EjmU` ("Refract Organic Glow Sync", node `1:4`), synced via figma-mcp `get_shader_fill`; `main.ts` (WGSL) + `product-brief.md` + `features.json`, local canonical `organic_glow_blob.frag.glsl`. This is the default preview referenced in your Figma user-rule. | **[HARVEST]** the shader fill + contract. |
| `Desktop\Refract\figma_wgsl_to_hlsl_v1\` (`FigmaWgslCompat.ush`, `tools\extract-figma-fill.js`), `Refract\shader_promote_v1\harvest\figma_wgsl`. | **[HARVEST]** — WGSL→HLSL bridge pipeline. |
| `Refract\playstore_v2\figma_*.png` (UI mockups). | **[SURFACE]** — design references. |

---

### 7. Highlighted candidate content (wavy spheres / golf / LEDVolume)

- **LEDVolume wave progression (prime harvest)** — `Desktop\LEDVolume_Waves.usdc` + a full v01→v10 blend evolution: `v01_BASELINE` → `v02_IMPROVE` → `v03_UNICORN_GOLF_SDF` → `v04_UNICORN_EXACT_PIPELINE_GOLF` → `v05_SPLINE_UNICORN_GOLF_HOLE` → `v06_SMOOTH_SDF_GAME_SCALE_GOLF` → `v07_BEAUTIFUL_SDF_EMBOSS_GOLF` → `v08_ABSTRACT_SDF_GOLF_WAVES` → `v09_DENSE_CONTOUR_SDF_GOLF` → `v10_GAME_CAMERA_LIME_MINIMAL`. Plus `build_led_video.py`, `spin_led_video_v3.blend`. **[HARVEST]** — this is the neon-lime topo/wave hero the aesthetic profile keeps pointing to (`wiki\aesthetic\joeyw-perfect-aesthetic.md`).
- **Wavy spheres** — `Desktop\spin_blue_mesh.blend` / `_v2.blend` (+ `spin_blue_mesh_FINAL.png`) = Spline-aesthetic glow/wave sphere; `FresnelSphere*`, `GlassSphere*`, `usd-bsdf-sphere.html`, `spherical-resonance.html`. **[HARVEST]** as material/mesh studies.
- **Golf** — `Developer\vanguard-golf-hole-portal-v1/v2` (web engine), the `*GOLF*` LEDVolume blends, inspiration board `Desktop\VANGUARD_inspiration_all9.png` and `vanguard-golf-hole-portal-v2\inspiration\_canvas_thumbs\` (01-spline, 02-codepen-neon-glass, 03-skal-ventures-golf-hud, 04-blender-lime-led-volume, 05-concentric-topo-green, 06-unreal-neon-wave-plane). **[HARVEST]** engine + labeled inspiration grid.

---

### Suggested spine for the third project
Base it on **CORE** (R3F + WebGPU + wgpu shader host) as the runtime, pull in the **vanguard golf engine modules** + **LEDVolume wave blends** as the hero visual language, wire **Spline capture / spline-bridge** and **Figma figma_sync (organic_glow_blob + WGSL→HLSL)** as the two design-source ingestion paths, recreate the **Unicorn-style flow-field shader** natively, and ship on **Vercel** (existing org). Unicorn Studio and Omnia stay as external authoring surfaces, not dependencies.

One caveat: `C:\Users\joeyw` is a git repo whose ignore rules hide most of `Developer`/`Desktop` from ripgrep, so content greps under-report — I confirmed the key hits via direct filesystem listing and reads instead.
