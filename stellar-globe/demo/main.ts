import { ClickableMarkerLayer } from '~/layer/marker_layer'
import { BeautifulObjectLayer, ConstellationLayer, EsoMilkyWayLayer, Globe, GridLayer, HipparcosCatalogLayer, Layer, SspTileLayer, V4, View, hips, triangleStrip } from '../src'
import { SkyCoord } from '../src/lib/angle'
import { MarkerType, markerTypes } from '~/layer/marker_layer/marker'
import { 
  VisualEffectParams,
  GlowEffect, 
  FrostedGlassEffect, 
  RippleEffect, 
  WarpEffect,
  PlanetariumEffect,
} from '../src/visualEffects'
import './style.scss'


window.addEventListener('load', main)


function main() {
  const hipsUrl = '//alasky.cds.unistra.fr/Pan-STARRS/DR1/color-i-r-g'

  const el = document.createElement('div')
  document.body.appendChild(el)
  el.style.width = '100vw'
  el.style.height = '100vh'

  const globe = new Globe(el, { viewOptions: { retina: true } })

  initTileLayer(globe)
  globe.addNewLayer(GridLayer)
  globe.addNewLayer(HipparcosCatalogLayer)
  globe.addNewLayer(ConstellationLayer, { showLines: true, showNames: false, lang: 'English' })
  globe.addNewLayer(hips.SimpleImageLayer, hipsUrl)
  globe.addNewLayer(BeautifulObjectLayer, 'm31')
  globe.addNewLayer(EsoMilkyWayLayer)

  globe.addNewLayer(ClickableMarkerLayer, {
    markers: Array.from({ length: 1000 }, (_, i) => ({
      position: SkyCoord.fromDeg(randomInRange(-1, 1), randomInRange(-1, 1)).xyz,
      color: [...hsvToRgb(Math.random(), 0.75, 1), 0.75] as V4,
      type: markerTypes[i % markerTypes.length] as MarkerType,
    })),
    defaultColor: [1, 1, 1, 0],
    defaultType: 'circle',
    dimmAlpha: 0.75,
    onClick: (i) => console.log(i)
  })

  globe.addNewLayer(TriangleStirpLayer)

  // ビジュアルエフェクトのデモを初期化
  initVisualEffectsDemo(globe)
}



function initTileLayer(globe: Globe) {
  const betaInput = document.querySelector('#beta-input') as HTMLInputElement
  const params = SspTileLayer.defaultParams({ type: 'simpleRgb' })
  const a = 1.e+1
  const f = (x: number) => Math.exp(a * x)
  const g = (y: number) => Math.log(y) / a
  const layer = globe.addNewLayer(SspTileLayer, { baseUrl: '//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide', outline: true, colorParams: params })
  SspTileLayer.assertType(params, 'simpleRgb')
  betaInput.addEventListener('input', e => {
    // @ts-ignore
    const beta = f(Number(e.currentTarget.value))
    params.simpleRgb.beta = beta
    layer.setParams(params)
  })
  betaInput.value = String(g(params.simpleRgb.beta))
}


// @ts-ignore
class TriangleStirpLayer extends Layer {
  private r!: triangleStrip.Renderer

  constructor(globe: Globe) {
    super(globe)
    this.r = new triangleStrip.Renderer(globe.gl)
    this.onRelease(() => this.r.release())
    this.setupTriangles()
  }

  private setupTriangles() {
    this.r.addStrips([
      { position: [0, 0, 0], color: [0, 0, 0, 1] },
      { position: [1, 0, 0], color: [1, 0, 0, 1] },
      { position: [0, 1, 0], color: [0, 1, 0, 1] },
      { position: [1, 1, 0], color: [1, 1, 0, 1] },
    ])
    this.r.addStrips([
      { position: [0, 0, 0], color: [0, 0, 0, 1] },
      { position: [0, 1, 0], color: [1, 0, 0, 1] },
      { position: [0, 0, 1], color: [0, 1, 0, 1] },
      { position: [0, 1, 1], color: [1, 1, 0, 1] },
    ])

    const a = 1.e-2
    for (let i = 0; i < 10000; ++i) {
      const R = () => -1 + 2 * Math.random()
      const [x, y, z] = [R(), R(), R()]
      const c0: V4 = [1, 0, 0, 1]
      const c1: V4 = [0, 1, 0, 1]
      const c2: V4 = [0, 0, 1, 1]
      this.r.addTriangle(
        { position: [x + a * R(), y + a * R(), z + a * R()], color: c0 },
        { position: [x + a * R(), y + a * R(), z + a * R()], color: c1 },
        { position: [x + a * R(), y + a * R(), z + a * R()], color: c2 },
      )
    }
  }

