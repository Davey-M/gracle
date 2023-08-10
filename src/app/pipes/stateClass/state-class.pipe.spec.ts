import { StateClassPipe } from './state-class.pipe';

describe('StateClassPipe', () => {
  it('create an instance', () => {
    const pipe = new StateClassPipe();
    expect(pipe).toBeTruthy();
  });
});
