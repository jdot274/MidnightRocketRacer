# Agent report — read only harvest task on joey s windows

**Subagent transcript:** `docs/agent-transcripts/subagent-5c65c203-a919-43dd-8f4e-a4f32b519263.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 10:02 PM (UTC-4)</timestamp>
<user_query>
Read-only harvest task on Joey's Windows machine. Do NOT modify or move any files, do NOT open Blender.

Goal: Extract the visual recipe (colors, material parameters, procedural logic) from Joey's Blender/Python iridescent-dotted-wave and LED-board work so we can recreate those looks as GLSL/Three.js materials in "Midnight Rocket Racer" (moody black-sky neon racer).

Sources (home dir C:\Users\joeyw):
- iridescent_dotted_wave_setup.py (the authoritative procedural recipe - read fully)
- create_pinterest_globe_v1_5_intermediate.py
- start_blendermcp_for_iridescent.py (only if it contains scene parameters)
- iridescent_dotted_wave_open_process_manifest.json
- prepare_interactive_3d_assets.py
- codex_make_spin_playable_v2_20260721.py (only material/color parts)
- Also check C:\Users\joeyw\BlenderProjects and C:\Users\joeyw\Staged_Blends for .py files (do not parse .blend binaries)

Deliver in final response:
1. The exact color values (hex/RGB), emission strengths, dot-grid parameters (spacing, radius, falloff), wave math (frequency, amplitude, direction), and material node logic found in the Python files.
2. A compact GLSL translation plan: pseudocode or actual GLSL for a "dotted iridescent wave" fragment shader matching the recipe (dark background, blue-cyan iridescent dots on wave crests).
3. Any LED-board/radar-scan animation parameters worth reusing for boost pads or track rails.
No file edits.
</user_query>

## Final answer

# Harvest results — iridescent dotted wave + LED globe recipe

## 1. Exact values from the Python files

All colors below are **Blender linear RGB** (authoritative for shader math). Hex values are the approximate sRGB equivalents for reference.

### A. `iridescent_dotted_wave_setup.py` — the authoritative recipe

**Wave math** (Blender coords: x = horizontal, z = along the wave, y = depth/height):

```python
wave_depth(x, z) = 0.62*sin(z*0.92 + sin(x*1.25)*1.35)   # dominant curl, FM-modulated
                 + 0.16*sin(x*2.75 + z*0.32)              # fine cross-ripple
                 + 0.08*cos((x - z)*1.8)                  # diagonal shimmer

highlight_center(z) = 0.95*sin(z*0.62) - 0.24*cos(z*1.55) # serpentine bright ridge path
```

**Dot grid:** 126 cols x 182 rows, `spacing = 0.052`, seed 31. Each dot is a flat 8-segment polygon (an octagon disc), radius `spacing * (0.125 + 0.075*energy + 0.015*rand)` — i.e. 12.5%–21.5% of cell size, energy-driven. Dots are stretched along z by `1.23 + 0.18*sin(z*2 + x)` (elongated ellipses, not circles).

**Color/energy field** (this is the iridescence — gaussian falloffs, not thin-film):

```python
ribbon      = exp(-(x - highlight_center(z))² / 0.105)          # bright serpentine ridge
blue_sweep  = exp(-(x + 0.42*z + 1.70)² / 0.075)                # diagonal cyan streak
lower_glow  = exp(-((x+2.45)²/1.7 + (z+3.55)²/0.72))            # corner hotspot
upper_shadow= 1 - 0.45*exp(-((x-1.9)²/2.2 + (z-3.5)²/1.1))      # dimmed corner
grain       = 0.72 + 0.55*rand                                   # per-dot flicker

energy = min(1, (0.11 + 1.15*ribbon + 0.72*blue_sweep + 1.0*lower_glow) * grain * upper_shadow)
violet = 0.45*ribbon + 0.25*blue_sweep

