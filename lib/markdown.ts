/**
 * Minimal, dependency-free markdown-to-HTML for AI-generated content:
 * handles ## / ### headings, blank-line paragraphs, and "- " bullet lists.
 * Not a general-purpose renderer — just enough for what the blog/landing
 * page agents actually produce.
 */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let listOpen = false;

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3 class="mt-6 text-lg font-semibold text-white">${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2 class="mt-8 text-xl font-bold text-white">${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!listOpen) {
        html.push('<ul class="mt-3 list-disc space-y-1.5 pl-5 text-neutral-300">');
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p class="mt-4 leading-relaxed text-neutral-300">${escapeHtml(line)}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}
