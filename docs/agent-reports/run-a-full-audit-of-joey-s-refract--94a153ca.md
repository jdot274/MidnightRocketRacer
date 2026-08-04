# Agent report — run a full audit of joey s refract

**Subagent transcript:** `docs/agent-transcripts/subagent-94a153ca-0b91-4fb9-a405-e14735b0d835.jsonl`

## Task brief

<timestamp>Friday, Jul 10, 2026, 4:50 AM (UTC-4)</timestamp>
<user_query>
Run a FULL AUDIT of Joey's Refract watch design configurator work — specifically the version/file/site/app that already has a 3D watch that renders the watch faces.

Context:
- Primary known location: C:\Users\joeyw\Desktop\Refract\ (and ANTIGRAVITY\MOBILE\, REFRACT_MASTER_v16.html, App_v16.js, etc.)
- User says they ALREADY have a version with a 3D watch that renders faces — find that version (don't assume v16 is the only/best one; search by recency and capability).
- User does NOT want demos/tests. This is an audit only.
- Additive doctrine: never delete; note versions.
- Prior idea list recommended Wrist Reality Try-On etc., but user is correcting that they already have 3D face-on-watch rendering — the audit must ground what's actually built.

Do a thorough audit covering:
1. **Inventory** — all Refract versions/files (HTML, RN/Expo, hosted vs local), which is latest, which has 3D watch + face rendering working.
2. **Architecture / stack** — Three.js / R3F / WebView / shaders / GLB / HDR / materials; local vs hosting decision state.
3. **What works** — face shaders, case materials, UI controls, save/feed, 2D vs 3D modes, orientation, etc.
4. **Gaps / debt** — broken paths, unused assets (wrist.png, chronograph.glb, studio.hdr), incomplete features, version sprawl.
5. **Quality bar** — visual/shader/UI maturity vs "best in class" configurator.
6. **Recommendation** — which file/stack to treat as canonical for the next build, and what the highest-leverage next feature is GIVEN what already exists (may revise prior idea ranking).

Search broadly under Desktop\Refract, related ANTIGRAVITY paths, and any hosting configs. Read key files enough to be accurate — don't invent.

Return a clear audit report: verdict first, then structured findings, then recommended next move. No .md file writes unless essential; put the audit in your response.
</user_query>

## Final answer

## Verdict: **PARTIAL** on that exact URL

| Claim | Result |
|--------|--------|
| File exists | **Yes** |
| `#/3d` is real 3D watch + live face shaders | **Yes (in code)** |
| `http://localhost:8080/...` loads right now | **No** — connection refused |
| v14 is the canonical / best 3D+faces build | **No** — superseded by v15/v16 |

---

### 1. File on disk

**Found:**  
`C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\REFRACT_MASTER_v14.html`  
- Size: 43,711 bytes  
- Modified: **2026-07-08 1:54 PM**

Also present: `App_v14.js` → `http://localhost:8080/REFRACT_MASTER_v14.html`

Masters on disk: **v1–v16** under the same `MOBILE` folder.

---

### 2. Server on `:8080`

**Nothing is listening on port 8080.**

- Playwright: `net::ERR_CONNECTION_REFUSED`
- Fetch MCP: connection failed
- Earlier TCP check: no OwningProcess on 8080

Project docs (`C:\Users\joeyw\Desktop\Refract\AGENTS.md`) say the expected server is:

```text
python -m http.server 8080
```

run from `ANTIGRAVITY\MOBILE\` — and that it **does not survive session/restart**. So the URL path is correct for when that server is up; it is **not up now**. No live screenshot of `#/3d` was possible.

---

### 3. What `#/3d` would show (from code, not live render)

v14 implements exactly what you described:

- Hash router: `#/3d` → `go('3d')` → `init3D()`
- Procedural Three.js smartwatch (RoundedBox case, crown, buttons, bands)
- **OLED plane uses the live face shader** (`ShaderMaterial` + `FRAG` / `makeUniforms(1)`)
- OrbitControls + auto-rotate, bloom, ACES tonemapping
- Case materials: Titanium / Stealth / Gold
- Edit/import panel (GLB/HDR/images + TransformControls)
- Loads `./assets/studio.hdr` for environment (assets **are** present on disk)

So: **v14 is a real 3D face-on-watch build** — but it cannot be visually confirmed at that URL until `:8080` is restarted.

---

### 4. v14 vs v15/v16 — is v14 canonical?

**No.**

| Version | Last write | Role |
|---------|------------|------|
| **v14** | Jul 8, 1:54 PM | 3D OLED watch + older category/palette face engine |
| **v15** | Jul 8, 10:49 PM | Same 3D watch + **SPECS + FRAG2** unique-per-design faces |
| **v16** | Jul 9, 12:19 AM | **Byte-identical to v15** (`fc`: no differences); `App_v16.js` points here |

`AGENTS.md` explicitly: **v15 = current, browser-verified**; **v13/v14 superseded but kept**.

So:

- If you remember working at `#/3d` on v14 — that memory is valid; v14 has that feature.
- For **canonical next build**, treat **`REFRACT_MASTER_v16.html`** (or v15; same content) as the line of record — not v14.
- Unique face-on-watch maturity starts at **v15+**, not v14.

---

### 5. Broader audit update (grounded)

**Stack:** Single-file HTML masters + Three.js 0.170 CDN + EffectComposer/bloom + optional RN WebView shells (`App_vN.js`). Local static server from `MOBILE/`. Not R3F.

**What works (v15/v16 line):** 2D + 3D routes, live shader faces on procedural OLED watch, materials, edit/import, feed/saved thumbs via shared offscreen renderer, guest/auth shell, kinetic sliders.

**Gaps / debt:**
- `:8080` often dead across sessions
- `chronograph.glb` + `wrist.png` exist under `assets/` but **unused** from v13+ (procedural watch replaced GLB; wrist try-on not wired)
- `studio.hdr` referenced; present — reflections work when server serves `assets/`
- Version sprawl v1–v16; AGENTS still says “v15 current” while App/shell already at v16 (identical copy)
- CDN Three.js (offline/store packaging still open)

**Quality bar:** Strong mid-stage configurator (shader faces + lit 3D case), not yet best-in-class product try-on (no wrist AR, no production GLB case, hosting/packaging incomplete).

**Highest-leverage next move (given what exists):** Keep **v16** canonical; next feature should **extend the already-working OLED face→3D watch path** (e.g. wire `chronograph.glb` / wrist presentation *onto* that live face pipeline), not invent “first 3D faces” or demote Wrist Try-On as if 3D faces don’t exist.

---

**Bottom line:** The path `REFRACT_MASTER_v14.html#/3d` is the right *kind* of build (3D watch + faces), but that exact localhost URL is **down**, and **v14 is not the best/canonical** version anymore — **v16 (= v15 engine)** is.
