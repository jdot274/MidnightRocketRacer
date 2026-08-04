# Agent report — joey is correctly angry we pushed refract app

**Subagent transcript:** `docs/agent-transcripts/subagent-2c3e6965-65c0-4bf4-9efd-5b94e972c740.jsonl`

## Task brief

<timestamp>Friday, Jul 10, 2026, 5:14 AM (UTC-4)</timestamp>
<user_query>
Joey is correctly angry. We pushed REFRACT_APP_v35 as "canonical" because it looked like the 3D watch with face designs, but he says **v35 only has the rendering** and **lost all other pages, features, shaders, functionality** that exist in:

http://localhost:8080/REFRACT_MASTER_v14.html#/3d

(and the MASTER line generally).

Mission — correct course NOW:

1. **Honest gap analysis** (read the files): Compare `REFRACT_MASTER_v14.html` (and v15/v16 if needed) vs `REFRACT_APP_v35.html`. List what MASTER has that v35 lacks: routes/pages (#/2d, feed, saved, edit, materials, kinetic controls, SPECS/FRAG, auth shell, etc.) vs what v35 does better (liquid face on 3D watch).

2. **Correct canonical call:** MASTER line is the full product; v35 is a render/visual experiment. Do NOT keep treating v35-alone as the app.

3. **Highest-leverage fix (additive):** Create a NEW versioned master (e.g. REFRACT_MASTER_v17.html or similar — never overwrite v14/v16/v35) that keeps MASTER's full pages/features/shaders/functionality AND ports the superior 3D face-on-watch rendering from v35 into the #/3d path (or equivalent). If a full merge is too large for one pass, do the maximum coherent merge: at minimum restore MASTER as the forward line and integrate v35's OLED/liquid face pipeline into MASTER's 3D view.

4. If localhost:8080 is down, restart it from ANTIGRAVITY/MOBILE. Open the new merged file (or MASTER_v14 if merge incomplete) so he can see the full product again.

5. If Vercel was aliased to v35-only, either redeploy a MASTER-based deploy package or clearly report that prod currently points at the incomplete v35 and fix it to the merged/MASTER line.

Paths: C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\

User rules: additive only, no deleting old versions, no unnecessary .md, execute don't lecture. Return: gap summary, new file path, localhost URL, what was merged vs still TODO.
</user_query>

## Final answer

**Verdict:** Joey was right. `REFRACT_APP_v35` is a render/marketing shell (~20KB). The MASTER line is the full product. Forward line is now **MASTER_v17**.

### Gap summary

| | **MASTER v14–v16** | **APP v35** |
|---|---|---|
| Routes | intro → auth → **2d / 3d / feed / saved** | none (single landing + phone mock) |
| Engines | SPECS + FRAG2 (63 designs), kinetic lerp, palettes | one liquid raymarch shader |
| 3D | watch + OLED plane + materials + edit/import/GLB | AAA RoundedBox watch + liquid face |
| Auth / save / feed | Supabase shell, save, feed, saved | none |
| What v35 wins | — | better watch mesh + liquid OLED face |

### New file
`C:\Users\joeyw\Desktop\Refract\ANTIGRAVITY\MOBILE\REFRACT_MASTER_v17.html`

### Localhost
http://localhost:8080/REFRACT_MASTER_v17.html#/3d  
(8080 was already up; opened this URL)

### Merged into v17
- Full MASTER shell (all pages, SPECS/FRAG2, kinetic, materials, edit/import, auth)
- v35 AAA watch (body/bezel/RoundedBox screen/crown/curved bands/HDRI/ACES)
- v35 liquid raymarch face when category = **Liquid**; other categories keep MASTER SPECS on the OLED

### Prod
Was aliased to v35-only via `deploy_v35`. Redeployed MASTER package → **https://refract-app.vercel.app** now loads `REFRACT_MASTER_v17.html`.

### Still TODO (next pass)
- Wire 2D design picker live-sync into 3D face without leaving the route
- Optional: always-on liquid layer blend (not just Liquid category)
- Chronograph GLB / wrist.png polish on the v35 mesh
- Custom domain check if you use one beyond `refract-app.vercel.app`
