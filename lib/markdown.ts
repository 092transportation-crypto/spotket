/**
 * Minimal, dependency-free markdown-to-HTML for AI-generated content:
 * handles ## / ### headings, blank-line paragraphs, and "- " bullet lists.
 * Not a general-purpose renderer — just enough for what the blog/landing
 * page agents actually produce.
 */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Converts "[text](url)" to an anchor tag. Internal links (starting with "/") get no rel/target. */
function renderInlineLinks(escaped: string): string {
  return escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, url: string) => {
      const external = /^https?:\/\//.test(url);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${url}" class="text-brand-light underline underline-offset-2 hover:text-white"${attrs}>${text}</a>`;
    },
  );
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
      html.push(`<li>${renderInlineLinks(escapeHtml(line.slice(2)))}</li>`);
    } else {
      closeList();
      html.push(`<p class="mt-4 leading-relaxed text-neutral-300">${renderInlineLinks(escapeHtml(line))}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}
