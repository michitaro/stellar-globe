import { cropCanvasToAspectRatio } from '../cropCanvasToAspectRatio';

describe('cropCanvasToAspectRatio', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d')!;
    
    // キャンバスに何か描画
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 800, 600);
  });

  test('should crop to specified aspect ratio (wider)', () => {
    const result = cropCanvasToAspectRatio(canvas, 2.0); // 2:1 aspect ratio
    
    expect(result).toBeInstanceOf(HTMLCanvasElement);
    expect(result.width / result.height).toBeCloseTo(2.0);
  });

  test('should crop to specified aspect ratio (taller)', () => {
    const result = cropCanvasToAspectRatio(canvas, 0.5); // 1:2 aspect ratio
    
    expect(result).toBeInstanceOf(HTMLCanvasElement);
    expect(result.width / result.height).toBeCloseTo(0.5);
  });

  test('should handle square aspect ratio', () => {
    const result = cropCanvasToAspectRatio(canvas, 1.0);
    
    expect(result).toBeInstanceOf(HTMLCanvasElement);
    expect(result.width).toBe(result.height);
  });
});
