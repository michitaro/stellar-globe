import { expect, test } from '@playwright/test'

const hooksName = '__stellarGlobeJupyterlabTestHooks__'
const screenshotDelayMs = 5000

test('JupyterLite smoke notebook can open Stellar Globe and query state', async ({ page }, testInfo) => {
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
    consoleErrors.push(message.text())
  })
  page.on('pageerror', error => {
    pageErrors.push(String(error))
  })
  page.on('requestfailed', request => {
    unexpectedRequestFailures.push(`${request.failure()?.errorText ?? 'unknown'} ${request.url()}`)
  })

  await page.goto('lab/index.html')
  await page.waitForFunction(name => Boolean(globalThis[name]), hooksName)

  await page.evaluate(async name => {
    await globalThis[name].runNotebook('e2e-smoke.ipynb')
  }, hooksName)

  const windowCell = page.locator('.jp-CodeCell').filter({ hasText: "w = Window(title='e2e smoke')" })
  await expect(windowCell).toHaveCount(1)
  const windowOutput = windowCell.locator('.jp-OutputArea-output pre').last()
  await expect(windowOutput).toContainText('window_opened=True')
  await expect(windowOutput).toContainText('window_title=e2e smoke')
  await expect(windowOutput).not.toContainText('TimeoutError')

  const resultCell = page.locator('.jp-CodeCell').filter({ hasText: 'snapshot = w.snapshot_bytes()' })
  await expect(resultCell).toHaveCount(1)
  const output = resultCell.locator('.jp-OutputArea-output pre').last()
  await expect(output).toContainText('center_ok=True')
  await expect(output).toContainText('fov_ok=True')
  await expect(output).toContainText('snapshot_is_png=True')

  const outputText = await output.textContent() ?? ''
  const snapshotSizeMatch = outputText.match(/snapshot_size=(\d+)/)
  expect(snapshotSizeMatch).not.toBeNull()
  expect(Number(snapshotSizeMatch[1])).toBeGreaterThan(1024)

  await windowCell.scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  await testInfo.attach('window-open-result', {
    body: await windowCell.screenshot(),
    contentType: 'image/png',
  })

  await resultCell.scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  await testInfo.attach('notebook-result', {
    body: await resultCell.screenshot(),
    contentType: 'image/png',
  })

  await page.waitForFunction(({ name, title }) => {
    return globalThis[name].viewerTitles().includes(title)
  }, { name: hooksName, title: 'e2e smoke' })
  const canvas = page.locator('[data-testid="stellar-globe-app"] canvas').first()
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(screenshotDelayMs)
  await testInfo.attach('viewer-render', {
    body: await canvas.screenshot(),
    contentType: 'image/png',
  })
  const dataUrl = await canvas.evaluate(canvas => canvas.toDataURL())
  expect(dataUrl.startsWith('data:image/png')).toBeTruthy()

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
  expect(unexpectedRequestFailures).toEqual([])
})
