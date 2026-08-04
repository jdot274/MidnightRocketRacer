# Agent report: read only harvest task on joey

- **Agent id:** `460869da-66f0-4290-9505-e22c4912c431`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/460869da-66f0-4290-9505-e22c4912c431.jsonl`

## Task brief

<user_query>
Read-only harvest task on Joey's Windows machine. Do NOT modify or move any files.

Goal: Find Joey's Vanguard golf / SDF / wave GLSL work for reuse as track materials in a Three.js neon arcade racer ("Midnight Rocket Racer", moody black sky, electric blue/magenta/acid lime neon).

Search these locations for GLSL/WebGL shader source (fragment shaders, SDF raymarching, uber shaders, "VanguardNoise", "VanguardUber", fresnel/gradient/emissive/ripple layers, grass ripple, glass fairway):
- C:\Users\joeyw\Developer (especially vanguard-golf-hole-portal-v1 and -v2, Vanguard-Creator-Platform, BASIS)
- C:\Users\joeyw\Documents\vanguard-golf and C:\Users\joeyw\Documents\Projects
- C:\Users\joeyw\.codex\skills\gl-shader-studio-master
- C:\Users\joeyw\Desktop (html files containing "Vanguard" or "Golf")
- Home-dir loose files like C:\Users\joeyw\golf-v1-live-*.png indicate an app titled "VanguardGolfSDF - v1" with sliders Morph/Flow/Heat/Glass — find the HTML/JS implementing it.

Deliver in final response:
1. Exact file paths of every real GLSL/shader source found (not just screenshots).
2. For the best "VanguardUber"/golf SDF shader: the full fragment shader source in a code block, plus its uniform contract.
3. Short assessment: which pieces suit a racer track surface, terrain glow, and boost trail.
No file edits.
</user_query>

## Final report

Harvest complete — no files were touched. The "VanguardGolfSDF - v1" app from the screenshots was located, along with its whole version lineage and the newest, best shader.

## 1. Real GLSL/shader source files found

**The golf SDF raymarcher (VanguardNoise + VanguardUber contracts):**

| Path | What it is |
|---|---|
| `C:\Users\joeyw\Documents\vanguard-golf\game\index.html` | **Best/latest.** "Vanguard Golf · v2" playable game; full WebGL2 raymarched SDF course fragment shader (lines 480–787), based on the deployed `vanguard-golf-sdf-v5` master |
| `C:\Users\joeyw\Documents\vanguard-golf\public\index.html` | Byte-identical deploy copy of the above (verified with a binary compare) |
| `C:\Users\joeyw\Documents\Cursor-Agent-Pipeline\runtime\vanguard-golf-sdf-v1\index.html` | **This is the app in the `golf-v1-live-*.png` screenshots** — title "Relay · VanguardGolfSDF_v1", Morph/Flow/Heat/Glass sliders, layered grass + glass fairway |
| `C:\Users\joeyw\Documents\Cursor-Agent-Pipeline\runtime\vanguard-golf-sdf-v2\index.html` | v2 iteration (heavily commented "verbatim math" port of VanguardNoise.hlsl) |
| `C:\Users\joeyw\Documents\Cursor-Agent-Pipeline\runtime\vanguard-golf-sdf-v4\index.html` | v4 iteration (still titled v2 internally) |
| `C:\Users\joeyw\Documents\Cursor-Agent-Pipeline\runtime\vanguard-golf-sdf-v5\index.html` | v5 — the deployed master the game was built from |
| `C:\Users\joeyw\Documents\Cursor-Agent-Pipeline\deploy\vanguard-golf-sdf-v1\index.html` and `...\deploy\vanguard-golf-sdf-v5\index.html` | Vercel deploy folders for v1 and v5 |

**Supporting shader libraries:**

- `C:\Users\joeyw\Documents\vanguard-golf\ball-lab\src\balls\shaderLib.js` — Vanguard GLSL chunk library for Three.js: `vHash/vNoise3/vFbm3/vVoronoi3`, iq cosine palette, golf-ball dimple normal perturbation, automotive-flake glint BRDF, sphere-chord interior raymarch, and ready-made CSM/ShaderMaterial varying blocks. The ball material shaders composing these live in `presets.jsx`, `aether.jsx`, `vault.jsx`, `collage.jsx` in the same folder.
- `C:\Users\joeyw\Developer\BASIS-subrepos\basis-lib-shaders\glsl\` — standalone reusable GLSL library: `sdf\primitives.glsl`, `sdf\operations.glsl`, `noise\{perlin,simplex,value,worley}.glsl`, `color.glsl`, `lighting.glsl`, `math.glsl`, `post.glsl`.
- `C:\Users\joeyw\Developer\joeyw-agent-rules\wiki\scoring\golf-hole-shader.glsl` — Shadertoy-style concentric funnel/"vinyl void" raymarch with cyan fresnel rim, transmission glow, and film grain.
- `C:\Users\joeyw\.codex\skills\gl-shader-studio-master\assets\starter-shader\main.frag` (+ `uniforms.json`) — simple looping dual soft-wave glow shader.

**Notable non-shader finds:** `C:\Users\joeyw\Developer\vanguard-golf-hole-portal-v1\src\engine\graphicsUber.ts` is the "Graphics - Vanguard Uber" Morph/Flow/Heat/Glass slider HUD (TypeScript UI panel, persisted to localStorage) — the portal v1/v2 repos contain **no GLSL**, only engine/HUD scaffolding. The original `VanguardNoise.hlsl` / VanguardUber HLSL files are **not on disk anywhere I searched** — only the GLSL ports survive, and the v2 iteration claims a verbatim math port. `Developer\Vanguard-Creator-Platform` is an empty directory, and no top-level Desktop HTML contains real Vanguard shader source.

## 2. The best VanguardUber/golf SDF fragment shader

From `C:\Users\joeyw\Documents\vanguard-golf\game\index.html` (the `FS` constant, WebGL2 / GLSL ES 3.00):

```glsl
#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uMorph;
uniform float uFlow;
uniform float uHeat;
uniform float uGlass;
uniform vec2  uPointer;   // NDC [-1,1]
uniform vec3  uCamPos;
uniform vec3  uCamTa;
uniform vec2  uSeed;      // per-hole FBM offset
uniform float uAmp;       // per-hole hill amplitude scale
uniform vec3  uAccent;    // per-hole neon accent
uniform vec3  uBallTint;  // player ball color from Ball Lab
uniform vec2  uCup;       // pin position (xz)
uniform vec2  uTee;       // tee position (xz)
uniform vec3  uBall;      // ball centre (y < -50 hides)
uniform vec2  uAim;       // normalized aim dir (xz)
uniform float uAimLen;    // guide length (0 hides)
uniform float uCharge;    // 0..1 swing charge (ball glow)

