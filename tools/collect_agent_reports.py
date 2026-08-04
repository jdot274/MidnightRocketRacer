"""Collect subagent transcripts + polished final answers into docs/.

Reads the Cursor agent transcript JSONL files for the Midnight Rocket Racer
session, copies each raw transcript into docs/agent-transcripts/, and writes
each agent's final assistant message (the polished report) into
docs/agent-reports/<slug>--<id8>.md.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

SESSION = Path(
    r"C:\Users\joeyw\.cursor\projects\c-Users-joeyw\agent-transcripts"
    r"\6164bccd-f056-4155-ae89-327373bc2e09"
)
PROJECT = Path(r"C:\Users\joeyw\Projects\MidnightRocketRacer")
TRANSCRIPTS_OUT = PROJECT / "docs" / "agent-transcripts"
REPORTS_OUT = PROJECT / "docs" / "agent-reports"

KNOWN_NAMES = {
    "114c53da": "harvest-local-design-sources",
    "db1b0f91": "research-web-racer-techniques",
    "991dd279": "harvest-neon-racer-aesthetics",
    "7a51ff76": "harvest-racer-shader-palette",
    "923cc643": "author-racer-art-bible",
    "3e505fcd": "producer-pipeline-coordination",
    "b666a8c7": "wire-racer-gameplay-core",
}


def text_blocks(message: dict) -> str:
    content = message.get("content")
    if isinstance(content, str):
        return content
    parts = []
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
    return "\n".join(parts)


def parse(path: Path):
    first_user, last_assistant = "", ""
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        role = event.get("role")
        text = text_blocks(event.get("message", {}))
        if not text.strip():
            continue
        if role == "user" and not first_user:
            first_user = text
        elif role == "assistant":
            last_assistant = text
    return first_user, last_assistant


def slugify(agent_id: str, brief: str) -> str:
    if agent_id[:8] in KNOWN_NAMES:
        return KNOWN_NAMES[agent_id[:8]]
    # Strip harness tags, take the first meaningful line of the task brief.
    brief = re.sub(r"<timestamp>[^<]*</timestamp>", " ", brief)
    brief = re.sub(r"<[^>]+>", " ", brief)
    line = next((l.strip() for l in brief.splitlines() if len(l.strip()) > 12), "agent-task")
    words = re.findall(r"[a-zA-Z0-9]+", line.lower())[:6]
    return "-".join(words) or "agent-task"


def main() -> None:
    TRANSCRIPTS_OUT.mkdir(parents=True, exist_ok=True)
    REPORTS_OUT.mkdir(parents=True, exist_ok=True)

    index = []
    subagents = sorted((SESSION / "subagents").glob("*.jsonl"))
    for jsonl in subagents:
        agent_id = jsonl.stem
        shutil.copy2(jsonl, TRANSCRIPTS_OUT / jsonl.name)
        brief, report = parse(jsonl)
        slug = slugify(agent_id, brief)
        out = REPORTS_OUT / f"{slug}--{agent_id[:8]}.md"
        brief_trim = re.sub(r"<timestamp>[^<]*</timestamp>", "", brief).strip()
        body = (
            f"# Agent report: {slug.replace('-', ' ')}\n\n"
            f"- **Agent id:** `{agent_id}`\n"
            f"- **Session:** Midnight Rocket Racer (2026-08-03)\n"
            f"- **Raw transcript:** `docs/agent-transcripts/{jsonl.name}`\n\n"
            f"## Task brief\n\n{brief_trim[:2000]}\n\n"
            f"## Final report\n\n{report or '_Agent ended without a final text report._'}\n"
        )
        out.write_text(body, encoding="utf-8")
        index.append((slug, agent_id, jsonl.name, bool(report)))

    # Parent chat transcript too.
    parent = SESSION / f"{SESSION.name}.jsonl"
    if parent.exists():
        shutil.copy2(parent, TRANSCRIPTS_OUT / f"parent-chat--{parent.name}")

    lines = [
        "# Agent transcripts & reports index",
        "",
        "Every agent that worked on Midnight Rocket Racer in this session, its raw",
        "JSONL transcript, and its polished final report.",
        "",
        "| Agent | Id | Transcript | Report |",
        "|---|---|---|---|",
    ]
    for slug, agent_id, name, has_report in index:
        report_name = f"{slug}--{agent_id[:8]}.md"
        lines.append(
            f"| {slug} | `{agent_id[:8]}` | [{name}](agent-transcripts/{name}) "
            f"| [{report_name}](agent-reports/{report_name}) |"
        )
    lines.append("")
    lines.append(f"Parent chat transcript: `agent-transcripts/parent-chat--{SESSION.name}.jsonl`")
    (PROJECT / "docs" / "AGENTS-INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    for slug, agent_id, _, has_report in index:
        print(f"{'OK ' if has_report else 'NO-REPORT '}{agent_id[:8]} {slug}")
    print(f"total: {len(index)} subagents")


if __name__ == "__main__":
    main()
