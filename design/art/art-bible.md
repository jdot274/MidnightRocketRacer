# MIDNIGHT ROCKET RACER — Art Bible
**Version 1.0 | Solo-Mode Authored | August 3, 2026**

---

## §1 — Visual Identity Statement

### The One-Line Rule

> *Every frame looks like a luxury hypercar concept render that is also moving at 900 km/h.*

This game exists at the intersection of Zaha Hadid architecture, precision die-cast product photography, and contemporary 2026 real-time rendering. The visual register is **aspirational, clean, and kinetic** — not raw, not retro, not neon-dripping. The darkness is intentional. The light is earned.

---

### Core Design Principles

#### Principle 1 — Ink Ground, Earned Light
The world begins in near-total blackness (`#05060a`). Every luminous element — track rails, HUD elements, vehicle accents, boost trails — must earn its right to exist. Light sources are deliberate. Glow is a signifier of energy and importance, not decoration. Bloom radiates outward from a physical source; it is never applied atmospherically to the whole scene.

**Design Test:** Cover 80% of any screenshot. The remaining 20% must tell you exactly what matters in the scene — where to look, what is dangerous, what is available.

#### Principle 2 — Precision Over Ornament
This game is built from continuous sweeping curves and machined precision. Forms have mass, weight, and finish quality. Details emerge from geometry and material response to light, not from overlaid pattern-work or surface decals. A vehicle body panel should read as premium injection-moulded carbon-glass composite. A track section should read as a fused aerospace-grade ribbon.

**Design Test:** Remove all color from any asset. The form, surface finish, and silhouette must still communicate the object's identity and quality tier.

#### Principle 3 — Restraint at Scale
Three neon colors. One surface language. One lighting rig per game state. The visual power of this game comes from **consistency and contrast** — the same cyan rail glowing identically on every section of track creates a hypnotic, unified sense of architecture. Introducing a fourth accent color, a new surface pattern, or a competing light source breaks the spell.

**Design Test:** Every new visual element must answer: *Which of the three existing accent roles does this serve?* If it serves none and creates a fourth, it is rejected.

---

## §2 — Color Palette

### Foundation

| Token | Hex | Role | Usage |
|---|---|---|---|
| `ink-void` | `#05060a` | Background absolute | Scene void, skybox, UI base, button fills |
| `gloss-chrome` | `#0b0e16` | Surface dark | Vehicle body, track deck surface, UI panels |
| `chrome-mid` | `#141824` | Surface mid | Inner geometry faces, tertiary UI |
| `chrome-rim` | `#1e2535` | Highlight base | Rim-light fringe on vehicles, panel edges |

### Primary Accent — Electric Blue
| Token | Hex | Luminance | Role |
|---|---|---|---|
| `blue-core` | `#00a2ff` | 100% | Track boundary rails, primary HUD elements, speedometer |
| `blue-dim` | `#0060aa` | 45% | Track surface line inlay, inactive HUD states |
| `blue-faint` | `#001a33` | 10% | Ambient fill light, floor glow scatter |

**Semantic:** Blue is the language of the track and of navigation. It means *here is the path, here is your status.* It is architectural — constant and structural.

### Secondary Accent — Magenta / Hot Pink
| Token | Hex | Luminance | Role |
|---|---|---|---|
| `pink-core` | `#ff1f6e` | 100% | Gates, checkpoints, wrong-way indicator, rival player tint |
| `pink-dim` | `#991244` | 45% | Inactive gate rings, heat haze fringe |
| `pink-faint` | `#2a0318` | 10% | Danger zone ambient fill |

**Semantic:** Magenta is the language of *decision and consequence.* Gates mark obligations. Wrong-way markers use full pink. Rival vehicles wear a pink tint to distinguish from the player's blue-dominant livery.

### Tertiary Accent — Acid Lime
| Token | Hex | Luminance | Role |
|---|---|---|---|
| `lime-core` | `#57ff6b` | 100% | Boost active, pickup collected, lap record, finish state |
| `lime-dim` | `#28992f` | 45% | Boost meter fill, energy field surface |
| `lime-faint` | `#091a0b` | 10% | Post-boost residual bloom, energy field ambient |

**Semantic:** Lime is the language of *acceleration, reward, and success.* It fires when the player does something right — boost activation, clean gate pass, lap completion. Its SDF-terrain energy-field motif (from the VanguardGolfSDF reference series) appears in energy zones and boost pads as a living, rippling field of emissive green displacement.

