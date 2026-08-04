# Agent report — read only exploration only inventory joey s google

**Subagent transcript:** `docs/agent-transcripts/subagent-5fb9a474-e4ed-47f4-8313-8cdbbb0c0143.jsonl`

## Task brief

<timestamp>Monday, Aug 3, 2026, 9:42 PM (UTC-4)</timestamp>
<user_query>
Read-only exploration only. Inventory Joey's Google stack that could contribute to a new third massive project: Gemini API/Vertex/Google Cloud/Drive/Firebase/Maps/etc., existing local code and config evidence. Never reveal secrets or key content. Search relevant local docs/config/project references and available Google MCP capability descriptions if needed. Return a concise capability map with concrete evidence/paths and intended role in the new project's stack. Do not edit or authenticate.
</user_query>

## Final answer

# Joey's Google Stack — Capability Map (read-only inventory)

No secrets are shown below. Where a key/token exists it is marked **[configured]** only. All paths are absolute.

## 1. Canonical routing guidance (authoritative — follow this for the new project)
- **`C:\Users\joeyw\.claude\projects\C--\memory\google-gemini-canonical.md`** and **`C:\Users\joeyw\.cursor\skills\mygoogle\SKILL.md`** are the source of truth.
- **Two doors:**
  - **Door A — Gemini API** (`generativelanguage.googleapis.com`), auth via `GEMINI_API_KEY`/AI Studio, SDK `google-genai` (`from google import genai`). Preferred for OCR, screenshots, multimodal, agent vision.
  - **Door B — Vertex GenAI** (`aiplatform.googleapis.com`), ADC + GCP IAM. For enterprise/billable cloud workflows.
- **Projects:** prefer billable **`planning-with-aig`**; default gcloud stub `gen-lang-client-0350262214` (no billing); **avoid** `gen-lang-client-0470095352` (AI_Toolbox hardcode, permission denied for joey.walter12@gmail.com).
- **Models:** `gemini-3.6-flash` (general), `gemini-3.5-flash-lite` (high-volume OCR). Do not use `gemini-1.5-flash`.
- Explicit warning in memory: **do not treat the `vertex-ai-toolbox`/AI_Toolbox MCP as authority** — it's outdated.

## 2. Existing local Google code (strongest concrete asset)
Project root: **`C:\Users\joeyw\Projects\AI_Toolbox`** (a FastMCP server + FastAPI + Cloud Run backend). Deps in `requirements.txt`: `google-cloud-aiplatform==1.56.0`, `google-cloud-storage==2.17.0`, `google-auth==2.30.0`, `psycopg2-binary`, `fastapi`, `uvicorn`.

| Capability | Evidence (path) | Intended role in new project |
|---|---|---|
| Vertex AI Gemini text+vision | `vertex_client.py`, `mcp_server.py`, `gcp_ai_ingestion.py`, `code_assistant.py` | Multimodal analysis / codegen backend (note: hardcoded to the denied project — rewire to `planning-with-aig` or Door A) |
| Vector embeddings + semantic search | `vector_search.py` (`text-embedding-004`, 768-dim), `db_connector.py` (pgvector + SQLite fallback) | RAG / semantic asset search layer |
| Google Cloud Storage (buckets, signed URLs) | `gcs_storage_manager.py` | Asset storage + Three.js-loadable signed URLs |
| Cloud Run API gateway (authed via identity tokens) | `cloud_run_client.py` (`aaa-asset-gateway-*.run.app`), `eagle_drive_bridge.py` (`xengene-asset-api-*.run.app`, bucket `xengene-asset-studio-storage-*`) | Serverless API backend; already deployed pattern to reuse |
| Firestore (via Cloud Run) + Eagle.cool sync | `eagle_drive_bridge.py` | Asset metadata store + local DAM two-way sync |
| gcloud ADC credential shim | `gcloud_credentials.py`, `find_client_secrets.py` (not read; likely secrets — left untouched) | Local auth bootstrap |
| React/Vite dashboard frontend | `frontend/` (App.jsx, Dashboard.jsx, recharts, framer-motion) | Ready-made UI shell |

