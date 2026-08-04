# Agent report — research task web only no local file edits

**Subagent transcript:** `docs/agent-transcripts/subagent-db1b0f91-4e0d-442b-8395-ede11152811e.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 10:03 PM (UTC-4)</timestamp>
<user_query>
Research task (web only, no local file edits). Today is August 2026.

Goal: gather the best current techniques and reference implementations for a Three.js browser arcade racer with AAA neon visuals — "Midnight Rocket Racer": black sky, wet reflective track, neon emissive rails, boost/drift arcade handling like Rocket League/Hot Wheels for adults.

Research these angles using web search:
1. CodePen/Shadertoy: standout neon/synthwave racing shaders and infinite-track demos (2024-2026). Collect names, URLs, and the core technique (e.g. grid shader, fresnel rim, planar reflections).
2. Three.js best practice 2026: current recommended approach for (a) planar reflections on a floor (Reflector vs screen-space vs env probes), (b) bloom/post-processing stack (UnrealBloomPass vs pmndrs postprocessing), (c) instanced neon rail rendering, (d) arcade vehicle physics in browser (custom raycast forces vs Rapier vs cannon-es) — which is most robust for drift/boost/jump feel.
3. Notable open-source browser racing games on GitHub (e.g. HexGL successors, slow-roads style) worth borrowing architecture from.

Return a concise structured brief: per angle, the top 2-3 findings with URLs and a one-line "use this because" recommendation. End with a single recommended technique stack for our racer.
</user_query>

## Final answer

Research done. Here is the structured brief.

# Midnight Rocket Racer — Technique Research Brief (Aug 2026)

## Angle 1 — Neon/synthwave shader & infinite-track demos

1. **HyperDrift** (Tim Potter) — https://timpotter.dev/projects/hyperdrift/
   Three.js endless synthwave racer, zero assets: custom GLSL infinite-grid shader, striped-sun shader, HDR bloom, procedural obstacle patterns that stretch with speed, synthesized audio. *Use this because* it's the closest existing blueprint to our exact aesthetic (neon grid + bloom + boost) in pure Three.js and proves a 60 FPS single-file approach.
2. **Synthwave Drive — "Neon Horizon, Infinite Miles"** — https://gist.github.com/Juanmaes83/5fd1fa5e168c1b869817b4b7231d302c (source), demo mirrors on cephalochromoscope.net
   Segment-projected pseudo-3D highway: per-segment curvature/elevation arrays, one shared projection so grid + road converge on the same vanishing point; also has a nice auto-degrade governor (sheds grain → aberration → glow before dropping frames). *Use this because* the segment/curvature math is the cleanest reference for procedural S-curves and crests, and the perf-governor pattern is worth stealing for our post stack.
3. **Miami Beach Road** — https://codetap.org/project/miami-beach-road
   Canvas neon highway with multi-layer parallax skyline, palette/scanline switching. *Use this because* its layered palette + parallax skyline design maps directly to our black-sky backdrop cards (cheap distant neon city instead of geometry).

Key techniques to lift: fragment-shader grid with distance fade, emissive-over-1.0 colors feeding bloom, speed-scaled UV scrolling for the "infinite" feel, striped sun/horizon gradient shader.

## Angle 2 — Three.js best practice 2026

**(a) Wet reflective track floor**

- **Planar reflector with blur (drei `MeshReflectorMaterial`, vanilla port exists)** — https://drei.docs.pmnd.rs/shaders/mesh-reflector-material, vanilla port: https://github.com/0beqz/vanilla-threejs-meshreflectormaterial-example. Renders scene from a mirrored camera into an FBO, then applies depth-aware blur (`mixBlur`, `depthScale`) — the canonical "wet showroom floor" look. *Use this because* the track is one large near-planar surface, which is exactly the case where planar reflection beats SSR: stable, artifact-free, one extra render pass at low resolution (256–512 is enough with blur).
- **SSR (realism-effects / three.js SSR node)** — https://github.com/0beqz/realism-effects, denoiser PR: https://github.com/mrdoob/three.js/pull/33843. Community consensus (three.js forum) is that SSR remains expensive/fragile with disocclusion artifacts, and needs temporal denoising. *Avoid for this game* — reserve for hero screenshots only.
- Verdict: **planar reflector + blur + a roughness/normal ripple map**, with a dark env map as fallback fill.

**(b) Bloom / post stack**

- **pmndrs `postprocessing` with `BloomEffect({ mipmapBlur: true })`** — https://github.com/pmndrs/postprocessing. Forum consensus: the jsm `EffectComposer`/`UnrealBloomPass` path is "very old, very slow"; pmndrs merges effects into fewer fullscreen passes and its mipmap-blur bloom matches UnrealBloom quality at lower cost.
- **Selective bloom without a selection pass**: enable half-float buffers, set `luminanceThreshold: 1.0`, then push neon materials' `emissiveIntensity` above 1 — only neon glows, no second render pass (confirmed pattern: https://github.com/pmndrs/postprocessing/issues/496, https://discourse.threejs.org/t/postprocessing-selective-bloom/61645). Finish with ACES tone mapping in the composer (renderer tone mapping off).
- *Use this because* it's one pass, per-material control of what glows, and the fastest current stack. Add chromatic aberration + vignette from the same library for the boost effect.

**(c) Instanced neon rails**

- **`InstancedMesh2` (agargaro/instanced-mesh)** — https://github.com/agargaro/instanced-mesh. Enhanced InstancedMesh: per-instance frustum culling with BVH, per-instance visibility/opacity/uniforms (`emissive` as vec3 per instance), LOD. *Use this because* rails are thousands of identical segments along a streamed track — BVH culling + per-instance emissive (color-cycling, pulse-on-beat) in one draw call.
- Lighter alternative: **`three-instanced-uniforms-mesh`** — https://www.npmjs.com/package/three-instanced-uniforms-mesh — `setUniformAt('emissive', i, color)` on stock materials.
- Rule confirmed by forum: never use per-rail PointLights; emissive + bloom is the standard fake.

**(d) Arcade vehicle physics**

- **Rapier (`@dimforge/rapier3d-compat`) + `DynamicRayCastVehicleController`** — https://rapier.rs/javascript3d/classes/DynamicRayCastVehicleController.html. Raycast wheels (spring/damper suspension, engine/brake/friction forces, no wheel colliders); drift = drop `wheelSideFrictionStiffness`/`frictionSlip` while drifting, boost = impulse on the chassis body. WASM, deterministic, CCD, trimesh track colliders. *Use this because* it's the 2026 consensus choice — cannon-es is fine for prototypes but has trimesh limitations (only collides with spheres/planes; the icurtis1 demo needed corner-sphere hacks) and no CCD, which matters at boost speeds.
- **Proof it delivers our exact feel**: **skybound-solar-circuit** — https://github.com/ats4321/skybound-solar-circuit — Asphalt-style Three.js + Rapier racer with snap-drift, drift/airtime-charged nitro, jumps, and all handling knobs in one `CAR_TUNING` object. Borrow that tuning-object pattern.
- Fully custom raycast forces (Bruno Simon / slow-roads style) is viable and gives maximal arcade control, but you rewrite suspension, collision, and CCD yourself; Rapier's controller gives the same raycast model pre-stabilized. Custom is only worth it if we drop collisions entirely.

## Angle 3 — Open-source browser racers to borrow from

1. **skybound-solar-circuit** — https://github.com/ats4321/skybound-solar-circuit — Three.js + Rapier + Vite/TS arcade drift/nitro racer with themed neon tracks. *Use this because* it's the closest architectural match: same stack, same handling goals, exposed tuning object, chase camera.
2. **Axis Rush** — https://github.com/tonym128/axis_rush — F-Zero-style Three.js racer using **pmndrs postprocessing** + spline-based procedural track generation (`track.js` Catmull-Rom + item placement) + runtime GLSL textures. *Use this because* its track-spline → geometry → item placement pipeline is exactly how our rails/boost-pads should be laid out.
3. **Slow Roads** (architecture write-ups) — https://anslo.medium.com/slow-roads-tl-dr-a664ac6bce40 and https://web.dev/case-studies/slow-roads — non-branching road midline generated far ahead; high-detail geometry only in a corridor flanking the road; chunked road mesh (high-detail near, low-detail far) cycled as you drive. *Use this because* corridor-based streaming is the proven pattern for a smooth infinite/long track in the browser.
4. Historical reference: **HexGL** (BKcore) — original Three.js AG racer; clones exist (https://github.com/SnehaghoshBarsha444/HexVelocity-HexGL-Clone) but the code is 2012-era — mine it for game-feel ideas (boost pads, ship tilt), not architecture.
5. **Nebula Rush** — https://github.com/EdwardAThomson/Nebula-Rush — TS/Three.js F-Zero-like with physics state deliberately detached from Three objects, Catmull-Rom `TrackFactory`. Good secondary reference for AI opponents and race state machine.

## Recommended stack

- **Rendering:** Three.js + Vite + TypeScript, single WebGL renderer, tone mapping off (done in composer).
- **Track:** Catmull-Rom spline midline → extruded road ribbon in chunks, slow-roads-style corridor streaming; Rapier trimesh colliders per chunk.
- **Wet floor:** vanilla port of drei `MeshReflectorMaterial` on the road ribbon (512px FBO, depth-blurred, subtle normal-map ripple, dark env map fill).
- **Neon:** `InstancedMesh2` rails/pylons with per-instance `emissive` (intensity > 1), fragment-shader grid + striped-sun horizon shader (HyperDrift-style) on cheap background planes.
- **Post:** pmndrs `postprocessing` — half-float buffers, `BloomEffect({ mipmapBlur: true, luminanceThreshold: 1 })`, ACES tone mapping, chromatic aberration + FOV kick on boost; auto-degrade governor (drop aberration → bloom res) before dropping frames.
- **Physics/handling:** Rapier `DynamicRayCastVehicleController`; drift via side-friction reduction + slight yaw assist, boost via chassis impulse + drift/airtime-charged meter, jump via suspension impulse; all knobs in one `CAR_TUNING` object (skybound-solar-circuit pattern).