### Surface Treatment Language
Surfaces are never flat matte. All opaque geometry uses one of three finish tiers:

| Tier | Roughness | Metalness | Description |
|---|---|---|---|
| **Mirror Chrome** | 0.0–0.05 | 1.0 | Track rails, vehicle trim lines — full mirror reflection |
| **Satin Carbon** | 0.2–0.35 | 0.7–0.85 | Vehicle body panels, track deck — absorbs color, retains form |
| **Matte Void** | 0.8–1.0 | 0.0 | Environmental void geometry, barrier interiors — light sink |

### Colorblind Accessibility (Deuteranopia / Protanopia Safe)

The three primary accents are deliberately selected for maximum discrimination under the two most common deficiencies:

| Situation | Primary Signal | Secondary Signal (shape/position) |
|---|---|---|
| Blue rail vs. Magenta gate | Horizontal vs. vertical orientation of emitter | Blue = continuous strip / Magenta = discrete ring |
| Lime boost vs. Magenta gate | Lime = ground-plane / Magenta = above threshold | Lime = floor glow / Magenta = suspended ring |
| Rival vs. player vehicle | Magenta tint vs. blue tint | Player vehicle always screen-center bottom; rival vehicle above center |

All semantic states must also carry a distinct **shape + position** signal so that color is additive, not the sole carrier of meaning.

---

## §3 — Lighting & Atmosphere

### Governing Principles
This game uses a **single dominant light source per game state** + **emissive geometry** as secondary fill. No ambient occlusion halos. No point-light scatter fields. Bloom post-processing is the primary glow delivery mechanism — a physical emissive surface at intensity ≥ 2.0 will bloom correctly in the Three.js `UnrealBloomPass` without additional lights. This keeps the scene both visually credible and GPU-affordable.

All lighting uses the Three.js `UnrealBloomPass` with the following base parameters (tuned per state):

```
bloomStrength: 0.4–1.6
bloomRadius: 0.4–0.7
bloomThreshold: 0.7–0.85
```

### State: Main Menu
**Intent:** Luxury product reveal. Still, expectant.
- Void background. Single top-down rim area light (`#0d2850`, intensity 0.4) grazing the hero vehicle.
- Cyan LED dot-grid floor panel, slowly breathing emissive intensity (0.6–1.2 over 4s sine). References `iridescent_dotted_wave_preview_v2` and `pinterest_dotted_led_globe_v1_preview` — the dot-grid is the hero surface of the menu environment.
- Vehicle sits on a raised glossy black plinth with a thin cyan ring pedestal glow exactly replicating the `balllab-cyan-vault` visual — the vehicle is showcased like a tournament artifact.
- No moving particles. No background animation except floor breathing.
- Bloom: `strength 0.6, radius 0.5, threshold 0.82`.

### State: Countdown / Pre-Race Staging
**Intent:** Building tension. Controlled anticipation.
- Track lights animate on from back to front in a 1200ms sweep, revealing the ribbon circuit.
- Single `DirectionalLight` at 15° camera-side angle, warm white (`#c8d8f0`, intensity 1.2) — gives vehicle specular its primary highlight.
- Magenta gate rings pulse at 0.5Hz. Start line emits a diffuse blue ground fog (emissive plane, additive blending, opacity 0.18).
- Track rails brighten from `blue-dim` to `blue-core` during the 3-count.
- Bloom: `strength 0.9, radius 0.5, threshold 0.80`.

### State: Racing (Default)
**Intent:** Clarity at speed. Zero visual noise that competes with gameplay.
- Track is the dominant light source — rail emissives light the car from below. This is the only scene where underside reflections on the track deck matter.
- Camera velocity blur + chromatic aberration scale with speed (both capped at 50% max to avoid illegibility).
- Floor planar reflector active: `MirrorReflector` with blur factor 0.04 (slight softness). The car's silhouette and the track rails reflect cleanly.
- Bloom: `strength 0.5, radius 0.45, threshold 0.82`. Rail glow stays tightly hugging geometry.
- Haze layer: a flat `FogExp2` with density 0.0012, color `#000d1a` — adds depth to the circuit void without washing out.