// ── VanguardNoise (GLSL port of VanguardNoise.hlsl) ──────────
float Vanguard_Hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 Vanguard_Hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float Vanguard_ValueNoise(vec2 uv) {
  vec2 i = floor(uv), f = fract(uv);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = Vanguard_Hash21(i);
  float b = Vanguard_Hash21(i + vec2(1,0));
  float c = Vanguard_Hash21(i + vec2(0,1));
  float d = Vanguard_Hash21(i + vec2(1,1));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float Vanguard_FBM(vec2 uv, int octaves) {
  float value = 0.0, amplitude = 0.5, frequency = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    value += amplitude * Vanguard_ValueNoise(uv * frequency);
    amplitude *= 0.5; frequency *= 2.0;
  }
  return value;
}
vec2 Vanguard_Voronoi(vec2 uv) {
  vec2 i = floor(uv), f = fract(uv);
  float F1 = 8.0, F2 = 8.0;
  for (int y = -2; y <= 2; y++)
  for (int x = -2; x <= 2; x++) {
    vec2 cell = vec2(float(x), float(y));
    vec2 jitter = Vanguard_Hash22(i + cell);
    vec2 delta = cell + jitter - f;
    float d = dot(delta, delta);
    if (d < F1) { F2 = F1; F1 = d; }
    else if (d < F2) F2 = d;
  }
  return vec2(sqrt(F1), sqrt(F2));
}