  render(view: View) {
    this.r.render(view)
  }
}


function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r: number, g: number, b: number

  let i = Math.floor(h * 6)
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }

  // @ts-ignore
  return [r, g, b]
}

function randomInRange(min: number, max: number) {
  return (max - min) * Math.random() + min
}


/**
 * ビジュアルエフェクトのデモ
 * キーボードでエフェクトを切り替え
 */
function initVisualEffectsDemo(globe: Globe) {
  // 利用可能なエフェクト
  const effects: { key: string; name: string; effect: VisualEffectParams | null }[] = [
    { key: '0', name: 'None (エフェクトなし)', effect: null },
    { key: '1', name: 'Glow (グロー)', effect: new GlowEffect() },
    { key: '2', name: 'Frosted Glass (すりガラス)', effect: new FrostedGlassEffect() },
    { key: '3', name: 'Ripple (波紋)', effect: new RippleEffect() },
    { key: '4', name: 'Warp (ワープ)', effect: new WarpEffect() },
    { key: '5', name: 'Planetarium (プラネタリウム)', effect: new PlanetariumEffect() },
  ]

  let currentEffectIndex = 0
  let animationFrameId: number | null = null
  let lastTime = performance.now()

  // アニメーションループ（波紋やすりガラスなどの動的エフェクト用）
  function animateEffect() {
    const effect = effects[currentEffectIndex].effect
    if (effect && effect.update) {
      const now = performance.now()
      const deltaTime = now - lastTime
      lastTime = now
      effect.update(deltaTime)
      globe.requestRefresh()
    }
    animationFrameId = requestAnimationFrame(animateEffect)
  }

  // エフェクト切り替え
  function setEffect(index: number) {
    if (index < 0 || index >= effects.length) return
    currentEffectIndex = index
    const { name, effect } = effects[index]
    globe.setVisualEffect(effect)
    showNotification(`Effect: ${name}`)
    
    // アニメーションが必要なエフェクトの場合はループを開始
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (effect && effect.update) {
      lastTime = performance.now()
      animateEffect()
    }
  }

  // 通知を表示
  function showNotification(message: string) {
    const existing = document.querySelector('.effect-notification')
    if (existing) existing.remove()

    const notification = document.createElement('div')
    notification.className = 'effect-notification'
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 10000;
      transition: opacity 0.3s;
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }

  // ヘルプパネルを作成
  function createHelpPanel() {
    const panel = document.createElement('div')
    panel.className = 'effect-help-panel'
    panel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">Visual Effects (キーで切り替え)</div>
      ${effects.map(e => `<div><kbd>${e.key}</kbd> ${e.name}</div>`).join('')}
      <div style="margin-top: 8px; font-size: 11px; color: #aaa;">
        W: ワープ開始/終了
      </div>
    `
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: sans-serif;
      font-size: 12px;
      z-index: 10000;
      line-height: 1.6;
    `
    panel.querySelectorAll('kbd').forEach(kbd => {
      ;(kbd as HTMLElement).style.cssText = `
        background: #333;
        padding: 2px 6px;
        border-radius: 3px;
        margin-right: 8px;
        font-family: monospace;
      `
    })
    document.body.appendChild(panel)
  }

  // キーボードイベントを設定
  document.addEventListener('keydown', async (e) => {
    // 数字キーでエフェクト切り替え
    const index = effects.findIndex(ef => ef.key === e.key)
    if (index >= 0) {
      setEffect(index)
      return
    }

    // Wキーでワープ効果のトグル
    if (e.key === 'w' || e.key === 'W') {
      const warpIndex = effects.findIndex(ef => ef.effect instanceof WarpEffect)
      if (warpIndex >= 0) {
        const warp = effects[warpIndex].effect as WarpEffect
        if (currentEffectIndex !== warpIndex) {
          setEffect(warpIndex)
          await warp.startWarp(1500)
        } else if (warp.warpStrength > 0) {
          await warp.endWarp(800)
        } else {
          await warp.startWarp(1500)
        }
        globe.requestRefresh()
      }
    }
  })

  createHelpPanel()
  console.log('Visual Effects Demo initialized. Press 0-5 to switch effects.')
}