### State: Boost Active
**Intent:** Sensory overload for 1.8 seconds. Purposeful, not chaotic.
- Lime bloom surge: `strength` ramps from 0.5 → 1.6 in 0.15s, holds, decays over 1.65s.
- Camera FOV widens +8° over 0.12s, returns in 0.35s (ease-out cubic).
- All rail blue dims to 35% — lime takes absolute dominance during boost.
- Vehicle emissive underbody activates: lime line accents at intensity 3.5.
- After boost ends, 0.8s of residual lime bloom `strength 0.4` decays to zero.
- Bloom: `strength 1.6, radius 0.65, threshold 0.75`.

### State: Finish / Lap Record
**Intent:** Triumph. Clean, not garish.
- Lime sweep pulse radiates from finish line geometry outward at 80m/s, fading within 0.4s.
- Track rails hold their blue state. No color change to the track.
- Scoreboard / result overlay enters with a 240ms fade from below.
- Confetti particle system is deliberately absent — this is not a children's party. The reward is the lime sweep + audio.
- Bloom: `strength 0.8, radius 0.6, threshold 0.78`.

---

## §4 — Character / Vehicle Art Direction

### Hero Vehicle Design Language

The hero vehicle is a **die-cast luxury hypercar concept** interpreted for zero-gravity anti-gravity racing. The design vocabulary draws from:
- Real-world concept cars: Bugatti La Voiture Noire, Lotus Evija, BMW Vision M NEXT
- The `balllab-cyan-vault` reference: the glossy black-chrome sphere split by a precise equatorial chrome band is the direct analogue for the vehicle body — a single continuous black volume interrupted by a luminous chrome crease
- Zaha Hadid's parametric furniture curves — sections of the body are not flat but continuously curvature-varying

### Silhouette Rules

1. **Low and wide.** Viewed from behind, the vehicle width:height ratio is ≥ 2.2:1. It reads as a shard, not a pod.
2. **One dominant form plane.** The upper body surface is a single flowing surface — no secondary cabins, no visible cockpit bubble. The driver interface is implied, not modelled.
3. **Four hover-emitter pylons.** The only visible mechanical elements are four hover emitters, one at each corner. They are the size of a clenched fist. Their glow color is the player's chosen accent color (default: `blue-core`). These are the only customizable visual element on the base vehicle.
4. **No visible exhaust ports, no visible wheels.** This is an anti-grav racer. Exhaust-port cutouts are a retro trope. The only rear element is the boost trail origin — an emissive slit in the rear fascia.
5. **Chrome crease line.** A single horizontal chrome strip runs the full width of the vehicle at approximately 35% height. It is mirror-finish (`roughness 0.0, metalness 1.0`). In motion, this crease captures and redistributes track rail reflections, making the vehicle read as alive even when not boosting.

### Vehicle Material Stack

| Layer | Material | Notes |
|---|---|---|
| Body | Satin Carbon composite | `roughness 0.28, metalness 0.82, color #0b0e16` |
| Chrome crease | Mirror chrome strip | `roughness 0.0, metalness 1.0` — full-width single mesh strip |
| Canopy/visor | Dark tinted gloss glass | `roughness 0.0, metalness 0.0, transmission 0.6, ior 1.5` — references `balllab-01-emerald` interior luminescence |
| Hover emitters | Emissive accent color | `emissiveIntensity 2.5`, player accent color |
| Boost slit | Emissive lime | Active only during boost, `emissiveIntensity 4.0` |
| Underbody | Emissive accent dim | `emissiveIntensity 0.4`, always-on ambient underside glow |

### Rival Vehicle Variants
Rival vehicles share the identical silhouette and material stack. Differentiation is achieved through:
- **Accent color swap**: primary hover-emitter color shifted to magenta (`#ff1f6e`) or white (`#e8eeff`)
- **Livery panel**: a single secondary color panel on the upper body nose — a 1-texture decal, max 512×128px
- **No shape divergence**: rivals are not given unique silhouettes for V1. Visual clarity > variety at this stage.

---

## §5 — Environment & Track Art

### The Ribbon Circuit

The race track is a **single continuous architectural ribbon** suspended in void space. It is not a road; it is closer to a Formula-scale wind-tunnel model fused with a Möbius strip — a section of formed aerospace composite that curves, banks, loops, and inverts while maintaining perfect cross-sectional consistency.

**Track cross-section profile (canonical):**
- Width: 24m race surface
- Raised edge guides: 1.2m high × 0.3m wide chrome rail (the primary emissive light source)
- Deck surface: `gloss-chrome` material with a 2×1 UV tiling of the **iridescent dot-grid motif** — a 512×512 normal/emissive tile derived from the `iridescent_dotted_wave_preview_v2` reference. The dots are barely visible at speed, adding microdetail without noise.
- Underside: `matte-void` material — the track is a thin object, not a solid. Its underside is absent in the player's normal view but present in floor reflections.