// ── Golf course SDF (layered, per-hole parametric) ───────────
float terrainH(vec2 xz) {
  vec2 q = xz + uSeed;
  float hills = Vanguard_FBM(q * 0.085, 5);
  float ridges = Vanguard_FBM(q * 0.22 + 17.0, 3);
  float amp = mix(0.55, 2.35, uMorph) * uAmp;
  return hills * amp + ridges * amp * 0.35 - 0.15;
}
float greenDip(vec2 xz) {
  float g = length(xz - uCup);
  return smoothstep(3.2, 1.1, g) * 0.55;
}
float groundY(vec2 xz) { return terrainH(xz) - greenDip(xz); }

float sdSeg2(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
float fairwayMask(vec2 xz) {
  return smoothstep(3.6, 1.3, sdSeg2(xz, uTee, uCup));
}

float sdTerrain(vec3 p) {
  float gy = groundY(p.xz);
  float cup = length(vec2(length(p.xz - uCup), p.y - (gy - 0.08))) - 0.07;
  float ground = p.y - gy;
  return min(ground, cup);
}

// Layered grass shell — Voronoi blades as thin SDF layer above terrain
float sdGrassLayer(vec3 p, float layer) {
  float h = terrainH(p.xz);
  float g = length(p.xz - uCup);
  float onGreen = smoothstep(2.4, 1.0, g);
  float fair = fairwayMask(p.xz);
  float blade = Vanguard_Voronoi(p.xz * mix(9.0, 16.0, layer) + vec2(layer * 3.1, uTime * uFlow * (0.4 + layer))).x;
  // flatten a lie around the ball so it never drowns in the shell
  float nearBall = uBall.y > -50.0 ? smoothstep(0.22, 0.6, length(p.xz - uBall.xz)) : 1.0;
  float height = mix(0.18, 0.42, layer) * (1.0 - onGreen * 0.85) * (1.0 - fair * 0.55)
               * mix(0.22, 1.0, nearBall) * (0.55 + uMorph * 0.45);
  float wind = sin(p.x * 2.4 + p.z * 1.7 + uTime * (1.2 + uFlow * 3.0) + layer * 2.0) * 0.04 * uFlow;
  float top = h + height + wind - onGreen * 0.4;
  float d = p.y - top;
  float shell = abs(d) - mix(0.012, 0.028, blade);
  return mix(shell, 1e3, onGreen);
}

// Glass fairway sheet — refractive layer along the tee→cup corridor
float sdGlassFairway(vec3 p) {
  float h = terrainH(p.xz);
  float fair = fairwayMask(p.xz);
  float sheet = abs(p.y - (h + 0.03)) - 0.01;
  return mix(1e3, sheet, fair * (0.35 + uGlass * 0.65));
}

float sdBall(vec3 p) {
  if (uBall.y < -50.0) return 1e3;
  return length(p - uBall) - 0.13; // keep in sync with PHYS.ballRadius
}
float sdPole(vec3 p) {
  float gy = groundY(uCup);
  vec3 q = p - vec3(uCup.x, gy, uCup.y);
  q.y -= clamp(q.y, 0.0, 1.75);
  return length(q) - 0.028;
}
float sdFlag(vec3 p) {
  float gy = groundY(uCup);
  vec3 q = p - vec3(uCup.x, gy + 1.52, uCup.y);
  float wave = sin(uTime * 2.6 + q.x * 5.0) * 0.05 * clamp(q.x / 0.5, 0.0, 1.0);
  q.z -= wave;
  // tapered banner 0..0.55 along +x (rounded-box SDF, height shrinks with x)
  float tx = clamp(q.x / 0.55, 0.0, 1.0);
  float halfH = mix(0.15, 0.025, tx);
  vec3 b = vec3(0.275, halfH, 0.008);
  vec3 d = abs(vec3(q.x - 0.275, q.y, q.z)) - b;
  return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0) - 0.004;
}

