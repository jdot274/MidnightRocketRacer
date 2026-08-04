# Agent report: answer joey s two questions clearly

- **Agent id:** `6ae5ae57-5ea8-4db0-970d-2db577663b63`
- **Session:** Midnight Rocket Racer (2026-08-03)
- **Raw transcript:** `docs/agent-transcripts/6ae5ae57-5ea8-4db0-970d-2db577663b63.jsonl`

## Task brief

<user_query>
Answer Joey's two questions clearly and decisively about Refract:

1) WHY are some URLs `http://localhost:8080/...` and some `file:///...` local path URLs?
2) WHICH (or neither) should we move forward with for the canonical next build?

Context you already know / must verify:
- Correct visual build he cares about: `REFRACT_APP_v35.html` (3D watch with live liquid/face designs) — was restored at http://localhost:8080/REFRACT_APP_v35.html
- Wrong/confusing line: REFRACT_MASTER_v14/v16 #/3d and gold chronograph GLB builds
- Server: python -m http.server 8080 from C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE
- AGENTS.md and App_vN.js may reference localhost
- Assets: studio.hdr, chronograph.glb, relative ./assets/ — these often break on file:// due to CORS/module restrictions

Investigate briefly:
- How v35 loads Three.js / assets / modules (CDN vs relative, ES modules?)
- Whether file:// works for v35 or fails (HDR/GLB/fetch)
- What App_v35.js / RN WebView expects
- Any hosting notes (Netlify etc.)

Return a tight answer:
1. Why both exist (plain English)
2. Clear recommendation: localhost vs file vs neither (e.g. hosted) — pick one for forward work on the v35 line
3. 2–4 concrete next steps
4. Any open questions that actually need Joey's preference

Do not build features. Decision + rationale only.
</user_query>

## Final report

## 1) Why both URLs exist

They are **two ways of opening the same HTML files**, not two products.

- **`http://localhost:8080/...`** — intentional. `python -m http.server 8080` from `ANTIGRAVITY/MOBILE`, documented in `AGENTS.md`, and what every `App_vN.js` WebView points at.
- **`file:///C:/Users/...`** — accidental/convenience. Double-click the `.html`, “Open with browser,” or a path link without a server. The browser shows the disk path as the URL.

## 2) Canonical forward path for the v35 line

**Use `http://localhost:8080` for all local v35 work. Do not use `file://`.**

Hosted (Vercel already exists for an older ship) is the later production target — **not** the day-to-day build surface for this next iteration.

**Why localhost wins for v35 specifically:**
- v35 is an ES module page (`importmap` → Three from unpkg CDN) plus `RGBELoader` of `./assets/studio.hdr`.
- On `file://`, module/CORS rules routinely break relative HDR (and often modules). Localhost gives a real origin so `./assets/` works.
- v35 builds a **procedural** watch (RoundedBox + liquid shader) — it does **not** load `chronograph.glb`. The MASTER gold chronograph / `#/3d` line is a different, confusing track.
- There is **no `App_v35.js` yet**; RN shells only go through MASTER (`App_v16` → `REFRACT_MASTER_v16.html`). Browser + localhost is the correct shell for v35 right now.

**Reject:** `file://` as a workflow. **Defer (don’t block on):** Netlify/Vercel until you’re ready to ship a v35 snapshot.

## 3) Next steps

1. Always open: `http://localhost:8080/REFRACT_APP_v35.html` (server from `MOBILE/`; restart after reboot).
2. Treat **APP v35** as the visual line of truth; ignore MASTER v14/v16 gold-GLB / `#/3d` for this track.
3. When you need the phone shell: add `App_v35.js` → that same localhost URL (don’t point WebView at `file://`).
4. Before store/share: host a frozen v35 build (Vercel path already in the repo) and eventually bundle Three locally (CDN is fine for local dev only).

## 4) Only preferences that need Joey

1. **Update `AGENTS.md` “working line”** from MASTER v15 → APP v35 now, or leave MASTER documented until v35 is feature-complete?
2. **RN WebView soon**, or stay browser-only until the liquid/face UX is locked?
3. **When to push v35 to Vercel** — after the next visual milestone, or keep local-only for a while?
