import { expect, test } from '@playwright/test'

const hooksName = '__stellarGlobeJupyterlabTestHooks__'

test('JupyterLite smoke notebook can open Stellar Globe and query state', async ({ page }) => {
  const consoleErrors = []
  const pageErrors = []
  const unexpectedRequestFailures = []

  page.on('console', message => {
    if (message.type() !== 'error') {
      return
    }
    if (message.text().startsWith('Failed to load resource:')) {
      return
    }
    if (message.text().includes('TypeError: Failed to fetch')) {
      return
    }
    consoleErrors.push(message.text())
  })
  page.on('pageerror', error => {
    const text = String(error)
    if (text === 'TypeError: Failed to fetch') {
      return
    }
    pageErrors.push(text)
  })
  page.on('requestfailed', request => {
    const url = request.url()
    if (!isAllowedRequestFailure(url)) {
      unexpectedRequestFailures.push(`${request.failure()?.errorText ?? 'unknown'} ${url}`)
    }
  })

  await page.goto('/lab/index.html')
  await page.waitForFunction(name => Boolean(globalThis[name]), hooksName)

  await page.evaluate(async name => {
    await globalThis[name].runNotebook('e2e-smoke.ipynb')
  }, hooksName)

  const output = page.locator('.jp-OutputArea-output pre').last()
  await expect(output).toContainText('window_title=e2e smoke')
  await expect(output).toContainText('center_ok=True')
  await expect(output).toContainText('fov_ok=True')
  await expect(output).toContainText('snapshot_is_png=True')

  const outputText = await output.textContent() ?? ''
  const snapshotSizeMatch = outputText.match(/snapshot_size=(\d+)/)
  expect(snapshotSizeMatch).not.toBeNull()
  expect(Number(snapshotSizeMatch[1])).toBeGreaterThan(1024)

  await page.waitForFunction(({ name, title }) => {
    return globalThis[name].viewerTitles().includes(title)
  }, { name: hooksName, title: 'e2e smoke' })
  await expect(page.locator('[data-testid="stellar-globe-app"] canvas').first()).toBeVisible()
  const dataUrl = await page.locator('[data-testid="stellar-globe-app"] canvas').first().evaluate(canvas => canvas.toDataURL())
  expect(dataUrl.startsWith('data:image/png')).toBeTruthy()

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
  expect(unexpectedRequestFailures).toEqual([])
})

function isAllowedRequestFailure(url) {
  return [
    'http://hscmap.mtk.nao.ac.jp/stellar-globe/static/pretty_picture/',
    'http://hscmap.mtk.nao.ac.jp/stellar-globe/static/eso_milky_way_layer/',
    'http://hscmap.mtk.nao.ac.jp/stellar-globe/static/hipparcos-catalog/index.json',
    'http://hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide/filter.json',
    'http://hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_dud/filter.json',
  ].some(prefix => url.startsWith(prefix))
}