vec2 opU(vec2 a, vec2 b) { return a.x < b.x ? a : b; }
// material ids: 0 turf · 1 glass fairway · 2 ball · 3 pole · 4 flag
vec2 mapScene(vec3 p) {
  vec2 r = vec2(sdTerrain(p), 0.0);
  r = opU(r, vec2(sdGrassLayer(p, 0.0), 0.0));
  r = opU(r, vec2(sdGrassLayer(p, 0.45), 0.0));
  r = opU(r, vec2(sdGrassLayer(p, 0.85), 0.0));
  r = opU(r, vec2(sdGlassFairway(p), 1.0));
  r = opU(r, vec2(sdBall(p), 2.0));
  r = opU(r, vec2(sdPole(p), 3.0));
  r = opU(r, vec2(sdFlag(p), 4.0));
  return r;
}
float mapD(vec3 p) { return mapScene(p).x; }

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0025, 0.0);
  return normalize(vec3(
    mapD(p + e.xyy) - mapD(p - e.xyy),
    mapD(p + e.yxy) - mapD(p - e.yxy),
    mapD(p + e.yyx) - mapD(p - e.yyx)));
}

// VanguardUber-style gradient (accent-driven)
vec3 applyGradient(vec3 base, vec2 uv) {
  float ang = 55.0 * 0.017453292;
  vec2 dir = vec2(cos(ang), sin(ang));
  float t = clamp(dot(uv - 0.5, dir) + 0.5, 0.0, 1.0);
  vec3 a = vec3(0.015, 0.18, 0.05);
  vec3 b = uAccent;
  return mix(base, base * mix(a, b, t) * 1.9, 0.80);
}
// VanguardUber-style fresnel glass
vec3 applyFresnel(vec3 base, vec3 n, vec3 v) {
  float ndv = clamp(1.0 - dot(n, v), 0.0, 1.0);
  float fres = pow(ndv, mix(1.4, 3.2, uGlass)) * (0.35 + uGlass * 1.4);
  vec3 glassCol = mix(vec3(0.55, 1.0, 0.75), uAccent, 0.4);
  return base + glassCol * fres * uGlass;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uResolution) / uResolution.y;

  vec3 ro = uCamPos;
  vec3 ta = uCamTa;
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0,1,0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.55);

  // pointer-driven grass ripple (Uber ripple contract)
  float ripple = 0.0;
  if (length(uPointer) > 0.01) {
    vec2 hitXZ = ro.xz + rd.xz * ((0.8 - ro.y) / max(rd.y, 0.02));
    float dist = length(hitXZ - uPointer * 8.0);
    ripple = exp(-dist * 0.55) * sin(dist * 14.0 - uTime * 5.0) * 0.08;
  }

  float t = 0.0;
  bool hit = false;
  float mat = 0.0;
  vec3 pos;
  for (int i = 0; i < 96; i++) {
    pos = ro + rd * t;
    pos.y += ripple * 0.35;
    vec2 dm = mapScene(pos);
    if (dm.x < 0.0015) { hit = true; mat = dm.y; break; }
    t += dm.x * 0.85;
    if (t > 55.0) break;
  }

  // high black sky with accent horizon glow (v3 lineage: elegant fog)
  vec3 skyLight = normalize(vec3(0.45, 0.85, 0.35));
  vec3 col = mix(vec3(0.006, 0.016, 0.010), vec3(0.014, 0.05, 0.026), clamp(uv.y + 0.5, 0.0, 1.0));
  col += uAccent * 0.10 * (0.15 + uHeat * 0.25) * (1.0 - exp(-length(uv) * 0.4));
  col += uAccent * pow(clamp(dot(rd, skyLight), 0.0, 1.0), 9.0) * 0.14;
  float horizon = pow(clamp(1.0 - abs(rd.y * 3.2), 0.0, 1.0), 3.0);
  col += uAccent * horizon * (0.05 + uHeat * 0.05);

  if (hit) {
    vec3 n = calcNormal(pos);
    vec3 v = normalize(-rd);
    vec3 light = normalize(vec3(0.45, 0.85, 0.35));
    float diff = clamp(dot(n, light), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-light, n), v), 0.0, 1.0), mix(16.0, 64.0, uGlass));
    vec3 neon = uAccent;

    if (mat < 1.5) {
      // turf / glass fairway
      float h = terrainH(pos.xz);
      float grassAmt = smoothstep(0.02, 0.22, pos.y - h);
      float g = length(pos.xz - uCup);
      float onGreen = smoothstep(2.6, 1.0, g);
      float fair = fairwayMask(pos.xz);

      vec3 turf = vec3(0.04, 0.28, 0.08);
      vec3 greenPad = vec3(0.08, 0.55, 0.22);
      vec3 albedo = mix(turf, neon, grassAmt * (0.35 + uHeat * 0.65));
      albedo = mix(albedo, greenPad, onGreen * 0.85);
      albedo = mix(albedo, albedo * 1.4 + neon * 0.06, fair * (1.0 - onGreen) * 0.55);
      albedo = applyGradient(albedo, pos.xz * 0.05 + 0.5);

      col = albedo * (0.10 + diff * 0.92);
      col += neon * spec * (0.15 + uGlass * 0.55 + uHeat * 0.35);
      col = applyFresnel(col, n, v);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + pos.x * 0.4);
      col += neon * uHeat * pulse * grassAmt * 0.18;

      // cup ring beacon
      float ring = smoothstep(0.16, 0.10, abs(g - 0.16));
      col += neon * ring * (0.8 + 0.5 * sin(uTime * 3.0)) * onGreen;

      // aim guide — dashed accent line from ball along aim
      if (uAimLen > 0.01 && uBall.y > -50.0) {
        vec2 rel = pos.xz - uBall.xz;
        float along = dot(rel, uAim);
        float perp = abs(dot(rel, vec2(-uAim.y, uAim.x)));
        if (along > 0.30 && along < uAimLen && perp < 0.065) {
          float dash = step(0.45, fract(along * 1.5 - uTime * 1.6));
          float fade = 1.0 - along / uAimLen;
          col = mix(col, neon * 2.4, dash * (0.35 + 0.55 * fade));
        }
      }

      // soft ball contact shadow
      if (uBall.y > -50.0) {
        float sh = smoothstep(0.5, 0.12, length(pos.xz - uBall.xz))
                 * smoothstep(-0.1, 0.4, uBall.y - pos.y) * 0.55;
        col *= 1.0 - sh;
      }
    } else if (mat < 2.5) {
      // ball — tinted from Ball Lab selection + charge glow
      vec3 albedo = mix(vec3(0.90, 0.95, 0.92), uBallTint, 0.72);
      col = albedo * (0.28 + diff * 0.78);
      col += vec3(1.0) * pow(clamp(dot(reflect(-light, n), v), 0.0, 1.0), 90.0) * 0.85;
      float rim = pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 2.2);
      col += mix(neon, uBallTint, 0.6) * rim * (0.4 + uCharge * 1.6);
      col += uBallTint * uCharge * 0.4;
    } else if (mat < 3.5) {
      // flag pole — dark satin metal
      col = vec3(0.05, 0.07, 0.06) * (0.4 + diff * 0.6);
      col += vec3(0.9) * spec * 0.5;
      col = applyFresnel(col, n, v);
    } else {
      // flag — emissive accent banner
      float pulse = 0.75 + 0.25 * sin(uTime * 2.6);
      col = neon * (0.55 + diff * 0.45) * 1.6 * pulse;
      col += vec3(1.0) * spec * 0.25;
    }

    float fog = 1.0 - exp(-t * 0.042);
    col = mix(col, vec3(0.012, 0.045, 0.026) + uAccent * 0.02, fog);
  }

  col *= 1.0 - 0.22 * dot(uv, uv);
  // filmic highlight roll-off — keeps neon identity, kills flat clipping
  col = 1.0 - exp(-max(col, 0.0) * 1.45);
  col = pow(col, vec3(0.92));
  fragColor = vec4(col, 1.0);
}
```

**Uniform contract** (vertex stage is a fullscreen triangle from `gl_VertexID`; no attributes needed):

| Uniform | Type | Meaning / range |
|---|---|---|
| `uResolution` | vec2 | Canvas size in pixels |
| `uTime` | float | Seconds |
| `uMorph` | float 0–1 | Terrain drama: hill amplitude (0.55→2.35×) + grass shell height |
| `uFlow` | float 0–1 | Animation energy: grass wind speed and blade scroll |
| `uHeat` | float 0–1 | Emissive intensity: neon grass tips, horizon glow, pulse |
| `uGlass` | float 0–1 | Glassiness: fresnel power/strength, specular tightness, glass-sheet presence |
| `uPointer` | vec2 | NDC [-1,1] pointer; drives the exponential ripple wave |
| `uCamPos`, `uCamTa` | vec3 | Ray origin and look-at target |
| `uSeed` | vec2 | Per-level FBM offset (reshapes terrain) |
| `uAmp` | float | Per-level hill amplitude multiplier |
| `uAccent` | vec3 | The neon accent color driving gradient, fresnel, emissive, sky |
| `uBallTint`, `uBall`, `uCup`, `uTee`, `uAim`, `uAimLen`, `uCharge` | mixed | Golf gameplay-specific (ball, pin, tee, aim guide, swing charge) |

Slider defaults from `graphicsUber.ts`: morph 0.5, flow 0.56, heat 0.35, glass 0.84.

## 3. Fit for Midnight Rocket Racer

- **Track surface:** the strongest direct lift is the trio `fairwayMask` (segment-SDF corridor) + `applyGradient` + `applyFresnel`. Replace the tee→cup segment with your track spline's polyline and you get a glowing glass racing ribbon over dark terrain for free; `uGlass` already controls fresnel power, spec tightness, and sheet opacity in one knob. Swap `uAccent` per track section for the blue/magenta/lime palette. This works as either a raymarched ground plane or, more practically for a mesh-based Three.js racer, by porting `fairwayMask`/gradient/fresnel/emissive into a `ShaderMaterial` on the track mesh (the ball-lab `shaderLib.js` chunks plus `RAW_VERT` are purpose-built for exactly that composition style).
- **Terrain glow:** `terrainH` (VanguardNoise FBM) plus the turf shading block — `albedo` mixed toward neon by height, `uHeat`-driven pulse, and the black sky with accent horizon glow — is already "moody black sky with electric terrain." The fog tint toward `uAccent` and the filmic `1-exp` tonemap at the end are worth keeping verbatim; they're what keep the neon from clipping flat.
- **Boost trail:** two good donors. The dashed aim-guide block (dash/fade math along `uAim`) is a ready-made animated boost stripe — parameterize `along` by distance behind the car. The cup-ring beacon plus the pointer ripple (`exp(-dist)·sin(dist·14 − t·5)`) make a great boost-pad shockwave. For particle-y sparkle on the trail, `GLINT_GLSL` in `shaderLib.js` (twinkling flake specular) drops straight in.
- Also useful: `golf-hole-shader.glsl` (concentric ridged funnel with fresnel rim) would make a striking portal/finish-gate effect, and the BASIS `sdf` + `noise` GLSL library covers any extra primitives you need without hand-rolling.

One gap to note: the original `VanguardNoise.hlsl` / VanguardUber HLSL files do not exist on this machine — the GLSL ports in the files above are the canonical surviving source (v2's port is annotated "verbatim math").