R = 0.015 + 0.22*violet + 0.05*lower_glow
G = 0.035 + 0.28*energy + 0.12*blue_sweep
B = 0.11  + 1.25*energy + 0.30*ribbon        # blue dominates; each clamped to 1
```

**Materials, lights, post:**

| Element | Linear RGB | ~Hex | Params |
|---|---|---|---|
| Dot emission | vertex color (above) | — | Emission **strength 1.85** |
| Dark backing | (0.002, 0.006, 0.018) | `#0F1929` | Principled, roughness 0.9, metallic 0, offset +0.035 behind dots, follows same wave_depth |
| Blue caustic curve | (0.02, 0.20, 0.85) | `#2B7BED` | Emission 0.55, bevel 0.004, follows `highlight_center(z) - 0.08 + 0.06*sin(3 turns)`, sits 0.035 *below* the dots |
| Key area light | (0.12, 0.34, 1.0) | `#619CFF` | 430 W, size 4 |
| Violet rim point | (0.55, 0.28, 1.0) | `#C28FFF` | 85 W |
| World | pure black | `#000000` | — |
| Post | Filmic + High Contrast, exposure −0.25 | — | Bloom intensity 0.08, radius 6.0; GTAO dist 3.0, factor 1.2 |

### B. `create_pinterest_globe_v1_5_intermediate.py` — the LED-board look

Three emissive dot classes on a black gloss core (Base Color black, roughness 0.56, coat 0.22):

| Dot class | Linear RGB | ~Hex | Emission | Radius (globe r=1.89) |
|---|---|---|---|---|
| Land (lit LEDs) | (0.66, 0.80, 0.98) | `#D3E6FD` | 1.18 | 0.013 |
| Ocean (off LEDs) | (0.032, 0.044, 0.068) | `#353E4B` | **0.12** | 0.0085 |
| Rim edge-glow | (0.10, 0.30, 1.0) | `#5993FF` | **1.38** | 0.010 |

Key LED-board logic: dot brightness/scale falls off with viewing angle — `visibility = max(0, -normal.y)` (facing the camera), `scale = 0.58 + 0.42*visibility`, dots culled below visibility 0.03. Rim dots only spawn in the **0.03 < visibility < 0.16 band** (70% probability) — that's what makes the glowing silhouette edge. Pattern threshold: `score > 0.40 + 0.08*sin(lon*7.4 + lat*3.0)`.

The other listed files contributed nothing visual: `start_blendermcp_for_iridescent.py` is only MCP server boot, the manifest only lists Blender process command lines, and the codex/prepare scripts are pipeline-only.

## 2. GLSL translation plan (Three.js `ShaderMaterial`)

The Blender scene bakes color per-dot into vertex colors on real geometry; in GLSL we compute the same field per-fragment on a plane. Direct translation, animated by scrolling `z` with time:

```glsl
// ===== vertex shader: displace a subdivided plane (x = u, z = v) =====
uniform float uTime;
varying vec2 vP;          // (x, z) in "Blender units" (grid spans ~6.5 x 9.5)
float waveDepth(vec2 p){
  return 0.62*sin(p.y*0.92 + sin(p.x*1.25)*1.35)
       + 0.16*sin(p.x*2.75 + p.y*0.32)
       + 0.08*cos((p.x - p.y)*1.8);
}
void main(){
  vP = position.xz + vec2(0.0, uTime*0.6);          // scroll along the wave
  vec3 pos = vec3(position.x, waveDepth(vP), position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

```glsl
// ===== fragment shader =====
uniform float uTime;
varying vec2 vP;
const float SPACING = 0.052;
const vec3  BG = vec3(0.002, 0.006, 0.018);          // deep blue-black backing

float hash(vec2 c){ return fract(sin(dot(c, vec2(127.1, 311.7)))*43758.5453); }
float highlightCenter(float z){ return 0.95*sin(z*0.62) - 0.24*cos(z*1.55); }

