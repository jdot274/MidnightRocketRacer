# Agent report: author racer art bible

- **Agent id:** `923cc643-ef4b-40de-98fe-c1aa6d76e7c7`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/923cc643-ef4b-40de-98fe-c1aa6d76e7c7.jsonl`

## Task brief

<user_query>
You are the Art Director for "Midnight Rocket Racer" (working title). Author the complete art bible in solo review mode (no interactive gates — decide and write). Create the file at:
C:\Users\joeyw\Projects\MidnightRocketRacer\design\art\art-bible.md
(create directories as needed; this is a new file — do not touch anything else).

Locked creative direction from Joey (authoritative):
- Genre/fantasy: moody, adult, premium arcade rocket racer — "next-gen Hot Wheels x Rocket League" energy, anti-grav hover racing on a sweeping ribbon circuit.
- Aesthetic dictionary: STYLIZED, UNBELIEVABLE-QUALITY FUTURISTIC. Explicitly banned words/directions: "cyberpunk", "synthwave", "retro". Think pristine concept-future: luxury hypercar concept design, wipEout-class racing modernized to 2026 production values, futuristic architecture curves (Zaha Hadid-like), award-winning Spline/ArtStation dark glossy 3D.
- Palette anchors (from Joey's own renders, which you should treat as canon references):
  - Near-black ink base (#05060a) with glossy black-chrome surfaces (#0b0e16)
  - Electric blue (#00a2ff) — primary neon, track rails, HUD
  - Magenta/pink (#ff1f6e) — secondary neon, gates, accents
  - Acid lime (#57ff6b) — boost/energy/success states
  - Iridescent blue-white LED dot-grids on black (Joey's "iridescent dotted wave" and "pinterest dotted LED globe" Blender series)
  - Emissive green SDF terrain glow (Joey's "VanguardGolfSDF" series) — usable as energy-field motif
- Canon reference images on disk (describe their qualities in the bible): C:\Users\joeyw\balllab-aether-orb.png (cyan hologram orb on glowing pedestal, black studio), C:\Users\joeyw\balllab-cyan-vault.png (glossy black-chrome sphere, cyan ring pedestal), C:\Users\joeyw\balllab-01-emerald.png (emerald glass orb), C:\Users\joeyw\pinterest_dotted_led_globe_v1_preview.png (LED dot-matrix sphere, blue on black), C:\Users\joeyw\golf-v1-live-B-animated.png (emissive green SDF terrain), C:\Users\joeyw\iridescent

## Final report

Art bible written to `C:\Users\joeyw\Projects\MidnightRocketRacer\design\art\art-bible.md` — 371 lines, all 9 sections plus a canon reference glossary.

**10-line key decisions summary:**

1. **One-line rule:** "Every frame looks like a luxury hypercar concept render that is also moving at 900 km/h." Anchors all visual decisions.
2. **Palette architecture:** Three semantic roles locked — electric blue `#00a2ff` for track/navigation, magenta `#ff1f6e` for gates/danger, acid lime `#57ff6b` for boost/reward. All built on ink-void `#05060a`. Colorblind safety enforced via shape+position redundancy, not color alone.
3. **Bloom as the glow system:** `UnrealBloomPass` is the sole glow delivery mechanism. Five distinct parameter sets defined per game state (menu → countdown → racing → boost → finish). No point-light scatter fields.
4. **Hero vehicle = balllab-cyan-vault:** Black satin-carbon body, one full-width mirror-chrome crease at 35% height, no visible exhaust or wheels, four hover-emitter pylons as the only customizable visual element. Die-cast luxury concept language throughout.
5. **Track = ribbon in absolute void:** 24m-wide aerospace ribbon, mirror-chrome rails as the primary scene light source, dot-grid deck surface tile from the iridescent wave references. `FogExp2` depth haze only — no particles, no starfield, no skybox.
6. **Floor reflector is a first-class element:** Single `MirrorReflector` at 512×512, blur 0.04, covering visible track deck. Vehicle hover halos, boost trail, and rail emissives must read in the reflection.
7. **VFX is geometry-first, zero idle ambience:** Boost trail = tapering ribbon `BufferGeometry`, not sprites. Gate pulse = `RingGeometry` radial scale. Pickup burst = 12 billboard sprites max. The void stays clean between events.
8. **HUD four-corner anchor + neon restraint:** Orbitron 700 for race numbers, DM Mono for readouts. Only three HUD elements receive bloom. Chrome-strip panel language matches the vehicle's crease vocabulary.
9. **Three.js budgets defined:** ≤85K tris/frame, ≤80MB VRAM, max 12 `MeshStandardMaterial` / 6 `ShaderMaterial`. Five-uniform contract (`uTime`, `uBoostFactor`, `uSpeed`, `uAccentColor`, `uEmissiveScale`) required on all custom shaders for global bloom tuning.
10. **9 hard prohibitions enforced:** Cyberpunk/synthwave tropes, rain-wet neon, grunge/decay, children's-toy saturation, exhaust smoke, lens flares, star fields, gold accent colors, and divergent vehicle silhouettes in V1 are all gate-rejection criteria.
