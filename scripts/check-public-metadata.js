const fs = require('fs');
const path = require('path');

function readFile(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function fail(errors) {
  console.error('Metadata consistency check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const errors = [];

const packageJson = JSON.parse(readFile('package.json'));
const version = packageJson.version;

if (!/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(version)) {
  errors.push(`package.json version is not valid semver-like format: "${version}"`);
}

const bookYaml = readFile('book.yaml');
const authorMatch = bookYaml.match(/^\s*-\s*name:\s*"([^"]+)"/m);
if (!authorMatch) {
  errors.push('Cannot find primary author in book.yaml (authors[0].name).');
}
const author = authorMatch ? authorMatch[1].trim() : '';

const readme = readFile('README.md');
if (!readme.includes(`Phiên bản hiện tại: \`v${version}\``)) {
  errors.push(`README.md must contain "Phiên bản hiện tại: \`v${version}\`".`);
}

const webIndex = readFile(path.join('web', 'index.html'));
const webMetaMatch = webIndex.match(/<div class="book-meta">\s*Tác giả:\s*([^•<]+)\s*•\s*Phiên bản\s*([0-9]+\.[0-9]+\.[0-9]+(?:-rc\.\d+)?)\s*<\/div>/);
if (!webMetaMatch) {
  errors.push('web/index.html missing standardized .book-meta block: "Tác giả: <name> • Phiên bản <x.y.z>".');
} else {
  const webAuthor = webMetaMatch[1].trim();
  const webVersion = webMetaMatch[2].trim();
  if (author && webAuthor !== author) {
    errors.push(`web/index.html author mismatch: expected "${author}", found "${webAuthor}".`);
  }
  if (webVersion !== version) {
    errors.push(`web/index.html version mismatch: expected "${version}", found "${webVersion}".`);
  }
}

const releaseNotes = readFile(path.join('release', 'RELEASE_NOTES.md'));
if (!releaseNotes.includes(`# Release v${version}`)) {
  errors.push(`release/RELEASE_NOTES.md must start with release tag "v${version}".`);
}
if (author && !releaseNotes.includes(`> **Author**: ${author} — PTIT`)) {
  errors.push(`release/RELEASE_NOTES.md author line must be "> **Author**: ${author} — PTIT".`);
}
if (/SOA-Microservices-Book-v\d+\.\d+\.\d+/.test(releaseNotes) || /chapter-\d+-v\d+\.\d+\.\d+\.pdf/.test(releaseNotes)) {
  errors.push('release/RELEASE_NOTES.md still contains old versioned artifact filenames; use flat names like book.pdf and chapter-01.pdf.');
}
for (const requiredReleaseName of ['`book.pdf`', '`book.html`']) {
  if (!releaseNotes.includes(requiredReleaseName)) {
    errors.push(`release/RELEASE_NOTES.md missing ${requiredReleaseName} in contents table.`);
  }
}

const mainTyp = readFile(path.join('references', 'internal', 'typst', 'main.typ'));
if (author && !mainTyp.includes(`author: "${author}"`)) {
  errors.push(`references/internal/typst/main.typ author mismatch (expected "${author}").`);
}
if (!new RegExp(`edition:\\s*"Phiên bản ${escapeRegExp(version)}"`).test(mainTyp)) {
  errors.push(`references/internal/typst/main.typ edition must be "Phiên bản ${version}".`);
}

const mainWebTyp = readFile(path.join('references', 'internal', 'typst', 'main-web.typ'));
if (author && !mainWebTyp.includes(`author: "${author}"`)) {
  errors.push(`references/internal/typst/main-web.typ author mismatch (expected "${author}").`);
}

const releaseFiles = fs.readdirSync(path.join(process.cwd(), 'release'));
for (let i = 1; i <= 12; i += 1) {
  const chapterName = `chapter-${String(i).padStart(2, '0')}.pdf`;
  if (!releaseFiles.includes(chapterName)) {
    errors.push(`release folder missing "${chapterName}".`);
  }
  if (!releaseNotes.includes(`\`${chapterName}\``)) {
    errors.push(`release/RELEASE_NOTES.md missing "${chapterName}" in contents table.`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

console.log(`Metadata consistency OK for v${version} (${author}).`);
