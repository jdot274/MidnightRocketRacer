# Agent report: read only harvest task on joey

- **Agent id:** `1d85af4a-504f-4c81-b9b2-d33c5b4eb26a`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/1d85af4a-504f-4c81-b9b2-d33c5b4eb26a.jsonl`

## Task brief

<user_query>
Read-only harvest task on Joey's Windows machine. Do NOT modify or move any files.

Goal: Inventory Joey's Spline and Figma design assets usable in "Midnight Rocket Racer", a moody black-sky neon Three.js arcade racer (electric blue, magenta, acid lime on black; wet reflective surfaces; premium adult collectible-car energy).

Search:
- C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\assets\scene.splinecode and any other *.splinecode, SPLINE_PKG_v1, SPLINE_VIEWER_v1.html under C:\Users\joeyw\Desktop\Refract
- Any folder named figma_sync anywhere under C:\Users\joeyw (e.g. figma_sync/organic_glow_blob/preview.png), plus C:\Users\joeyw\Downloads for Figma exports (svg/png named glow/organic/neon)
- C:\Users\joeyw\Desktop and C:\Users\joeyw\Developer for GLB/GLTF/HDR assets (chronograph.glb, studio.hdr mentioned in REFRACT_ANIMATED_SHOWCASE.html) and any car/vehicle 3D models (*.glb, *.gltf, *.fbx)
- C:\Users\joeyw\Converted_GLBs folder

Deliver in final response:
1. Paths + short description of each usable asset (3D models, HDRIs, splinecode scenes, design previews).
2. Which HDRI/environment file is best for black-studio reflections.
3. Whether any car/vehicle mesh exists we can load as the hero car; if none, say so plainly.
4. Color/design tokens observable from Figma/Spline previews that match the neon palette.
No file edits.
</user_query>

## Final report

Read-only harvest complete. Nothing was modified. Here is the full inventory.

## 1. Usable assets by category

### Spline / Refract package — `C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\`
- `assets\chronograph.glb` (7.4 MB) — hero watch mesh used by the Refract viewer; premium metallic PBR object, good "collectible product" prop but not a car. Duplicated in `SPLINE_PKG_v1\assets\` and in `deploy_v28` through `deploy_v40_promotion_gate` folders.
- `assets\studio.hdr` (1.4 MB) — verified valid Radiance HDR (`#?RADIANCE` header). Same file mirrored across all the `deploy_v*` folders.
- `SPLINE_VIEWER_v1.html` — working Three.js 0.170 viewer (black background, ACES tone mapping, HDR env, Titanium/Stealth/Gold material presets, Spline-embed iframe mode). Great reference for renderer setup.
- **Both `scene.splinecode` files are dead.** `assets\scene.splinecode` and `SPLINE_PKG_v1\assets\scene.splinecode` are each a 111-byte S3 `AccessDenied` XML error document, not real Spline scenes. There is no usable local splinecode.
- `assets\wrist.png`, `assets\prem_watch3d.v1.png` — reference/preview stills.

### Figma sync — `C:\Users\joeyw\Desktop\Refract_Motion_Studio_v4\figma_sync\organic_glow_blob\`
- `preview.png`, `manifest.json`, `main.ts` (WGSL shader), `features.json`, `product-brief.md` — a procedural "Organic glow blob" Figma shader fill. Note: its palette is **orange/amber** (glowColor `rgb(1, 0.416, 0)`, bg dark burnt-brown), not the neon blue/magenta/lime palette. Usable as a glow/noise technique reference, not as a color source.
- Downloads sweep: **no** svg/png files matching glow/organic/neon exist in `C:\Users\joeyw\Downloads`.

### Converted GLBs — `C:\Users\joeyw\Converted_GLBs\`
- `iridescent_dotted_wave.glb` (505 KB) and `flat_rounded_led_displacement_board_v1.glb` (749 KB) — neon LED-style meshes, on-palette, good as track-side/environment decor.
- `index.html` — viewer whose "neon" lighting preset is directly on-palette (cyan key `0x00f2fe`, violet rim `0x7f00ff`, near-black fog `0x0b0c10`).

### Other 3D on Desktop (secondary)
- `C:\Users\joeyw\Desktop\SplineAPK_BestScene\` — full export set (glb/gltf/usd/usdz/blend); preview shows it's just a pale lime sphere on grey. Low value.
- SPIN/LED family: `final-3d-solution-a\assets\` (SPIN_maximal.glb, GlassLED_Slab.glb, LEDVolume_Waves.glb, neural_wave.glb, etc.), `SPIN_Asset_Gallery\models\`, `SPIN_LED_Exports\` — glass/LED volume meshes, reusable for neon environment dressing.
- `C:\Users\joeyw\Developer` contains **no** glb/gltf/fbx/hdr/exr assets at all (checked recursively).

## 2. Best HDRI for black-studio reflections
`C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\assets\studio.hdr`. It is the only proper equirectangular HDR on the machine (BlurFocus's `proj_*_4k` files are UE projection textures, not environments), it's already proven in the Refract viewer as the environment for glossy black-studio product reflections, and it's small (1.4 MB). Recommended usage mirrors the viewer: black scene background + this HDR as `scene.environment` only, so you get bright specular streaks on wet/dark paint without lifting the sky.

## 3. Hero car mesh
There is **no ready-to-load GLB/GLTF car anywhere**. The only vehicle mesh on the machine is the Unreal sports car FBX set at `C:\Users\joeyw\Desktop\BlurFocus\Content\Vehicles\SportsCar\` — `SM_SportsCar.FBX` (2.3 MB body) plus `SM_SportsCar_Glass.FBX`, `SM_SportsCar_Wheel.FBX`, and a skeletal `SKM_SportsCar.FBX`. These are FBX (UE content, materials in `.uasset` so they won't transfer), so they would need a one-time FBX-to-GLB conversion (e.g. Blender) before Three.js can use them. If you want zero conversion, the honest answer is: no hero car exists — plan to convert the SportsCar FBX or build/source a new mesh.

## 4. Neon design tokens harvested from the previews/HTML
On-palette tokens actually present in Joey's files:
- Refract showcase (`deploy_v40_master\REFRACT_ANIMATED_SHOWCASE.html`): background `#000000` with black fog, ink `#f4f4f7`, dim `#7d7d8a`, accent magenta-violet `#c86bff`, accent electric blue `#6b8cff`, gold `#ffcc73`; lighting rig = white key 1.65, magenta rim `0xc86bff`, blue underlight `0x6b8cff`, ambient `0x0e1020`; stealth-black paint `0x0d0d10` metalness 0.9 / roughness 0.35 and dark glass `0x0a0a12` roughness 0.08 — exactly the "wet black collectible car" material recipe.
- Spline viewer: panel `rgba(12,12,16,.72)` glass panels, accents `#6b8cff`/`#c86bff`, blue rim light `0x88a0ff`.
- Converted_GLBs viewer: bg `#0b0c10`, electric cyan `#00f2fe`, sky blue `#4facfe`, violet rim `0x7f00ff`, cyan grid `0x00f2fe` on `0x1a1a24`.
- Off-palette: the Figma organic glow blob is orange (`glowColor` ≈ `#ff6a00`) — reuse its glow/distortion shader parameters (glowIntensity 2, distortion 0.8, morph 0.7, flow 1.5) but recolor. Acid lime appears nowhere in existing assets, so that token would be new.
