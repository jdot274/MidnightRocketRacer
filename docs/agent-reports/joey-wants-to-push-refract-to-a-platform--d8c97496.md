# Agent report — joey wants to push refract to a platform

**Subagent transcript:** `docs/agent-transcripts/subagent-d8c97496-830a-4fae-9d0f-85b466b1dfa7.jsonl`

## Task brief

<timestamp>Friday, Jul 10, 2026, 5:07 AM (UTC-4)</timestamp>
<user_query>
Joey wants to push Refract to a "platform" / environment where it becomes a **real app** — not localhost HTML demos.

Canonical visual line: `REFRACT_APP_v35.html` at `C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\` (3D watch + live face designs). Localhost:8080 is only for local serve.

Your job:
1. Inventory existing "real app" paths already in the Refract project: Expo/RN (`App_vN.js`, package.json), Vercel/Netlify/Firebase/Cloud Run configs, any prior deploys, AGENTS.md notes.
2. Decide the best forward platform for "actually becoming a real app" given what exists — lead with ONE recommendation (likely: Expo app wrapping v35 WebView AND/OR hosted web on Vercel — pick based on evidence of what's already closest to shippable).
3. Execute the highest-leverage next step toward that platform NOW (additive only — new version files, don't delete/overwrite v35). Examples: wire App_v35.js → v35 URL, prepare deploy folder, deploy to existing Vercel project if credentials/config exist, update env docs. Prefer doing over asking unless a hard preference fork blocks you.
4. If deploy needs interactive login/secrets Joey must provide, do everything else and report the exact one blocker.

Return: recommended platform, what you did, live URL or next command Joey must run, and what's still needed for "real app" (store vs PWA vs Expo Go).

User rules: no .md/.html unless needed for the ship; additive versioning; execute yourself.
</user_query>

## Final answer

## Recommendation: **Vercel-hosted PWA** (then Expo WebView for store)

Closest to shippable: existing `refract-app` Vercel project, prior production deploys, CLI already logged in (`jdw274-1228`). Expo shells (`App_v1`–`v16`) still pointed at localhost and lacked `react-native-webview` / `app.json` — not ready alone.

### Inventory (what exists)
| Path | Status |
|------|--------|
| `ANTIGRAVITY/MOBILE/REFRACT_APP_v35.html` | Canonical visual (3D watch + live face) |
| Expo `App_v1`–`v16` | WebView → localhost:8080 |
| `deploy/` + `vercel.json` | Older PWA (`app.html`) |
| Vercel `refract-app` | Live aliases, credentials OK |
| Tauri `app/` | Desktop, not the mobile line |
| Firebase / Cloud Run / Netlify | No configs found |
| Supabase | Noted in AGENTS as backend (not Firebase) |

### What I did (additive)
1. Created `Desktop/Refract/deploy_v35/` (v35 + `assets/studio.hdr` + PWA) — source v35 untouched  
2. **Deployed production** → aliased to https://refract-app.vercel.app  
3. Added `App_v35.js` (defaults to prod URL; local via `EXPO_PUBLIC_REFRACT_LOCAL=1`)  
4. Added `AppEntry_v35.js`, `app.json`, `react-native-webview` in `package.json`

### Live URL
**https://refract-app.vercel.app/REFRACT_APP_v35.html**  
(also https://refract-app.vercel.app/ → v35)

### What’s still needed for “real app”
| Goal | Status |
|------|--------|
| **PWA** | Ready — open URL on phone → Add to Home Screen |
| **Expo Go** | `cd ANTIGRAVITY/MOBILE` → `npm i` → set `"main": "AppEntry_v35.js"` → `npx expo start` |
| **Play Store** | Needs EAS (`eas.json`), signing, store listing — not set up yet |

**No login/secrets blocker** — deploy already went through.
