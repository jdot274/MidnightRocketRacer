# Agent report — read only analysis task on joey s machine

**Subagent transcript:** `docs/agent-transcripts/subagent-7a51ff76-fff8-4d4d-a265-b855de63adc8.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 10:00 PM (UTC-4)</timestamp>
<user_query>
Read-only analysis task on Joey's machine (Windows). Do NOT modify any files.

Context: We are building "Midnight Rocket Racer", a moody black-sky neon arcade racer in Three.js. We want to reuse Joey's existing GLSL shader work as the material palette.

Sources to analyze:
1. C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\legacy_engines.v6.js — contains window.REFRACT_LEGACY, an array of named GLSL fragment shader engines (~23 shaders, names like "Gemini Magenta Orb", "Liquid v8", "Solstice Field", etc.). Each entry has a name and fragment shader source.
2. C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\REFRACT_ANIMATED_SHOWCASE.html — has a SPECS object with additional face shaders and a buildFaceShader function; note what uniforms the shaders expect (time, resolution, etc.).

Deliver in your final response:
- The exact list of shader names found in legacy_engines.v6.js (all of them) and in SPECS.
- The common uniform/varying contract (e.g. uTime/iTime, vUv, resolution) so we can wrap them in Three.js ShaderMaterial without modification.
- A mapping recommendation: which 3 shaders best suit (a) track/boost-pad surfaces, (b) sky/backdrop energy, (c) car paint/boost glow — favoring moody dark iridescent/neon looks (electric blue, magenta, acid lime on black).
- For the single best boost-pad shader, include its full GLSL fragment source in a code block so it can be dropped into the racer.
Keep the response focused and structured; no file edits.
</user_query>

## Final answer

Analysis complete — no files were modified. One correction to the brief up front: `legacy_engines.v6.js` contains **74 engines, not ~23** (the "23" comment in the HTML refers to the older `legacy_engines.v1.js` it actually loads). There is also no "Liquid v8" — the versions present are Liquid v3 and Liquid v7.

## 1. Shader names in `legacy_engines.v6.js` (all 74, in file order)

Each entry has `name`, `type` (`points` / `lines` / `screen` / special), `src`, `vert`, `frag`, and (later entries) a `def` object with default `m/f/h` values.

**Points fields (vertex-displaced particle spheres):** Solstice Field, Orchid Field, Sakura Field, Verdant Field, Gold Field, Mono Field, Nocturne Field, Bloom Field

**Screen raymarch "Liquid" family:** Tidal Liquid, Ember Liquid, Ice Liquid, Magma Liquid, Solstice Liquid, Sakura Liquid

**Versioned engines:** Strings v3 (lines), Liquid v3 (screen), Matrix v3 (points), Strings v7 (lines), Liquid v7 (screen), Matrix v7 (points)

**Special types:** Neural Wave — Glass Mesh (`glass_mesh`), Neural Wave — Live Material (`live_wave`), USD BSDF Sphere (`raymarch_pbr`)

**Orbs:** Gemini Magenta Orb (Original) (points), Gemini Magenta Orb (points), Purple Orb Reference (screen), Field Volume v2 (screen)

**"· Legend" screen shaders and next-registry-v2 set:** Smoke · Legend, Caustics · Legend, Galaxy Spiral · Legend, Neon Torus · Legend, Fractal Zoom · Legend, Silk Drape · Legend, Prism Split · Legend, Heartbeat, Liquid Mercury · Legend, Fireflies, Stained Glass, Lava Lamp, Sound Bars, Origami, Holographic Foil, Zen Sand, Solar Corona, Nebula Drift · Legend, Obsidian · Legend, Voronoi Cells, Gyroid, Phantom Ink, Moire Interference, Bismuth, Chronos Rings, Liquid Chrome · Legend, Aurora Veil · Legend, Crystalline · Legend, Curl Flow (points), Topographic, Plasma Core · Legend, Halftone

**"· Legend" duplicates of the fields/liquids (with `def` blocks):** Solstice Field · Legend, Orchid Field · Legend, Sakura Field · Legend, Verdant Field · Legend, Gold Field · Legend, Mono Field · Legend, Nocturne Field · Legend, Bloom Field · Legend, Tidal Liquid · Legend, Ember Liquid · Legend, Ice Liquid · Legend, Magma Liquid · Legend, Solstice Liquid · Legend, Sakura Liquid · Legend

**Final entry:** Liquid Metaball (Claude) (screen)

## 2. SPECS names in `REFRACT_ANIMATED_SHOWCASE.html` (62 keys)

SPECS entries are *not* individual shaders — they are 11-number parameter presets fed into one shared master fragment shader (`FRAG2`): `[uM1, uM2, uMix, uSym, uScale, uDens, uWarp, uSpd, uTwist, uSeed, uSpec]`.

Solstice Field, Orchid Field, Sakura Field, Verdant Field, Gold Field, Mono Field, Nocturne Field, Bloom Field, Liquid Mercury, Liquid Chrome, Aether Flow, Plasma Core, Molten Glass, Magma Chamber, Volcanic Ash, Obsidian, Igneous, Nebula Drift, Cloud Chamber, Aurora Veil, Mist, Deep Field, Cloud Volume, Density Map, Digital Rain, Grid Logic, Neural Net, Circuit, Vibration, Harmonic, Waveform, Frequency, Smoke, Caustics, Galaxy Spiral, Neon Torus, Fractal Zoom, Silk Drape, Prism Split, Aurum Sphere, Midas, Royal Gold, Champagne, Gilded Lattice, Aurum Weave, Filigree, Byzantine, Topograph, Isoline, Relief, Starfield Drift, Depth Field, Orbit Layers, Void Depth, Corona, Totality, Annular, Diamond Ring, Diamond Dust, Frost Glint, Stardust, Crystalline

`specFor(name)` also hash-generates a deterministic preset for any unknown name, so the SPECS system accepts arbitrary names.

## 3. Uniform / varying contract

**Legacy engines (all 74):** the showcase drives every engine with this exact uniform set, updated per frame:

```600:607:C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\REFRACT_ANIMATED_SHOWCASE.html
  sharedUniforms = {
    uTime:       { value: 0 },
    uMorph:      { value: 0.55 },
    uFlow:       { value: 0.68 },
    uHeat:       { value: 0.62 },
    uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
    uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
  };
