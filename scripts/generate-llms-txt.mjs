import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, 'docs');
const outputPath = path.join(projectRoot, 'static', 'llms.txt');
const docExtensions = new Set(['.md', '.mdx']);

async function collectDocPaths(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectDocPaths(fullPath);
      }

      if (entry.isFile() && docExtensions.has(path.extname(entry.name))) {
        return [fullPath];
      }

      return [];
    }),
  );

  return nestedPaths.flat().sort((left, right) => left.localeCompare(right));
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseFrontmatter(rawContent) {
  const normalized = rawContent.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return { metadata: [], body: normalized };
  }

  const lines = normalized.split('\n');
  const closingIndex = lines.indexOf('---', 1);

  if (closingIndex === -1) {
    return { metadata: [], body: normalized };
  }

  const metadata = [];

  for (const line of lines.slice(1, closingIndex)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!match) {
      continue;
    }

    metadata.push({
      key: match[1],
      value: stripWrappingQuotes(match[2].trim()),
    });
  }

  return {
    metadata,
    body: lines.slice(closingIndex + 1).join('\n'),
  };
}

function extractPrimaryHeading(body) {
  for (const line of body.split('\n')) {
    const match = line.match(/^#\s+(.+)$/);

    if (match) {
      return match[1].trim();
    }
  }

  return '';
}

function formatDocument({ relativePath, metadata, primaryHeading, content }) {
  const lines = ['=== DOCUMENT START ===', `SOURCE_PATH: ${relativePath}`];

  if (metadata.length > 0) {
    lines.push('METADATA:');

    for (const item of metadata) {
      lines.push(`  ${item.key}: ${item.value}`);
    }
  }

  if (primaryHeading) {
    lines.push(`PRIMARY_HEADING: ${primaryHeading}`);
  }

  lines.push('CONTENT_START');
  lines.push(content.trimEnd());
  lines.push('CONTENT_END');
  lines.push('=== DOCUMENT END ===');

  return lines.join('\n');
}

async function main() {
  const docPaths = await collectDocPaths(docsDir);

  const documents = await Promise.all(
    docPaths.map(async (docPath) => {
      const rawContent = await fs.readFile(docPath, 'utf8');
      const { metadata, body } = parseFrontmatter(rawContent);

      return {
        relativePath: path.relative(projectRoot, docPath).split(path.sep).join('/'),
        metadata,
        primaryHeading: extractPrimaryHeading(body),
        content: rawContent.replace(/\r\n/g, '\n'),
      };
    }),
  );

  const output = [
    'LLM_EXPORT_VERSION: 1',
    `GENERATED_AT_UTC: ${new Date().toISOString()}`,
    `DOC_COUNT: ${documents.length}`,
    '',
    documents.map(formatDocument).join('\n\n'),
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output, 'utf8');

  console.log(`Wrote ${documents.length} docs to ${path.relative(projectRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
