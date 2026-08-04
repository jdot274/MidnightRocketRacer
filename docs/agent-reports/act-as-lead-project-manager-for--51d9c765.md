# Agent report: act as lead project manager for

- **Agent id:** `51d9c765-463f-407f-95a4-48a48fc6a456`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/51d9c765-463f-407f-95a4-48a48fc6a456.jsonl`

## Task brief

<user_query>
Act as Lead Project Manager for Joey. Plan-only, read-only: do not edit, create files, commit, deploy, or operate OS mouse/keyboard.

Context: Joey says a THIRD massive new project should be built from the combined inspirations/assets of: (1) Refract's generative shader/watch/visual pipeline, (2) Vanguard's Unity creator/shader platform, golf game, and SDF shader stack, and (3) Blender golf/wavy-contour scenes.

User explicitly replied `/lead-project-manager` when asked whether this should be a creator engine, interactive experience, hybrid; Unity foundation/new project/web engine; and relationship to Refract/Vanguard. Treat that as delegation to decide, not as content selection.

Known source evidence:
- Refract: C:\Users\joeyw\Desktop\Refract\ AGENTS says v39 deployed production with shader lab, shader registry, Spline/Figma/Unicorn bridge.
- Vanguard: C:\Users\joeyw\UnityProjects\VanguardShaderLab_2026-07-25\ has real Unity 6.5 scaffold, `Assets/Vanguard/Shaders/VanguardGolfSDF_v1.shader`, `.hlsl`, `VanguardUber.shader`, `VanguardUberCore.hlsl`, `VanguardNoise.hlsl`, runtime/editor/publishing code.
- Golf waves: C:\Users\joeyw\Desktop\LEDVolume_Waves_scene_v01...v10 `.blend`, strongest named artifacts v07 BEAUTIFUL SDF EMBOSS GOLF, v08 ABSTRACT SDF GOLF WAVES, v09 DENSE CONTOUR SDF GOLF, v10 GAME CAMERA LIME MINIMAL.
- Existing plan C:\Users\joeyw\.cursor\plans\vanguard_creator_platform_54131be9.plan.md describes a Unity visual creator platform and remains partially unimplemented.
- User does NOT want Refract and Vanguard collapsed into one product. New project should be an independent third product but may selectively import proven assets/inspirations.

Return only:
1) one strongly recommended product concept/name placeholder,
2) authoritative engine/project home,
3) boundaries / what gets selectively imported vs not copied,
4) phase-1 vertical slice definition,
5) 3 immediate source files/assets to audit before implementation.
Keep it sharp, decisi

## Final report

I'm seeing a critical pattern emerge: Refract treats GLSL math as the authoritative layer while Figma, Spline, and Unicorn act as presentation surfaces, all sharing the same parameter contract of Morph, Flow, Heat, Ember, Gold, and Grid. Vanguard's GolfSDF shader uses that identical parameter set, which signals a major architectural alignment. The third product should be the playable consumer that brings this contract to life.

So the third product is a neon SDF golf game—a single-hole-at-a-time interactive experience that actually ships, not another authoring tool or shader studio. This fills the gap: Refract handles the generative web pipeline and watch product, Vanguard provides the Unity creator platform for tooling, and the third product is the finished game that leverages both.

For the engine home, I'm leaning toward a separate Unity 6.5 URP project rather than nesting it inside Vanguard. Vanguard's already carrying 152 files of editor machinery, documents, sculpting, persistence, asmdefs, and tests—coupling a game ship date to that platform's refactors would violate the separation principle. A fresh project can shallow-copy the proven shaders without the overhead. Though I'm still weighing whether this should be Unity or web, since Refract deploys to Vercel with WebGL/GLSL while Vanguard's golf SDF is a URP HLSL full-screen raymarch that's essentially a GLSL port.

The call: Unity 6.5 URP as the authoritative home, with WebGL as a publish target rather than a separate codebase. That respects Refract's web-first identity without duplicating it. For the name, I'm settling on **CONTOUR**—the v09 dense contour SDF golf is the visual signature, and it's distinct from both Refract and Vanguard. Working title is `Contour_2026`, tagline "a neon signed-distance golf course you play inside the shader." Project lives at `C:\Users\joeyw\UnityProjects\Contour_2026-08-03\` as a Unity 6.5 URP setup.

Now I'm deciding what to import versus fork: I'll vendor the Vanguard shader code (the SDF, noise, and core modules) under a Contour namespace with a lineage header, keeping it versioned and isolated. I'm also adopting the morph/flow/heat parameter naming from Refract's shader pipeline so a Contour hole can later render as a Refract surface or watch face. From Blender, I'll bake only the outputs from the v09 dense contour and v10 game camera lime minimal—just the heightmap, contour texture, and camera framing values.

I'm explicitly excluding everything else: Vanguard's creator document model, command bus, persistence, sculpt, content ingestion, Figma/GLB adapters, editor windows, WebGL template, and any asmdefs or git submodule references. Same with Refract—no app shell, auth, landing flow, feed, watch product, or Spline/Unicorn runtime bridges. The contract is copy-forward only: shader source and parameter names, nothing more. The flow is one-way from Vanguard and Refract into Contour, and Contour never becomes a dependency of either; if Contour improves the SDF, those improvements can be back-ported.

For the first vertical slice, I'm building one playable hole entirely inside the raymarched SDF that takes 90 seconds to complete and runs at 60fps on his machine at 1440p, with a WebGL build that loads. The full-screen raymarch is the world itself—no polygonal course geometry. The ball is an SDF sphere unioned into the same field, and putting works by aiming and applying power while the ball rolls by sampling the SDF gradient for slope. The shader becomes the physics surface, which is the core idea. The critical technical risk is keeping the CPU-side height query in sync with the same HLSL/C# height function, or everything desynchronizes.

For the interface, I'm using the v10 GAME_CAMERA_LIME_MINIMAL as the default camera with orbit and pointer-based aiming already wired in. Contour lines serve double duty as both the readability layer and the slope-reading UI, so the art directly communicates the gameplay mechanic. The scope is tight: hole-out detection, stroke counting, and one restart button—no menus, progression, multiplayer, creator tools, or save system. The exit criteria is sinking the ball by reading slope only from the contour bands, and the same scene builds to WebGL and runs in Chrome. The main risks are CPU/GPU height-field divergence, WebGL raymarch performance on mid-range GPUs, and whether the Blender-sourced contours work as render-time art rather than pre-baked data.

I need to audit three critical files: the main SDF shader to verify it's a single evaluable height function that can be mirrored on the CPU side and measure raymarch cost, the noise shader to confirm the hills use deterministic, seedable noise that C# can reproduce for both physics and hole generation, and the Blender scene file to extract the contour geometry and camera setup. The user wants a sharp recommendation with clear trade-offs rather than hedged options, so I'll lead with the decision and note the one key fork I resolved plus how to validate it. I'll set the final summary and subtitle to wrap this up.
