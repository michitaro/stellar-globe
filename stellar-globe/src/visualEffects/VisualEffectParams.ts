import { Program } from '../lib/gl-wrapper'


/**
 * ビジュアルエフェクトのパラメータを定義する抽象クラス
 * 各エフェクトはこのクラスを継承して実装する
 */
export abstract class VisualEffectParams {
  /** レンダリングスケール（高解像度でレンダリングしてから縮小） */
  scale = 1
  /** フラグメントシェーダーのソースコードを返す */
  abstract fragShader(): string
  /** シェーダーのuniform変数を設定 */
  abstract setUniforms(program: Program): void
  /** エフェクトの更新処理（アニメーション用） */
  update?(deltaTime: number): void
}

// 後方互換性のためのエイリアス
/** @deprecated VisualEffectParams を使用してください */
export const DistortionParams = VisualEffectParams
