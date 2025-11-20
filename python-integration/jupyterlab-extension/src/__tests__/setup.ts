// テスト環境のセットアップ
// 必要に応じてグローバルなモックやポリフィルをここに追加

// JupyterLabのモック
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