void main(){
  float x = vP.x, z = vP.y;

  // --- energy / iridescence field (verbatim from the Python) ---
  vec2 cell = floor(vP / SPACING);
  float grain = 0.72 + 0.55*hash(cell);
  float ribbon     = exp(-pow(x - highlightCenter(z), 2.0) / 0.105);
  float blueSweep  = exp(-pow(x + 0.42*z + 1.70, 2.0) / 0.075);
  float lowerGlow  = exp(-(pow(x+2.45,2.0)/1.7 + pow(z+3.55,2.0)/0.72));
  float upperShadow= 1.0 - 0.45*exp(-(pow(x-1.9,2.0)/2.2 + pow(z-3.5,2.0)/1.1));
  float energy = min(1.0, (0.11 + 1.15*ribbon + 0.72*blueSweep + 1.0*lowerGlow)
                          * grain * upperShadow);
  float violet = 0.45*ribbon + 0.25*blueSweep;
  vec3 dotCol = min(vec3(1.0), vec3(
      0.015 + 0.22*violet + 0.05*lowerGlow,
      0.035 + 0.28*energy + 0.12*blueSweep,
      0.11  + 1.25*energy + 0.30*ribbon));

  // --- dot mask: z-stretched ellipse in each grid cell ---
  vec2 local = fract(vP / SPACING) - 0.5;              // [-0.5, 0.5] cell coords
  float radius  = 0.125 + 0.075*energy + 0.015*hash(cell + 7.0);  // fraction of cell
  float stretch = 1.23 + 0.18*sin(z*2.0 + x);
  float d = length(vec2(local.x, local.y / stretch));
  float mask = 1.0 - smoothstep(radius, radius + 0.05, d); // soft dot edge

  // --- caustic under-curve: thin glow line tracking the ridge ---
  float cx = highlightCenter(z) - 0.08 + 0.06*sin(z*2.07);
  float caustic = 0.55 * exp(-pow((x - cx)/0.05, 2.0));

  vec3 col = BG + dotCol * 1.85 * mask                  // emission strength 1.85
           + vec3(0.02, 0.20, 0.85) * caustic * (1.0 - mask);
  gl_FragColor = vec4(col, 1.0);
}
```

Renderer side, to match the Blender look: `UnrealBloomPass` (strength ~0.3–0.5, radius ~0.6, threshold ~0.7) stands in for EEVEE bloom 0.08/6.0, ACES/AgX tone mapping with **exposure ~0.84** (= 2^−0.25) stands in for Filmic High Contrast, scene background pure black. For the racer, the gaussian hotspot terms (`lowerGlow`, `upperShadow`) can be re-anchored to the rocket's position instead of fixed corners so the glow travels with the player.

## 3. LED-board parameters worth reusing for boost pads / track rails

- **Rim silhouette band** — spawn/brighten glow dots only where the surface grazes the camera: `0.03 < facing < 0.16`, color `#5993FF` (0.10, 0.30, 1.0), emission 1.38 — that exact band is what reads as a neon edge. Perfect for track rail edges: `float rim = smoothstep(0.03, 0.16, facing) * (1.0 - smoothstep(0.16, 0.30, facing));`
- **On/off LED contrast ratio** — lit dots at emission 1.18 vs unlit dots at 0.12 (roughly 10:1) with the unlit ones still faintly visible (`#353E4B`). Keeping dead LEDs dimly present, not black, is what sells the physical-LED-board feel for a boost pad matrix.
- **Viewing-angle brightness falloff** — dot scale/intensity `0.58 + 0.42 * facing`, culled below 0.03. Cheap directional-LED behavior for rails as the car passes.
- **Radar/scan sweep timing** — the globe spin keys rotate −7° → +13° over frames 1–96 at 24 fps: a **20° sweep over 4 s (5°/s)**, slow and readable. For a boost pad "radar" pulse, sweep a threshold line across the dot grid at that rate and gate the on/off state with the `score > threshold + 0.08*sin(...)` wobble so the edge of the sweep flickers organically.
- **Pattern threshold wobble** — `threshold = 0.40 + 0.08*sin(u*7.4 + v*3.0)` gives irregular, non-mechanical boundaries between lit and unlit regions; reuse for any lit-pattern mask.

No files were edited or moved, and Blender was never opened.
