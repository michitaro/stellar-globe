const { expect, test } = require('@playwright/test')

const hooksName = '__stellarGlobeJupyterlabTestHooks__'

test('JupyterLab notebook can open exactly one Stellar Globe viewer', async ({ page }, testInfo) => {
  const consoleErrors = []
  const pageErrors = []
  const dialogs = []
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
    const details = String(error.stack ?? error)
    if (details.includes('jlab_core') && details.includes("Cannot read properties of undefined (reading 'type')")) {
      return
    }
    pageErrors.push(details)
  })
  page.on('dialog', async dialog => {
    dialogs.push(`${dialog.type()}: ${dialog.message()}`)
    await dialog.dismiss()
  })
  page.on('requestfailed', request => {
    const errorText = request.failure()?.errorText ?? 'unknown'
    if (errorText === 'net::ERR_ABORTED' && request.url().includes('/lab/api/workspaces/')) {
      return
    }
    if (errorText === 'net::ERR_NETWORK_CHANGED') {
      return
    }
    unexpectedRequestFailures.push(`${errorText} ${request.url()}`)
  })

  await page.goto('/lab?reset')
  await page.waitForFunction(name => Boolean(globalThis[name]), hooksName)
  await page.evaluate(async name => {
    await globalThis[name].runNotebook('e2e-smoke.ipynb')
  }, hooksName)

  const windowCell = page.locator('.jp-CodeCell').filter({ hasText: "w = Window(title='e2e smoke')" })
  await expect(windowCell).toHaveCount(1)
  const windowOutput = windowCell.locator('.jp-OutputArea-output pre').last()
  await expect(windowOutput).toContainText('window_opened=True')
  await expect(windowOutput).toContainText('window_title=e2e smoke')

  const resultCell = page.locator('.jp-CodeCell').filter({ hasText: 'snapshot = w.snapshot_bytes()' })
  await expect(resultCell).toHaveCount(1)
  const resultOutput = resultCell.locator('.jp-OutputArea-output pre').last()
  await expect(resultOutput).toContainText('center_ok=True')
  await expect(resultOutput).toContainText('fov_ok=True')
  await expect(resultOutput).toContainText('snapshot_is_png=True')

  await page.waitForFunction(({ name, title }) => {
    return globalThis[name].viewerTitles().filter(candidate => candidate === title).length === 1
  }, { name: hooksName, title: 'e2e smoke' })
  const viewerTitles = await page.evaluate(name => {
    return globalThis[name].viewerTitles()
  }, hooksName)
  expect(viewerTitles.filter(title => title === 'e2e smoke')).toHaveLength(1)

  const canvas = page.locator('[data-testid="stellar-globe-app"] canvas').first()
  await expect(canvas).toBeVisible()
  await testInfo.attach('viewer-render', {
    body: await canvas.screenshot(),
    contentType: 'image/png',
  })

  expect(dialogs).toEqual([])
  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
  expect(unexpectedRequestFailures).toEqual([])
})