Auth model here: local **Application Default Credentials** (`gcloud auth`), not embedded service-account keys in code.

## 3. Configured Google MCP surfaces (in `C:\Users\joeyw\.cursor\mcp.json`)
All Google Cloud remote MCPs use `authProviderType: google_credentials` (OAuth/ADC, no keys in file):

- **AI / data:** `vertex-ai-search` (discoveryengine), `google-developer-knowledge`, `datacloud_bigquery_remote`, `datacloud_alloydb_remote`, `datacloud_cloud-sql_remote`, `datacloud_spanner_remote`, `datacloud_dataproc_remote`, `datacloud_knowledge_catalog_remote` / `knowledge-catalog` (dataplex).
- **Databases:** `google-cloud-firestore`, `google-cloud-bigtable-admin`.
- **Infra/ops:** `google-cloud-logging`, `google-cloud-monitoring`, `google-cloud-pubsub`, `google-cloud-resource-manager`, `google-compute-engine`, `google-managed-service-for-apache-kafka`, `cloudrun` (`@google-cloud/cloud-run-mcp`).
- **Firebase:** `firebase-mcp-server` (`firebase-tools@latest mcp`) — deploy, Firestore rules, apps/projects, SDK config. (No local `firebase.json`/`.firebaserc` found under `Projects` or `Developer` — Firebase is available as tooling but not yet wired to a local app.)
- **Genkit:** `genkit-mcp-server` (`genkit-cli@^1.28.0`) — flows, tracing, Genkit docs.
- **Maps:** `google-maps` (`@modelcontextprotocol/server-google-maps`), `GOOGLE_MAPS_API_KEY` **[configured]**; plus `gmp-code-assist` (mapscodeassist).
- **Drive:** `google-drive` (`@modelcontextprotocol/server-gdrive`).
- **Android:** `android-management-api`.
- **Custom:** `vertex-ai-toolbox` → runs `C:\Users\joeyw\Projects\AI_Toolbox\mcp_server.py` (tools `analyze_asset_image`, `generate_unreal_engine_code`).

Live MCP servers this session confirm several of these are reachable: `plugin-firebase-firebase`, `genkit-mcp-server`, `user-google-maps`, `user-google-drive`, `user-cloudrun`, `user-vertex-ai-toolbox`, plus Firebase `developerknowledge_*` doc tools.

## 4. Suggested role mapping for a new third massive project
- **Generative AI core:** Gemini API via `google-genai` (Door A) for agent/multimodal/OCR; Vertex GenAI (Door B) on `planning-with-aig` only if you need IAM/enterprise/billable features. Reuse `AI_Toolbox` code patterns but repoint the project ID.
- **Serverless backend:** Cloud Run (proven deploy pattern in `cloud_run_client.py`/`eagle_drive_bridge.py` + `cloudrun` MCP).
- **Storage + delivery:** GCS with v4 signed URLs (`gcs_storage_manager.py`).
- **Data layer:** Firestore for metadata (MCP + Cloud Run pattern) and/or Cloud SQL/AlloyDB + pgvector for embeddings/RAG (`db_connector.py`, `vector_search.py`).
- **Search/RAG:** Vertex AI Search (`vertex-ai-search` MCP) or self-hosted pgvector.
- **App framework:** Firebase (auth/hosting/functions) + Genkit for orchestration/flows — both configured, not yet instantiated locally.
- **Geo/media:** Google Maps and Drive MCPs available if the project needs location or document ingestion.
- **Ops:** Cloud Logging/Monitoring/Pub/Sub MCPs for observability.

## Notes / gaps
- Secret material was intentionally not read/echoed (`find_client_secrets.py`, ADC json, `.env`, MCP env tokens). Several MCP env tokens exist in `mcp.json` but are left redacted here.
- No local Firebase/Genkit project scaffolding exists yet under `Projects` or `Developer` — those are tooling-ready, greenfield for the new project.
- `Access is denied` on the `My Documents` junction blocked whole-home globbing; searches were scoped to `Projects`, `Developer`, `.cursor`, and `.claude`, which is where the Google evidence lives.