### Arena Void

The environment beyond the track is empty void. No skybox. No stars. No particles floating in background space. The void is `#05060a` (ink-void). It is not a gradient. It is not atmospheric blue. It is absolute dark.

The track glows against this void. This is the entire spectacle. Do not compromise it.

**Two exceptions to pure void:**
1. **Depth hazing:** `FogExp2` density 0.0012, `#000d1a` — so the far end of the track dissolves gently rather than hard-culling.
2. **Energy field panels (boost sections):** Beneath boost-pad sections, a thin plane at track level emits the VanguardGolfSDF energy-field motif — emissive lime Perlin-noise displacement field, visible only through the planar gap between the track deck edge and the horizon. This is the SDF-terrain from `golf-v1-live-B-animated` repurposed as a living energy underlayer.

### Floor Reflections

The primary camera height is low — 1.8m above track surface. This means **the reflection of the vehicle and track geometry in the track deck is always visible.** The `MirrorReflector` plane is the single most important atmospheric element in the game.

Reflection quality rules:
- Resolution: 512×512 per reflector instance (single reflector covering the visible track section)
- Blur factor: 0.04 (soft — this is a polished but not perfect surface, not a laboratory mirror)
- Reflection clips to track width — it does not reflect the void
- The reflected vehicle's boost trail and hover emitters must be visible in the reflection
- Update rate: every frame when within 40m of camera; every other frame beyond 40m

### Haze and Depth

No volumetric light shafts. No god rays. These are retro-atmospheric tropes.

Depth is communicated through:
1. Fog fade (see above)
2. Track emissive falloff — rail emissive intensity scales with a distance-based `pow(1 - d/maxDist, 2.0)` in the vertex shader so near rails glow brighter, far rails dim naturally
3. Camera depth-of-field: very slight, `focusDistance 80m, focalLength 45mm equivalent, maxBlur 0.003`. Enough to soften far background, not enough to obscure gameplay.

---

## §6 — UI Visual Language

### Typography

