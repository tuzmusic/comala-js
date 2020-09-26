import { createTag } from '../src/app';

describe('createTag', () => {
  it('creates a bare tag', () => {
    const res = createTag('workflow');
    expect(res).toEqual(['{workflow}', '{workflow}'].join('\n'));
  });
});
