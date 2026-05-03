import { ClickableMarkerLayer } from '~/layer/marker_layer'
import { BeautifulObjectLayer, ConstellationLayer, EsoMilkyWayLayer, Globe, GridLayer, HipparcosCatalogLayer, Layer, SspTileLayer, V4, View, hips, triangleStrip } from '../src'
import { SkyCoord, deg2rad } from '../src/lib/angle'
import { MarkerType, markerTypes } from '~/layer/marker_layer/marker'
import { 
  VisualEffectParams,
  GlowEffect, 
  GaussianBlurEffect,
  BloomEffect,
  AfterimageEffect,
  TransitionEffect,
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

type EffectEntry = {
  key: string
  name: string
  description: string
  usage: string[]
  effect: VisualEffectParams | null
}

type TransitionTarget = {
  name: string
  coord: SkyCoord
  fovy: number
}

function hasAspectRatio(effect: VisualEffectParams): effect is VisualEffectParams & { aspectRatio: number } {
  return 'aspectRatio' in effect && typeof effect.aspectRatio === 'number'
}


/**
 * ビジュアルエフェクトのデモ
 * キーボードでエフェクトを切り替え
 */
function initVisualEffectsDemo(globe: Globe) {
  const glow = new GlowEffect()
  glow.intensity = 1.0
  glow.threshold = 0.62
  glow.radius = 2.8

  const frostedGlass = new FrostedGlassEffect()
  const ripple = new RippleEffect()

  const warp = new WarpEffect()
  warp.streakLength = 0.55
  warp.saturationBoost = 1.35

  const planetarium = new PlanetariumEffect()

  const blur = new GaussianBlurEffect()
  blur.radius = 3.0

  const bloom = new BloomEffect()
  bloom.blurRadius = 4.5
  bloom.blurBlend = 0.9
  bloom.threshold = 0.58

  const afterimage = new AfterimageEffect()

  const transition = new TransitionEffect()
  transition.progress = 1

  const effects: EffectEntry[] = [
    {
      key: '0',
      name: 'None (エフェクトなし)',
      description: '後処理を無効にした通常表示です。比較用の基準として使ってください。',
      usage: ['数字キーで別のエフェクトへ切り替えます。'],
      effect: null,
    },
    {
      key: '1',
      name: 'Glow (グロー)',
      description: '明るい星や白いマーカーの周囲を柔らかく発光させて、ハイライトを強調する後処理です。形を変えるのではなく、高輝度部分だけににじみを足します。',
      usage: ['背景全体が白っぽく見えるときは threshold が低すぎます。', 'この demo では星やマーカーの縁が少し光る程度に抑えています。'],
      effect: glow,
    },
    {
      key: '2',
      name: 'Frosted Glass (すりガラス)',
      description: 'ガラス越しに見るような揺らぎ付きのぼかしです。時間変化を伴うため連続再描画されます。',
      usage: ['数字キー `2` で切り替えるだけで動作します。'],
      effect: frostedGlass,
    },
    {
      key: '3',
      name: 'Ripple (波紋)',
      description: '水面のような歪みを継続的に与えるエフェクトです。',
      usage: ['数字キー `3` で切り替えるとアニメーションが始まります。'],
      effect: ripple,
    },
    {
      key: '4',
      name: 'Warp (ワープ)',
      description: '中心から外へ光の筋を伸ばし、ハイパースペース風の加速感を出すエフェクトです。',
      usage: ['`4` でワープ効果を選択します。', '`W` で開始/終了し、その間は連続再描画して見た目が途切れないようにしています。'],
      effect: warp,
    },
    {
      key: '5',
      name: 'Planetarium (プラネタリウム)',
      description: '全天を魚眼投影し、プラネタリウム投影に近い見え方に変換します。',
      usage: ['数字キー `5` で切り替えます。'],
      effect: planetarium,
    },
    {
      key: '6',
      name: 'Gaussian Blur (ガウシアンブラー)',
      description: '画面全体を均一にぼかす基礎エフェクトです。',
      usage: ['Glow/Bloom と違い、明るい部分だけではなく画面全体に効きます。'],
      effect: blur,
    },
    {
      key: '7',
      name: 'Bloom (ブルーム)',
      description: 'Glow より広めに高輝度部分をにじませ、発光感を増す合成エフェクトです。星像や白い UI 要素を強調したいときに使います。',
      usage: ['Glow と同じく「明るい部分を強調する」用途で、画面全体を白飛びさせるものではありません。', 'この demo では Glow より少し広めににじむよう調整しています。'],
      effect: bloom,
    },
    {
      key: '8',
      name: 'Afterimage (残像)',
      description: '前フレームを混ぜて残像を出すエフェクトです。',
      usage: ['視点を動かしたときに残像感が分かりやすくなります。'],
      effect: afterimage,
    },
    {
      key: '9',
      name: 'Transition (トランジション)',
      description: '保存したスナップショットと現在のフレームを混ぜて、画面遷移を演出するエフェクトです。',
      usage: ['使い方は「トランジションを設定 → スナップショット取得 → カメラやレイヤーを変更 → progress を 0→1 に進める」です。', '`T` で現在の画面を保存し、次の視点へ遷移する demo を実行します。'],
      effect: transition,
    },
  ]

  const transitionTargets: TransitionTarget[] = [
    {
      name: 'M31 付近',
      coord: SkyCoord.fromDeg(10.6847083, 41.26875),
      fovy: deg2rad(20),
    },
    {
      name: '銀河中心付近',
      coord: SkyCoord.fromDeg(266.41683, -29.00781),
      fovy: deg2rad(28),
    },
    {
      name: '初期視点',
      coord: SkyCoord.fromDeg(0, 0),
      fovy: deg2rad(45),
    },
  ]

  let currentEffectIndex = 0
  let transitionTargetIndex = 0
  let animationFrameId: number | null = null
  let lastTime = performance.now()
  let continuousRefreshCount = 0
  let warpActionInFlight = false
  let transitionAnimationToken = 0

  const effectDetail = createHelpPanel()

  function currentEffect() {
    return effects[currentEffectIndex].effect
  }

  function updateAspectRatio(effect: VisualEffectParams | null) {
    if (effect && hasAspectRatio(effect)) {
      effect.aspectRatio = globe.canvas.aspectRatio
    }
  }

  function syncEffectAspectRatios() {
    for (const { effect } of effects) {
      updateAspectRatio(effect)
    }
  }

  globe.on('resize', () => {
    syncEffectAspectRatios()
    globe.requestRefresh()
  })
  syncEffectAspectRatios()

  function updateEffectDetail() {
    const { name, description, usage } = effects[currentEffectIndex]
    effectDetail.innerHTML = `
      <div class="effect-help-panel__current">現在: ${name}</div>
      <p>${description}</p>
      <ul>
        ${usage.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `
  }

  function restartEffectAnimationLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    const effect = currentEffect()
    if (!effect?.update && continuousRefreshCount === 0) {
      return
    }

    lastTime = performance.now()
    animationFrameId = requestAnimationFrame(animateEffect)
  }

  function animateEffect(now: number) {
    const effect = currentEffect()
    const deltaTime = now - lastTime
    lastTime = now

    if (effect?.update) {
      effect.update(deltaTime)
    }
    if (effect?.update || continuousRefreshCount > 0) {
      globe.requestRefresh()
      animationFrameId = requestAnimationFrame(animateEffect)
      return
    }

    animationFrameId = null
  }

  async function keepRefreshingWhile(task: Promise<void>) {
    continuousRefreshCount += 1
    restartEffectAnimationLoop()
    try {
      await task
    } finally {
      continuousRefreshCount = Math.max(0, continuousRefreshCount - 1)
      restartEffectAnimationLoop()
      globe.requestRefresh()
    }
  }

  function animateTransition(transitionEffect: TransitionEffect, duration: number, afterFinish?: () => void) {
    const token = ++transitionAnimationToken
    const startTime = performance.now()

    const tick = () => {
      if (token !== transitionAnimationToken) {
        return
      }

      const elapsed = performance.now() - startTime
      transitionEffect.progress = Math.min(elapsed / duration, 1)
      globe.requestRefresh()

      if (transitionEffect.progress < 1) {
        requestAnimationFrame(tick)
        return
      }

      afterFinish?.()
    }

    tick()
  }

  function setEffect(index: number) {
    if (index < 0 || index >= effects.length) return

    transitionAnimationToken += 1
    currentEffectIndex = index
    const { name, effect } = effects[index]
    updateAspectRatio(effect)

    if (effect instanceof TransitionEffect) {
      effect.progress = 1
    } else {
      globe.clearVisualEffectSnapshot()
    }

    globe.setVisualEffect(effect)
    restartEffectAnimationLoop()
    updateEffectDetail()
    showNotification(`Effect: ${name}`)
  }

  function showNotification(message: string) {
    const existing = document.querySelector('.effect-notification')
    if (existing) existing.remove()

    const notification = document.createElement('div')
    notification.className = 'effect-notification'
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }

  function createHelpPanel() {
    const panel = document.createElement('aside')
    panel.className = 'effect-help-panel'
    panel.innerHTML = `
      <div class="effect-help-panel__title">Visual Effects</div>
      <p class="effect-help-panel__intro">Glow / Bloom は「明るい部分を発光っぽく強調する」後処理です。壊れた表示ではなく、星像や白いマーカーの見え方を変える用途を想定しています。</p>
      <div class="effect-help-panel__keys">
        ${effects.map((entry) => `<div><kbd>${entry.key}</kbd> ${entry.name}</div>`).join('')}
      </div>
      <div class="effect-help-panel__shortcuts">
        <div><kbd>W</kbd> Warp の開始 / 終了</div>
        <div><kbd>T</kbd> Transition demo（現在の画面を保存して次の視点へ遷移）</div>
      </div>
      <div class="effect-help-panel__detail"></div>
    `
    document.body.appendChild(panel)
    return panel.querySelector('.effect-help-panel__detail') as HTMLDivElement
  }

  async function runWarpDemo() {
    const warpIndex = effects.findIndex((entry) => entry.effect instanceof WarpEffect)
    if (warpIndex < 0 || warpActionInFlight) {
      return
    }

    warpActionInFlight = true
    try {
      if (currentEffectIndex !== warpIndex) {
        setEffect(warpIndex)
      }

      if (warp.warpStrength > 0.01) {
        await keepRefreshingWhile(warp.endWarp(800))
        showNotification('Warp: 終了')
      } else {
        await keepRefreshingWhile(warp.startWarp(1500))
        showNotification('Warp: 開始')
      }
    } finally {
      warpActionInFlight = false
    }
  }

  function runTransitionDemo() {
    const transitionIndex = effects.findIndex((entry) => entry.effect instanceof TransitionEffect)
    if (transitionIndex < 0) {
      return
    }

    if (currentEffectIndex !== transitionIndex) {
      setEffect(transitionIndex)
    }

    const target = transitionTargets[transitionTargetIndex]
    transitionTargetIndex = (transitionTargetIndex + 1) % transitionTargets.length

    const types: TransitionEffect['type'][] = ['dissolve', 'wipe', 'swirl', 'zoom', 'slide']
    const currentTypeIndex = types.indexOf(transition.type)
    transition.type = types[(currentTypeIndex + 1) % types.length]
    transition.progress = 0

    globe.captureVisualEffectSnapshot()
    globe.camera.jumpTo(
      { fovy: target.fovy },
      { coord: target.coord, duration: 0, keepFovy: true },
    )

    showNotification(`Transition: ${transition.type} → ${target.name}`)
    animateTransition(transition, 1800, () => {
      globe.clearVisualEffectSnapshot()
    })
  }

  document.addEventListener('keydown', async (e) => {
    const index = effects.findIndex(ef => ef.key === e.key)
    if (index >= 0) {
      setEffect(index)
      return
    }

    if (e.key === 'w' || e.key === 'W') {
      await runWarpDemo()
      return
    }

    if (e.key === 't' || e.key === 'T') {
      runTransitionDemo()
    }
  })

  updateEffectDetail()
  console.log('Visual Effects Demo initialized. Press 0-9 to switch effects.')
}