```

- `uTime` — seconds (elapsed clock time). `uMorph`, `uFlow`, `uHeat` — 0–1 "mood" scalars (the showcase breathes them with slow sines; in the racer you can drive `uHeat` from boost energy and `uFlow` from speed). `uPixelRatio` — used by `points` shaders for `gl_PointSize`. `uResolution` — vec2, only genuinely used by Liquid v3/v7 for aspect correction (the Liquid family oddly declares `uniform float uTime,uMorph,uFlow,uHeat,uResolution; uniform vec2 uRes;` but never reads either resolution uniform, so this is harmless).
- `screen` shaders: varying `vec2 vUv`, vertex is `varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.0);}` — note this writes **clip space** directly. To put these fragments on 3D track/pad/car geometry, swap in a standard vertex shader (`gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);` keeping `vUv = uv;`). **The fragment shaders need zero modification** — they only read `vUv` + uniforms.
- `points`/`lines` shaders: use built-in `position`/`normal` attributes (the showcase feeds a fibonacci sphere with a `pIndex` attribute) and pass varyings like `vT`, `vF`, `vD` (or `vPosition`, `vNoise`) between their paired vert/frag. Use `AdditiveBlending`, `depthWrite:false`, `transparent:true`.
- One outlier: `Liquid Metaball (Claude)` also needs `uCold` and `uHot` (vec3 colors).

**SPECS master shader (`FRAG2`):** uniforms `t` (time s), `m`, `f`, `h` (morph/flow/heat), `dpr`, `energy`, `uShape` (0 = circular mask+discard, 1 = rounded rect), `c1`/`c2` (vec3 palette), `uPar` (vec2 parallax), `uM1`/`uM2` (int pattern modes 0–13), plus floats `uMix, uSym, uScale, uDens, uWarp, uSpd, uTwist, uSeed, uSpec`; varying `vUv` from the same clip-space `VERT2D`. `makeUniforms2()` + `writeSpec2(u, name)` in the HTML are directly reusable helpers. Beware the circle/rect `discard` mask if you want a full-quad surface — set `uShape` to 1 or strip the mask.

## 4. Mapping recommendation for Midnight Rocket Racer

| Role | Shader | Why |
|---|---|---|
| (a) Track / boost pads | **Plasma Core · Legend** (pads), Topographic (track ribbon) | Plasma Core is a pulsing electric ring of fbm lightning arcs, electric violet `(0.6,0.1,1.0)` → cyan `(0.2,0.8,1.0)` on pure black with a throbbing core — it reads instantly as "drive over me" and `uHeat` scales its intensity for armed/spent states. Topographic gives acid-lime `(0.2,1.0,0.6)` animated isolines on near-black for the track surface itself. |
| (b) Sky / backdrop energy | **Nebula Drift · Legend** | Domain-warped fbm gas in deep violet `(0.06,0,0.16)` → magenta `(0.6,0.15,0.85)` → electric blue `(0.15,0.5,0.95)` with twinkling stars, all fading to black — exactly the moody black-sky palette. Screen-type quad works as a skydome material or fullscreen background pass. |
| (c) Car paint / boost glow | **Holographic Foil** (paint), Gemini Magenta Orb (boost trail) | Holographic Foil is a cos-palette iridescent shimmer driven by fbm + view sweep — a dark iridescent wrap look; multiply it into a `MeshPhysicalMaterial` emissive or use as onBeforeCompile overlay. Gemini Magenta Orb (points type) makes a ready-made magenta boost/exhaust particle burst, with `uHeat` as the throttle. |

## 5. Best boost-pad shader — full fragment source

`Plasma Core · Legend` (`type: "screen"`, from `legacy_engines.v6.js`). Uniforms: `uTime`, `uMorph` (unused here, safe to keep), `uFlow` (arc speed), `uHeat` (glow intensity — drive from pad state). Pair with a standard projected vertex shader passing `vUv`, `transparent: true`, additive blending recommended on a flat quad pad:

```glsl
vec3 h3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.0+2.0*fract(sin(p)*43758.5453);}
float gn(vec3 p){vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.0-2.0*f);
return mix(mix(mix(dot(h3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*gn(p);p=p*2.03+vec3(7.0);a*=0.5;}return s;}
float sdSph(vec3 p,float r){return length(p)-r;}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,s,0.,1.,0.,-s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);}
uniform float uTime,uMorph,uFlow,uHeat;varying vec2 vUv;
void main(){vec2 uv=vUv*2.0-1.0;vec3 col=vec3(0.);
float r=length(uv);float ang=atan(uv.y,uv.x);float arc=fbm(vec3(ang*2.0,r*4.0,uTime*(1.0+uFlow*2.0)));
float bolt=smoothstep(0.35,0.0,abs(r-0.5-arc*0.25));vec3 c=mix(vec3(0.6,0.1,1.0),vec3(0.2,0.8,1.0),arc);
col+=bolt*c*(1.5+uHeat*1.5);col+=smoothstep(0.25,0.0,r)*vec3(0.7,0.5,1.0)*(0.5+0.5*sin(uTime*3.0));
gl_FragColor=vec4(col,(col.r+col.g+col.b)>0.0?1.0:0.0);}
```

Integration notes: alpha is 0 wherever the shader emits nothing, so pads composite cleanly over the black track; the `sdSph`/`rotY`/`rotX` helpers are declared but unused in this fragment (dead code, harmless). The only edit needed to use it in the racer is supplying your own vertex shader — the fragment drops in as-is.
