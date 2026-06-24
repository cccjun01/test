// Block-based Markdown → HTML parser (no dependencies, no catastrophic backtracking)
// Splits input into blank-line-separated blocks, classifies each, then applies inline rules.

function parseMarkdown(md) {
  // Normalise line endings
  const lines = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    // Skip blank lines between blocks
    if (lines[i].trim() === '') { i++; continue; }

    // Fenced code block
    if (lines[i].startsWith('```')) {
      const lang = lines[i].slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing ```
      const cls = lang ? ` class="language-${lang}"` : '';
      blocks.push(`<pre><code${cls}>${escHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    // Table: line with | and next line is separator
    if (lines[i].includes('|') && i + 1 < lines.length && /^\|[-| :]+\|/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const header = tableLines[0].split('|').slice(1, -1).map(c => `<th>${inlineRules(c.trim())}</th>`).join('');
      const rows = tableLines.slice(2).map(row => {
        const cells = row.split('|').slice(1, -1).map(c => `<td>${inlineRules(c.trim())}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('\n');
      blocks.push(`<table>\n<thead><tr>${header}</tr></thead>\n<tbody>\n${rows}\n</tbody>\n</table>`);
      continue;
    }

    // Blockquote
    if (lines[i].startsWith('> ')) {
      const bqLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        bqLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(`<blockquote>${inlineRules(bqLines.join(' '))}</blockquote>`);
      continue;
    }

    // Headings
    const hMatch = lines[i].match(/^(#{1,6}) (.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      blocks.push(`<h${level}>${inlineRules(hMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(lines[i].trim())) {
      blocks.push('<hr>');
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(lines[i])) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineRules(lines[i].replace(/^[-*] /, ''))}</li>`);
        i++;
      }
      blocks.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(lines[i])) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineRules(lines[i].replace(/^\d+\. /, ''))}</li>`);
        i++;
      }
      blocks.push(`<ol>\n${items.join('\n')}\n</ol>`);
      continue;
    }

    // Paragraph: gather until blank line
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !lines[i].startsWith('> ') && !/^#{1,6} /.test(lines[i]) && !/^---+$/.test(lines[i].trim())) {
      // Explicit line break: two trailing spaces
      if (lines[i].endsWith('  ')) {
        paraLines.push(inlineRules(lines[i].trimEnd()) + '<br>');
      } else {
        paraLines.push(inlineRules(lines[i]));
      }
      i++;
    }
    if (paraLines.length) {
      blocks.push(`<p>${paraLines.join('\n')}</p>`);
    }
  }

  return blocks.join('\n');
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineRules(str) {
  return escHtml(str)
    // Images before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

async function loadPost(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) throw new Error(`포스트를 찾을 수 없습니다: ${slug}`);
  const md = await res.text();
  return parseMarkdown(md);
}
