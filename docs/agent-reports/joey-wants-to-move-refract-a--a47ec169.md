# Agent report: joey wants to move refract a

- **Agent id:** `a47ec169-a966-41f7-9421-c3c3df868f65`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/a47ec169-a966-41f7-9421-c3c3df868f65.jsonl`

## Task brief

<user_query>
Joey wants to move Refract (a 3D watch design configurator: procedural watch + live GLSL/shader watch faces, currently sprawled across single-file HTML + Three.js CDN, some R3F) into a real "app making engine" / platform where HE has visibility and control over the design. He is NOT satisfied with the obvious answers (plain Vite+R3F, v0, Lovable, Bolt, Framer, FlutterFlow). He explicitly asked to "find niche amazing Three.js packages / engines or other engines." Surface priority: BOTH web (now) and mobile app store (shortly after).

He pointed at "Valessa" (a Three.js Resources tool: converts flat SVG designs into realistic animated 3D glass visuals, real-time browser rendering, R3F + Next.js) as an example of the caliber/vibe he likes.

Do deep, CURRENT research (use web search / Exa / Three.js Resources / context7 as available; today is 2026 — use current results) and return a curated, opinionated shortlist. Cover these buckets:

1. **Niche Three.js / R3F ecosystem packages & engines** that would make Refract look best-in-class and give design control: e.g. Threlte, Tresjs, react-three-fiber + drei, Lygia shader library, TSL (Three Shading Language / WebGPU node materials), leva/tweakpane for control, Theatre.js for animation control, Spline (export to R3F), Rogue Engine, Needle Engine (Unity->web, huge for control+export), PlayCanvas, Bezi, Womp, Polygonjs (node-based Three.js editor — very relevant to "visibility/control"), Shader Park, NodeToy, three.js editor. Evaluate each for: does it preserve/port GLSL shaders, does it give Joey a visual editor / control surface, web + mobile export, maturity.

2. **App-making engines beyond the mainstream** that can host a 3D/R3F canvas AND ship web + native mobile: e.g. Needle Engine, PlayCanvas (has editor + publish), Expo + R3F (expo-gl / react-native-wgpu), Capacitor wrapping the web app, Tauri mobile, Unity/Unreal web export, plus AI builders that output ownable code.

3. For each finalist, state clearly:

## Final report

Research complete. Here's the decision-ready shortlist and ranking.

## Refract → platform research (2026, current)

Context that drives everything: Refract is **already Three.js + partial R3F with hand-written GLSL** (procedural watch + live shader faces). So the two axes that actually decide this are **(a) does my existing GLSL survive** and **(b) how much visual/node control do I get without a rewrite or lock-in**. The "Valessa look" you like is literally `MeshTransmissionMaterial` from R3F/drei — that's an R3F-native technique, which is a strong signal.

One hard technical fact to anchor on: **on the classic WebGL renderer, all your GLSL `ShaderMaterial` code runs as-is.** The moment you move to the **WebGPU renderer, raw GLSL `ShaderMaterial`/`RawShaderMaterial`/`onBeforeCompile` are NOT supported** — you must port to **TSL** (Three's node shader language, which compiles to *both* WGSL and GLSL). Three.js r182 now makes WebGPU the recommended renderer with automatic WebGL2 fallback, and there's an official GLSL→TSL transpiler that does ~90% of the work. So "keep every shader" = stay WebGL now, and port to TSL later for a WebGPU/native future (not a throwaway — TSL is the node-based control surface too).

---

### Bucket 1 — Niche Three.js / R3F ecosystem (control + shader portability)

- **Polygonjs** ⭐ (the standout "niche amazing" find) — a genuine **node-based 3D app engine built on Three.js**. Node contexts for GLSL (GL), materials (MAT), procedural modeling (SOP), animation, post, events. Runs as an **npm module**, does **tree-shaken exports**, **saves everything as git-tracked text/JSON**, and **integrates directly into three/R3F/vue/vanilla**. This is the closest thing to "an engine where I visually see and control the design" that still outputs to your stack. Caveat: it *authors* GLSL through nodes (and lets you drop in custom GLSL), rather than importing your existing hand-written shaders untouched — existing faces go in as custom GL/glsl nodes or run alongside. Small team / niche maturity, but exactly on-target for your "control to design" desire.
- **React Three Fiber + drei** — the mature substrate (Poimandres, ~900k wkly). `MeshTransmissionMaterial` = the Valessa glass look out of the box. Keeps 100% of your GLSL. WebGPU via the async `gl` factory in v9. Zero lock-in.
- **NodeToy** — web **shader-graph editor** for three/R3F with a Custom Expression node (write GLSL/HLSL inline), self-host or URL-host via `three-nodetoy`/`react-nodetoy`. Great visual shader control, but exports a **proprietary format + runtime lib**, not clean raw GLSL → mild lock-in. Good complement, not a foundation.
- **TSL (Three Shading Language)** — node-based JS shaders → WGSL+GLSL. This is your future-proof, node-based, cross-platform shader path and the *only* shader route on WebGPU/native. Adopt gradually.
- **Lygia** — the biggest multi-language shader library (GLSL/HLSL/Metal/WGSL/CUDA); `resolve-lygia` drops it into R3F. Force-multiplier for building best-in-class faces fast.
- **Leva / Tweakpane** — live control panels for R3F (this is your "visibility/control" surface today, dev-time or shipped).
- **Theatre.js** (+ `@theatre/r3f`) — visual animation studio with timeline/keyframes over any JS/Three var. Caveat: 1.0 dev moved to a private repo, public repo quiet since 2024 — usable and OSS but momentum risk.
- **Spline** — beautiful browser editor, exports **code** to R3F/three/react/next and self-host, multi-platform (web/iOS/Android). But design-first; **custom GLSL isn't its strength** and the `.splinecode` runtime is soft lock-in. Good for quick hero pieces, not for your shader-heavy core.
- **Womp** (organic modeling, GLB export) and **Bezi** (spatial/VR handoff) — asset/handoff tools, not app foundations. Skip for Refract's core.

### Bucket 2 — App-making engines that host a 3D canvas AND ship web + native

- **Needle Engine** ⭐ (best true "engine with visual editor + export") — build in **Unity editor**, export optimized glTF, run on a **Three.js-based web runtime**; auto texture/Draco compression, LODs, WebXR/AR, hot reload. Massive visual control and asset pipeline. Two big caveats for you: **existing GLSL doesn't cleanly survive** (materials come from Unity Shader Graph → auto-converted; custom web shaders are experimental, though you *can* attach a Three.js `ShaderMaterial` at runtime via TS), and it requires a **10GB+ Unity install**. Web now; mobile via web-wrap or WebXR.
- **PlayCanvas** — most advanced **in-browser WebGL/WebGPU editor** with **one-click publish + self-host zip + REST/Editor API**, and a thin **`@playcanvas/react`** (used by Snap AI). Custom **GLSL/WGSL** shaders with `#include` chunks. But it's its **own engine, not Three.js** → porting Refract = a real rewrite, and it's **Snap-owned**.
- **Expo + R3F via `react-native-wgpu`** (wcandillon) — real **native iOS/Android** R3F. Three.js runs out of the box from r168+; there's a ready `react-native-3d-template`. Requires `expo prebuild` + a metro/patch-package tweak, and it's **WebGPU-only on native → shaders must be TSL/WGSL** (GLSL won't run there). Still **experimental**, but this is the legit "write-once shaders (TSL) run on web + native" path Shopify is already prototyping.
- **Capacitor** — wrap the R3F web app in a native WKWebView shell → App Store / Play Store with your **entire web codebase and all WebGL GLSL intact**. Mature, mobile-first, fastest path to "mobile shortly after." **Tauri 2** also does mobile (and its iOS WebKit talks straight to Metal, nice for shader perf) but is less polished for mobile.
- Unity/Unreal full web export — heavy (20MB+ / pixel-streaming). Not worth it here.

### Bucket 3 — Finalist scorecard

| Option | Design/control | Every GLSL survives? | Web now | Mobile soon | Migration effort | Lock-in |
|---|---|---|---|---|---|---|
| **R3F/Vite + control stack** | High (Leva/Tweakpane/Theatre) | ✅ on WebGL; TSL for WebGPU | ✅ native | ✅ Capacitor now / Expo+wgpu later | Low (you're already here) | ~None |
| **+ Polygonjs (node layer)** | Very high (node-based) | Mostly (authored as nodes; custom GLSL supported) | ✅ | ✅ (exports to R3F) | Low–med | Low (git-text, npm, tree-shaken) |
| **Needle Engine** | Very high (Unity editor) | ❌ mostly rebuilt in Shader Graph | ✅ | ✅ (web-wrap/WebXR) | High (Unity adoption) | Med (Unity dependency) |
| **PlayCanvas** | Very high (editor+publish) | ❌ rewrite to PC shaders | ✅ | ✅ (wrap) | High (engine swap) | Med–high (Snap) |
| **Spline** | High (design UX) | ❌ not for custom GLSL | ✅ | ✅ | Low for hero bits | Med (.splinecode) |

---

## Ranked recommendation

**🥇 Top pick — R3F (Vite) as the substrate + a node-based control layer, TSL/WebGPU-ready, ship mobile via Capacitor→Expo.**
You said you're tired of "plain Vite+R3F," and you're right to be — the differentiator isn't the substrate, it's the **control stack you layer on top**: **Polygonjs** for node-based procedural + shader authoring (this is the "engine where I see and control the design" you're describing, and it exports back to R3F, saves as git text, tree-shakes), **Leva/Tweakpane** for live parameter surfaces, **Theatre.js** for visual animation, and **Lygia** as the shader toolbox. This keeps **every existing GLSL shader** (WebGL), gives the Valessa-grade glass via `MeshTransmissionMaterial`, has **zero lock-in**, ships **web today**, goes **native soon** (Capacitor immediately with all shaders intact; Expo + `react-native-wgpu` for true native once you port faces to TSL). TSL is the through-line: it's simultaneously your node-based shader control *and* your web→WebGPU→native portability. Best all-around on all four of your criteria.

**🥈 Alternate 1 — Needle Engine (Unity as the visual control surface).**
Pick this if you want a *real editor* with the deepest visual/asset control, AR/WebXR, and you're willing to (a) adopt Unity and (b) rebuild your shader faces in Shader Graph (or attach Three.js `ShaderMaterial` at runtime). Maximum "control to design," strong web + mobile/AR story via glTF — but it doesn't preserve your hand-written GLSL cleanly and it's a heavier commitment.

**🥉 Alternate 2 — PlayCanvas (all-in-one editor + one-click publish, mature).**
The most polished in-browser editor-with-publishing, supports custom GLSL/WGSL, self-host + REST API, and has a React wrapper. Choose it only if an integrated editor+hosting product matters more than reusing your Three.js/R3F code — because it means an engine rewrite and Snap ownership. (If you like the *node-shader* half of this but want to stay in R3F, use **NodeToy** instead as a bolt-on shader editor.)

Net: adopt **Polygonjs on top of R3F** as your "control-to-design" engine, keep GLSL on WebGL now, migrate faces to **TSL** as you move toward WebGPU + **Expo/react-native-wgpu** native — with **Capacitor** as the zero-risk bridge to the app stores in the meantime.

I've gathered enough research to synthesize a decision-ready ranking. The key contenders are Refract, which offers a single-file HTML setup with Three.js and live GLSL shader editing for maximum design control, and Polygonjs, a node-based Three.js editor that generates GLSL through GL nodes.

Needle Engine converts Unity projects to glTF with automatic shader graph translation, though it's heavy and less ideal for porting existing GLSL directly. R3F with drei and Vite is the mature, lock-in-free option that preserves full GLSL control and already powers similar projects like Valessa's. TSL is a node-based shader language that compiles to both WGSL and GLSL, future-proofing for WebGPU, but migrating existing GLSL to TSL requires porting since WebGPURenderer doesn't support raw ShaderMaterial—though a transpiler handles about 90% of the work. For mobile, react-native is the path forward.

For native mobile, wgpu with Expo and R3F works on iOS/Android from r168+ but is experimental and requires WGSL/TSL instead of GLSL. Capacitor is the more mature option—it wraps the entire web codebase including WebGL shaders into a native app via WKWebView, making it the best mobile-first approach. Tauri 2 also works but is less polished; Tauri's iOS implementation uses WebKit with direct Metal access for better shader performance. Lygia is a massive multi-language shader library supporting GLSL, HLSL, Metal, WGSL, and CUDA, with resolve-lygia integration for R3F. Leva and Tweakpane provide control panels for R3F, while Theatre.js offers animation studio capabilities with an R3F extension, though it's in a transitional state. Spline is a design-first tool that exports to R3F and multiple platforms including iOS/Android, but it's not built for custom GLSL and introduces some lock-in unless you use the r3f-spline hook. NodeToy is a web-based shader graph editor for Three.js and R3F with custom expression nodes for GLSL/HLSL, exportable via three-nodetoy or react-nodetoy, and it supports self-hosting.

NodeToy uses a proprietary format with a runtime library, creating mild lock-in, but it's a solid control surface. PlayCanvas is a mature editor with one-click publishing, self-hosted zip exports, REST API, and a thin React wrapper, supporting custom GLSL/WGSL ShaderMaterial with include chunks—but it uses its own engine rather than Three.js, so porting Refract's Three.js and R3F code would require a rewrite.

The ranking prioritizes design visibility and control, shader portability, web-now with mobile-soon capability, and visual quality. Since Refract is already built on Three.js and partly R3F with GLSL shaders, the best path is consolidating on R3F with Vite as the core platform, then layering visual control surfaces like Leva/Tweakpane for immediate use, Polygonjs and/or NodeToy for node-based shader authoring, and Theatre.js for animation—shipping mobile via Capacitor now and Expo with react-native-wgpu later. This preserves 100% of GLSL on WebGL and provides a clean TSL/WebGPU migration path. Polygonjs stands out as the best node-based control that maps to the design vision while outputting to R3F/Three and remaining git-friendly and ownable.

Needle Engine offers the strongest "app-making engine with visual editor and export" if willing to adopt Unity as the control surface—massive control but existing GLSL would need rebuilding in Unity Shader Graph, making it heavier. The honest answer is R3F as the runtime foundation plus a niche node-based control stack on top, even though that feels like "plain Vite+R3F" at first glance—the differentiation comes from the specialized control layer layered above it.

Polygonjs deserves to be the headline find here: it's a node-based 3D app engine built on Three.js that exports to R3F, stays git-friendly, and gives him the visual control and design visibility he wants while keeping all his GLSL shaders intact. Pairing that with R3F/Vite as the substrate, plus the control stack (Leva, Theatre.js, Lygia), and mobile via Capacitor, hits all the constraints—node-based like Needle, full visibility and control, web-now and mobile-soon, zero lock-in.

For alternates: Needle Engine if he's willing to rebuild shaders for maximum visual control and AR support, or PlayCanvas as the all-in-one mature option, though I'll mention NodeToy as a lighter node-centric R3F alternative too.
