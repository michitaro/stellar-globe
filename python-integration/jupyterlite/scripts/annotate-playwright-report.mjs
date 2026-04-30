import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const reportDir = path.resolve(projectDir, 'playwright-report')
const reportIndexPath = path.join(reportDir, 'index.html')
const marker = 'stellar-globe-playwright-revision-banner'

if (!existsSync(reportIndexPath)) {
  process.exit(0)
}

const git = (args) =>
  execFileSync('git', args, {
    cwd: projectDir,
    encoding: 'utf8',
  }).trim()

const revision = process.env.CI_COMMIT_SHA || git(['rev-parse', 'HEAD'])
const shortRevision = process.env.CI_COMMIT_SHORT_SHA || revision.slice(0, 12)
const branch = process.env.CI_COMMIT_REF_NAME || git(['rev-parse', '--abbrev-ref', 'HEAD'])
const projectUrl = process.env.CI_PROJECT_URL?.replace(/\/+$/, '') || ''
const commitUrl = projectUrl ? `${projectUrl}/-/commit/${revision}` : ''

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const html = readFileSync(reportIndexPath, 'utf8')

if (html.includes(marker)) {
  process.exit(0)
}

const revisionMarkup = commitUrl
  ? `<a href="${escapeHtml(commitUrl)}"><code title="${escapeHtml(revision)}">${escapeHtml(shortRevision)}</code></a>`
  : `<code title="${escapeHtml(revision)}">${escapeHtml(shortRevision)}</code>`

const banner = `    <style id="${marker}-style">
      #${marker} {
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.94);
        color: #e2e8f0;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
        font: 12px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      #${marker} .label {
        color: #94a3b8;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      #${marker} code {
        font: inherit;
        font-weight: 700;
      }

      #${marker} a {
        color: inherit;
        text-decoration: none;
      }

      #${marker} a:hover,
      #${marker} a:focus-visible {
        text-decoration: underline;
      }

      #${marker} .branch {
        color: #bfdbfe;
      }

      @media (max-width: 640px) {
        #${marker} {
          left: 12px;
          border-radius: 16px;
          flex-wrap: wrap;
        }
      }
    </style>
    <div id="${marker}" role="note" aria-label="Tested revision">
      <span class="label">Tested revision</span>
      ${revisionMarkup}
      <span class="branch">${escapeHtml(branch)}</span>
    </div>
`

const annotatedHtml = html.replace('<body>', `<body>\n${banner}`)

if (annotatedHtml === html) {
  throw new Error(`failed to annotate Playwright report: ${reportIndexPath}`)
}

writeFileSync(reportIndexPath, annotatedHtml)
