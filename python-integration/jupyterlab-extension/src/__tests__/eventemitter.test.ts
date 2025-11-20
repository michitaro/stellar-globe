import { EventEmitter } from '../eventemitter';

describe('EventEmitter', () => {
  test('should emit and receive events', () => {
    const emitter = EventEmitter();
    const handler = jest.fn();
    
    emitter.on(handler);
    emitter.emit();
    
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple listeners', () => {
    const emitter = EventEmitter();
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on(handler1);
    emitter.on(handler2);
    emitter.emit();
    
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test('should call once listeners only once', () => {
    const emitter = EventEmitter({ once: true });
    const handler = jest.fn();
    
    emitter.on(handler);
    emitter.emit();
    emitter.emit();
    
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should support off to remove listener', () => {
    const emitter = EventEmitter();
    const handler = jest.fn();
    
    const off = emitter.on(handler);
    off();
    emitter.emit();
    
    expect(handler).not.toHaveBeenCalled();
  });
});