**Display / Large Numbers:** [Orbitron](https://fonts.google.com/specimen/Orbitron) — Weight 700. Used for speedometer, lap counter, countdown numbers. All caps. Letter-spacing 0.08em.

**UI Labels / HUD text:** [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Weight 400/500. Used for position, time, boost meter labels. All caps. Letter-spacing 0.12em. This is a deliberate anti-contrast to Orbitron: mono-spaced engineering readout feel.

**No custom font assets in V1.** Both fonts are Google Fonts CDN. Both are subset to uppercase Latin + numerals + punctuation only (saves ~80% of font file size).

### HUD Layout Principles

The HUD follows a **four-corner anchor** system. The center of the screen is always clear. Racing information populates the corners; nothing is center-screen except countdown numbers and the wrong-way indicator.

| Corner | Element |
|---|---|
| Bottom-left | Speedometer (large Orbitron number) + speed unit label |
| Bottom-right | Boost meter bar + boost ready indicator |
| Top-left | Lap counter + race position |
| Top-right | Race timer + best lap |
| Center | Countdown only; Wrong-way indicator only |

### Neon Restraint Rules

The HUD uses **one emissive color per region**:
- Active/important values: `blue-core` (#00a2ff) — the same blue as the track rails. The HUD is an extension of the track's visual language, not a separate system.
- Boost meter fill: `lime-core` (#57ff6b) — matches boost state color
- Warning / wrong-way: `pink-core` (#ff1f6e)
- Inactive / background elements: `chrome-mid` (#141824) at 60% opacity

**Neon prohibition:** No text glow on non-critical labels. Only values the player must read in ≤ 0.3 seconds receive bloom-emissive treatment. Decorative text has zero glow. This is the critical restraint rule — the HUD's legibility depends on exactly three elements being bright.

### HUD Panel Design Language

Panels are not boxes. They are **minimal chrome-strip anchors:**
- A 1px `chrome-rim` (#1e2535) top-edge line
- A semi-transparent `gloss-chrome` fill (`#0b0e16` at 55% opacity)
- 16px corner radius
- No border-box shadows
- No gradient fills
- Padding: 12px vertical, 16px horizontal

This creates panels that read as machined aluminum inserts in the viewport, consistent with the vehicle's chrome crease language.

### Typography Scale

| Element | Font | Size (1920px base) | Weight |
|---|---|---|---|
| Speedometer number | Orbitron | 72px | 700 |
| Speed unit | DM Mono | 18px | 400 |
| Lap / position | Orbitron | 36px | 700 |
| Timer | DM Mono | 28px | 500 |
| Countdown digits | Orbitron | 160px | 700 |
| Wrong-way label | Orbitron | 48px | 700 |

All sizes are `vw`-relative in the Three.js canvas overlay CSS.

---

## §7 — VFX & Particle Style

### Governing VFX Philosophy
Particles in this game are **not decorative.** Every particle system exists to communicate game state or physical consequence. Idle particle ambience is absent. The void is clean.

### Boost Trail
**Trigger:** Player activates boost.
**Visual:** Two parallel ribbon trails (one per engine slit corner) using `TrailRenderer`-equivalent geometry in Three.js (a `BufferGeometry` updated each frame with a tapering width from 0.4m → 0 over 2.4m length).
- Color: `lime-core` → transparent (additive blending)
- Width: 0.4m at origin, 0.0m at tail
- Emissive intensity: 3.0 at origin, decays with `pow(t, 1.8)`
- Texture: single 64×1 gradient strip (horizontal fade to transparent)
- Maximum active ribbons: 2 (one per engine slit)
- Particle budget: 0 — this is geometry, not sprites

**On boost end:** trail fades over 0.35s.

### Gate Pulse
**Trigger:** Player passes through a checkpoint gate.
**Visual:** The ring gate emits a single outward radial pulse — a plane circle that scales from 0 → 3× gate diameter over 0.4s, fading opacity from 1.0 → 0 with `ease-out cubic`.
- Color: `pink-core` for standard gates; `lime-core` for final gate/finish
- Geometry: `RingGeometry(r, r+0.12, 64)` — thin ring, not a disc
- Additive blending
- Particle count: 0 — geometry only

### Hover Emitter Glow
**Constant:** Each of the four hover emitters emits a small circular ground-projection halo — a `CircleGeometry(0.6m, 24)` as a `DecalGeometry` projected onto the track surface.
- Color: player accent color (default `blue-core`) at opacity 0.35
- This is the vehicle's "shadow" — its ground contact signal
- Updated once per frame per visible vehicle
- On boost: halos scale to 0.9m radius, opacity 0.55 over 0.1s

### Pickup Collection Effect
**Trigger:** Vehicle collects energy pickup.
**Visual:** A burst of 12 billboard sprites radiating outward from pickup position.
- Initial velocity: radial, 8m/s
- Gravity: none (void space)
- Lifetime: 0.45s
- Sprite size: 0.2m, scaling to 0 over lifetime
- Color: `lime-core` (additive)
- Sprite texture: 64×64 soft glow dot (single mip)
- Total sprite count: 12 per pickup event

### Wrong-Way Indicator Flash
A full-screen `pink-core` vignette at 18% opacity flashing at 2Hz while wrong-way condition is active. This is a post-processing shader uniform, not a DOM overlay. No particles.

### Air Distortion (Speed Lines)
At speeds above 75% of max velocity, 6 white streaks (`lime-faint` tinted) radiate from screen center outward using a custom fullscreen quad shader with UV-stretched noise. Intensity scales 0 → 1 from 75% → 100% max speed. This replaces traditional speed-line particle systems entirely.

---

## §8 — Asset Standards (Three.js / WebGL)

### Platform Context
- Runtime: Three.js r168+ (WebGLRenderer)
- Target: Chrome on mid-spec gaming PC (RTX 3060 Ti class), 60 fps locked
- Render resolution: 1920×1080 native; no supersampling in V1
- Post-processing pipeline: `EffectComposer` → `RenderPass` → `UnrealBloomPass` → `OutputPass`
- Reflections: single `MirrorReflector` plane (Three.js extended)
- Shadows: disabled — replaced entirely by emissive ground projection halos

### Tri Count Budgets

| Asset Category | Triangle Budget | Notes |
|---|---|---|
| Hero vehicle (LOD0, ≤30m) | 18,000 tris | Includes all 4 hover emitter geometry |
| Hero vehicle (LOD1, 30–80m) | 6,000 tris | Emitters simplified to low-res |
| Rival vehicle | Same as hero | Shared mesh, livery decal swap |
| Track segment (24m section) | 3,200 tris | 8 segments always loaded = 25,600 tris |
| Gate ring (checkpoint) | 800 tris | Per gate; max 4 visible simultaneously |
| Pickup item | 400 tris | Max 8 visible simultaneously |
| Environment debris / detail | 0 tris | Prohibited in V1 — void environment only |

**Total draw budget target: ≤ 85,000 tris per frame (visible geometry)**

### Texture Budgets

| Asset | Albedo | Normal | ORM (Occlusion/Roughness/Metal) | Emissive |
|---|---|---|---|---|
| Hero vehicle | 1024×1024 | 1024×1024 | 1024×1024 | 512×512 |
| Rival livery decal | 512×128 | — | — | — |
| Track segment | 512×512 (tiled) | 512×512 (tiled) | 512×512 (tiled) | 512×512 (tiled) |
| Gate ring | 256×256 | — | 256×256 | 256×256 |
| Pickup item | 128×128 | — | — | 128×128 |

All textures: `.ktx2` format with Basis Universal compression (ETC1S for albedo/ORM, UASTC for normals/emissives).

**Total VRAM budget target: ≤ 80 MB (textures only)**

### Material Count Rules

| Rule | Value |
|---|---|
| Max unique `THREE.MeshStandardMaterial` instances | 12 |
| Max unique `THREE.ShaderMaterial` instances | 6 |
| Emissive materials must declare `emissiveIntensity` as a uniform (not baked) | Required |
| No `THREE.MeshPhongMaterial` or `THREE.MeshLambertMaterial` | Prohibited |
| No `envMap` on track deck surface (performance) | Prohibited; use MirrorReflector only |

### Shader Uniform Contract

All custom ShaderMaterials must expose these uniforms for the pipeline:

```glsl
uniform float uTime;          // seconds since scene start, from renderer clock
uniform float uBoostFactor;   // 0.0–1.0, driven by game state
uniform float uSpeed;         // normalized 0.0–1.0 vehicle speed
uniform vec3  uAccentColor;   // player accent color (default: #00a2ff)
uniform float uEmissiveScale; // global emissive scaler for bloom tuning
```

This contract allows the bloom post-pass to be globally tuned from a single `uEmissiveScale` float without touching individual materials.

### Naming Convention

All assets follow: `[category]_[name]_[variant]_[size].[ext]`

| Category prefix | Used for |
|---|---|
| `veh_` | Vehicle meshes and textures |
| `trk_` | Track segment geometry and textures |
| `env_` | Environment elements |
| `ui_` | UI/HUD elements |
| `vfx_` | VFX sprites and geometry |
| `fx_` | Shader/post-processing passes |

**Examples:**
- `veh_hero_body_lod0.glb`
- `veh_hero_albedo_lod0_1k.ktx2`
- `trk_ribbon_segment_std_24m.glb`
- `trk_ribbon_emissive_std_512.ktx2`
- `ui_hud_speedometer_active.png`
- `vfx_boost_trail_64x1.ktx2`
- `fx_bloom_pass_v1.glsl`

---

## §9 — Style Prohibitions

These are not preferences. They are design gate rejections. Any asset, effect, shader, or UI element that exhibits any of the following is returned to the author for revision before it enters the build.

### Explicitly Banned Aesthetic Directions

| Category | Prohibited Elements |
|---|---|
| **Cyberpunk / Synthwave / Retro** | Neon-soaked urban environments; visible city skylines; rain-wet neon reflections on streets; cassette-futurism hardware; pixel-font UI; scanline overlays; CRT vignette effects; 80s grid-horizon floors; purple-pink-teal trio used as a palette in isolation |
| **Grunge / Decay / Industrial** | Rust, dirt, wear, chipped paint, oil stains, cracked concrete, exposed rebar, corroded metal; any surface texture that reads as "broken" or "used" |
| **Children's-Toy Saturation** | HSV saturation > 85 on any non-emissive surface; bright primary colors (red, yellow, green) on vehicle body panels; cartoon outlines; flat color fills on geometry |
| **Visual Clutter** | More than 3 simultaneous particle systems on screen; more than 4 emissive colors visible at once; HUD panels covering more than 8% of viewport area total; animated backgrounds in the menu; floating text labels in the world (diegetic UI is handled by track geometry alone) |

### Specific Tropes to Reject

- **Rain / wet road aesthetic:** The track is in void space. There is no rain. There is no wet tarmac with upward-reflected neon. This is the #1 confounding trope with the banned cyberpunk direction and must be actively resisted.
- **Exhaust / smoke trails:** The boost trail is lime emissive ribbon geometry. It is not smoke. It is not a particle plume. Smoke implies combustion. This is electric, not combustion.
- **Loading spinner animations on the track:** No animated UI geometry embedded in the 3D world. The track rails glow. They do not pulse in loading-spinner patterns.
- **Lens flares:** Three.js `Lensflare` object is prohibited. Bloom from emissive geometry creates all halo/glow effects. Lens flares read as cinematic camera artifacts, which breaks the game's direct-visual register.
- **Star fields / nebula backgrounds:** The void is void. A starfield background turns a premium architectural circuit into a space-sim. These are different games.
- **Animated GIF-style looping motion on UI elements:** Pulsing buttons, bouncing icons, looping animated borders. HUD elements animate only in direct response to game state changes.
- **Gold / bronze / yellow accent colors:** These read as achievement-badge gamification. This game's reward language is lime-green, not trophy-gold.
- **Multiple vehicle types with divergent silhouettes (V1):** Shape differentiation for rivals is prohibited in V1. Only livery color and decal change. Maintain silhouette vocabulary.

---

## §10 — Canon Reference Image Glossary

The following six images from Joey's own render series are the authoritative visual reference for this game. Treat them as equivalent to a moodboard signed off by the creative director.

### `balllab-aether-orb.png`
A translucent holographic sphere containing luminous orbital ring-traces (`blue-core`) and a hot pink/magenta core energy point. Set against absolute void on a glowing cyan disc pedestal. Key qualities to extract:
- Translucency layered with emissive interior — the vehicle canopy glass should have this quality
- The orbital rings are a single-color emissive on void — the track rails replicate this energy
- The magenta core inside blue structure is the exact spatial relationship between gate rings (magenta) and track rails (blue)
- The pedestal is the VFX language of the vehicle hover-emitter ground projection

### `balllab-cyan-vault.png`
A glossy black-chrome sphere split by a precision equatorial chrome band, on a raised cyan glow pedestal. This is the **single closest reference for the hero vehicle body design.** Key qualities:
- The chrome equatorial split = the vehicle's chrome crease line
- The upper hemisphere reads as near-perfect specular highlight = vehicle canopy
- The pedestal glow = hover emitter ground halo, scaled and repurposed
- The satin-to-mirror surface transition = vehicle body to trim material language

### `balllab-01-emerald.png`
A deep emerald glass sphere with rectangular internal refraction patches, on an emissive lime pedestal. The interior luminescence — refracted rectangular forms floating inside transparent geometry — informs the vehicle canopy interior treatment and any glass geometry in the game.

### `pinterest_dotted_led_globe_v1_preview.png`
A sphere surfaced entirely with LED dot-matrix elements. White-grey dots on near-black; right-side highlight radiates blue-white. Key qualities:
- Dot-matrix surface pattern = the track deck's iridescent dot-grid inlay material
- Spacing, scale, and perspective-foreshortening of dots = texture tile specifications
- The single blue-white highlight on dark = the way a single track section lit from inside reads against void

### `golf-v1-live-B-animated.png` (VanguardGolfSDF series)
An emissive lime SDF displacement terrain with VanguardNoise-driven ripple, Fresnel edge highlight, and layered emissive glass-grass material. The living, flowing quality of this surface is the direct reference for the energy field underlayer beneath boost pads and the lime energy field motif used in boost-state VFX and the finish line.

### `iridescent_dotted_wave_preview_v2.png0001.png`
A regular blue dot-grid field on near-black, deformed by a gentle sinusoidal wave with a single thin emissive line tracing the inflection. This is the direct reference for:
- Track deck surface tile material (normal map derives from this dot-grid)
- The menu environment's breathing floor panel
- The language of "structured precision that carries motion" — this is the visual philosophy in two dimensions

---

## Authoring Status

```
MODE: Solo-review / No interactive gates
AUTHORED BY: Art Director agent (Midnight Rocket Racer)
DATE: 2026-08-03
STATUS: v1.0 COMPLETE — all 9 sections authored + Canon Reference Glossary
NEXT REVIEW: Creative Director alignment pass before Technical Artist handoff
OPEN ITEMS: Font licensing confirmation for Orbitron + DM Mono (both open-source / OFL)
```
