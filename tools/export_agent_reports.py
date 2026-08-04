"""Export the agent team's work into the repo:
- docs/agent-transcripts/  raw .jsonl transcripts (parent + subagents)
- docs/agent-reports/      polished markdown: each subagent's task + final answer
"""
import json
import re
import shutil
from pathlib import Path

SESSION = Path(r"C:\Users\joeyw\.cursor\projects\c-Users-joeyw\agent-transcripts\6164bccd-f056-4155-ae89-327373bc2e09")
REPO = Path(r"C:\Users\joeyw\Projects\MidnightRocketRacer")
TRANSCRIPTS = REPO / "docs" / "agent-transcripts"
REPORTS = REPO / "docs" / "agent-reports"


def text_of(message) -> str:
    content = message.get("content", "")
    if isinstance(content, str):
        return content
    parts = []
    for block in content or []:
        if isinstance(block, dict) and block.get("type") == "text":
            parts.append(block.get("text", ""))
        elif isinstance(block, str):
            parts.append(block)
    return "\n".join(parts)


def extract(path: Path):
    first_user, last_assistant = "", ""
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        message = event.get("message", event)
        role = message.get("role") or event.get("role")
        body = text_of(message).strip()
        if not body:
            continue
        if role == "user" and not first_user:
            first_user = body
        elif role == "assistant":
            last_assistant = body
    return first_user, last_assistant


def slug_for(task: str, uuid: str) -> str:
    candidates = []
    for line in task.splitlines():
        line = line.strip()
        # Skip harness metadata: XML-ish tags, timestamps, reminders.
        if not line or line.startswith("<") or line.startswith("["):
            continue
        if re.match(r"^(Timestamp|Today|NOTE)\b", line, re.IGNORECASE):
            continue
        candidates.append(line)
    first = candidates[0] if candidates else uuid
    words = re.findall(r"[A-Za-z0-9]+", first)[:8]
    return ("-".join(words).lower() or uuid)[:70]


def main():
    TRANSCRIPTS.mkdir(parents=True, exist_ok=True)
    REPORTS.mkdir(parents=True, exist_ok=True)

    shutil.copy2(SESSION / f"{SESSION.name}.jsonl", TRANSCRIPTS / f"parent-{SESSION.name}.jsonl")

    index_rows = []
    for sub in sorted((SESSION / "subagents").glob("*.jsonl")):
        shutil.copy2(sub, TRANSCRIPTS / f"subagent-{sub.name}")
        task, answer = extract(sub)
        if not answer:
            continue
        uuid = sub.stem
        slug = slug_for(task, uuid)
        report = REPORTS / f"{slug}--{uuid[:8]}.md"
        task_trimmed = task if len(task) < 4000 else task[:4000] + "\n\n*(task brief truncated)*"
        report.write_text(
            f"# Agent report — {slug.replace('-', ' ')}\n\n"
            f"**Subagent transcript:** `docs/agent-transcripts/subagent-{sub.name}`\n\n"
            f"## Task brief\n\n{task_trimmed}\n\n"
            f"## Final answer\n\n{answer}\n",
            encoding="utf-8",
        )
        index_rows.append(f"- [{slug.replace('-', ' ')}]({report.name}) — `{uuid[:8]}`")
        print(f"REPORT {report.name}")

    (REPORTS / "INDEX.md").write_text(
        "# Agent team reports — Midnight Rocket Racer session\n\n"
        "Polished final answers from every subagent in the build session, with raw JSONL transcripts alongside in `../agent-transcripts/`.\n\n"
        + "\n".join(index_rows) + "\n",
        encoding="utf-8",
    )
    print(f"DONE {len(index_rows)} reports")


if __name__ == "__main__":
    main()
