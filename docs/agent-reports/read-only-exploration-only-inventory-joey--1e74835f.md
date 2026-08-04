# Agent report: read only exploration only inventory joey

- **Agent id:** `1e74835f-e25f-4505-af92-17fd0c19ebaf`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/1e74835f-e25f-4505-af92-17fd0c19ebaf.jsonl`

## Task brief

<user_query>
Read-only exploration only. Inventory Joey's local Windows AAA creation stack for a proposed third massive project. Cover installed / project evidence for Unity, Unreal, Blender, Visual Studio, WSL, Python, HLSL/GLSL/WGSL/WebGL/Three.js/R3F, build and packaging tooling. Search selective locations: C:\Users\joeyw\Desktop, C:\Users\joeyw\UnityProjects, C:\UEProjects, C:\Users\joeyw\Developer, and likely config/installed tool locations. Do not edit. Return a compact source map: capability, concrete path/evidence, and appropriate role in the new project. Also identify the best existing source assets beyond Refract/Vanguard.
</user_query>

## Final report

# AAA Creation Stack — Source Map (read-only inventory)

Free disk is tight: **C: has ~17 GB free of ~925 GB**. Worth flagging before a third massive project lands.

## Core engines & DCC tools (installed)

| Capability | Concrete path / evidence | Role in new project |
|---|---|---|
| **Unreal Engine 5.6 / 5.7 / 5.8** | `C:\Program Files\Epic Games\UE_5.7` & `UE_5.8` (editors confirmed at `...\Engine\Binaries\Win64\UnrealEditor.exe`); manifest `C:\ProgramData\Epic\UnrealEngineLauncher\LauncherInstalled.dat`. Bundled: QuixelBridge, Fab, Substance, Niagara, Enhanced Input plugins | Primary high-fidelity render/simulation host (Nanite/Lumen/Chaos/Niagara). Standardize on **UE 5.8**. |
| **Unity 6 (6000.5.3f1)** | Unity Hub `C:\Program Files\Unity Hub\Unity Hub.exe`; projects pin `6000.5.3f1`. URP 17.5.0 + gltfast 6.19 + recorder + timeline (`UnityProjects\VanguardShaderLab_*\Packages\manifest.json`) | Secondary real-time / URP shader-lab + mobile-friendly build target; shader-graph experimentation. |
| **Blender 5.1** | `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`; live Blender MCP available | Asset authoring, procedural FX, glb/usdz/abc export pipeline. |
| **Visual Studio 2022 + VS 18 (preview)** | `C:\Program Files\Microsoft Visual Studio\2022`, `...\18`; `.NET SDKs 8.0 / 9.0 / 10.0` | UE C++ compilation + tooling/native builds. |
| **WSL** | **NOT installed** (`wsl --install` needed) | Gap — install if any Linux build/CI or container step is planned. |
| **Python** | 3.13.13 primary (`...\Programs\Python\Python313`), uv-managed 3.13 + 3.15.0b1 (`AppData\Roaming\uv\python`), uv/pipx tools in `~\.local\bin` | Tooling, MCP servers, Blender/UE scripting, asset pipelines. |
| **Node / web toolchain** | Node **v26.1.0**, npm 11.13, global `pnpm`, `vercel`, `serve`, `firebase-tools`, `@bubblewrap/cli` (TWA/APK), `@playwright/mcp`, `chrome-devtools-mcp` | Web-native client, build/deploy, Play Store packaging. |
| **Git** | 2.55.0 | VCS. |

## Real-time graphics / shader pipeline (this is the crown jewel)

There is an existing, working **cross-target shader pipeline** — author once, retarget everywhere:

- **WGSL source of truth** — `C:\Users\joeyw\Desktop\Refract\figma_wgsl_to_hlsl_v1\wgsl\` : 12 fills (water-caustic, nebula, clouds, mesh-gradient, moire, fractal-noise, glowing-wave, concentric-patterns, organic-glow-blob, pattern-grid, `3d-sdf-rounded-ui`, `3d-emissive-pill`).
- **UE HLSL/.ush target** — `C:\UEProjects\OrbitShaderEngine_UE58\Shaders\` : mirrored `FigmaFills_v1\*.ush` + `FigmaWgslCompat.ush` / `GlslCompat.ush` cross-compat shim, plus `VanguardGolfSDF_v1.ush`, `RaymarchStudy.ush`, `OrganicGlowBlob.ush`, `ClarityStreamWave.ush`, `BlueSphereRelay_v1.ush`.
- **GLSL library** — `C:\Users\joeyw\Developer\BASIS-subrepos\basis-lib-shaders\glsl\` : reusable `sdf/primitives`, `sdf/operations`, `noise/{perlin,simplex,worley,value}`, `lighting`, `color`, `post`.
- **Unity URP** — `UnityProjects\VanguardShaderLab_GolfSDF_v1_*` (URP 17.5, recorder for capture).
- **WebGPU (Rust/wgpu)** — `C:\Users\joeyw\Desktop\Prism-Engine\reference-code\rust-companion\src\shaders\*.wgsl` (bloom, card, color_wheel, background).
- **R3F web client** — `C:\Users\joeyw\Developer\vanguard-golf-hole-portal-v2` : `three ^0.175`, `@react-three/fiber ^9`, `@react-three/drei ^10`, `@react-three/postprocessing`, Vite 6 + React 19 + TS.

**Role:** this pipeline should be the new project's shared visual DNA — one WGSL/GLSL source set fanned out to UE, Unity, and web.

## Packaging & delivery tooling

- **Tauri desktop** — `Prism-Engine\core\apps\desktop\src-tauri`, `Refract\app\src-tauri`, `spline-style-editor\apps\desktop\src-tauri`.
- **Play Store TWA (bubblewrap)** — `Refract\playstore_v2\twa-manifest.json`.
- **Monorepo/CI** — `NodeForgeStudio` (turbo 2.6), `BASIS` config store; deploy via `vercel` + `firebase-tools`.
- **UE↔agent bridge** — `C:\UEProjects\MCP_Bridge_58` + live `createlex-local-mcp` (Unreal Python control).

## Best existing source assets (beyond Refract / Vanguard)

1. **`C:\UEProjects\Lyra_5.7`** — Epic's AAA sample framework; best reference for Gameplay Ability System, input, modular gameplay in UE 5.7.
2. **`C:\Users\joeyw\Desktop\Prism-Engine`** — web-native engine blueprint: Tauri + wgpu companion, Gaussian-splat (`.spz`/`.ply`) + WebTransport/HTTP3 streaming architecture. Strong basis for the web-native fork.
3. **`C:\Users\joeyw\Developer\BASIS`** + `BASIS-subrepos\basis-lib-shaders` — zero-dependency config/monorepo source of truth (TS/ESLint/Claude templates) **and** the reusable GLSL shader library. Use to standardize all repos + shaders.
4. **SPIN asset libraries** (largest concrete 3D content):
   - `Desktop\SPIN_Asset_Gallery` — 204 MB (6 `.glb`, `.usdz`, previews).
   - `Desktop\GeneratedMeshes` — 134 MB (`.obj`).
   - `Desktop\SPIN_AssetLibrary` — 111 MB master `.blend`.
   - `Desktop\SPIN_LED_Exports` — 55 MB (`.usdz`/`.glb`/`.abc` animated).
   - `Desktop\BlenderFXLibrary` — 21 Python FX generator scripts + `.blend`.
   - `Desktop\SPIN_SubstanceToolkit` — Substance automation (`.py`/`.json` + sample `.glb`).
5. **Texture/HDRI seeds** — `Desktop\textures` (`.exr` HDRIs + png); `Desktop\AssetPreviews` (18 render previews).
6. **UE production art** — `C:\UEProjects\SPIN_58`, `ULTRA_Studio`, `_ShaderPipeline_UE58`, `OrbitShaderEngine_UE58` (packaged materials/shaders already dialed in).

## Notable gaps / recommendations
- **WSL not installed** — add if Linux CI/containers are in scope.
- **Disk space (~17 GB free)** — offload or prune before importing a third large UE/Unity project.
- Unity editor binary wasn't found in the default Hub editor folder (only the Hub launcher + project pins) — editors are likely on a secondary install path; confirm the `6000.5.3f1` editor is actually installed before relying on Unity.

All paths above are verified present via read-only listing/manifest inspection; nothing was modified.
