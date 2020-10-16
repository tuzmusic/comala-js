import RegexChainer from './RegexChainer';

const chainer = new RegexChainer();
const { inside } = chainer;
/*
test('test works', () => {
  inside('apples and :fruit=bananas').expect('apples').toComeBefore({ fruit: 'bananas' });
  inside('{apples and bananas').expect('bananas').toComeAfter({ tagNamed: 'apples' });
});
*/

describe('real tag testing', () => {
  describe('expect/storeRelevantInfo', () => {
    const source = inside('whatever');
    test('type: string', () => {
      source.expect('string');
      expect(chainer.stored).toEqual({ type: 'string', content: 'string' });
    });
  
    test('known tag', () => {
      source.expect({ stateNamed: 'state1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { state: { name: 'state1' } } });
      source.expect({ approvalNamed: 'approval1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { approval: { name: 'approval1' } } });
      source.expect({ triggerNamed: 'trigger1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { trigger: { name: 'trigger1' } } });
    });
    
    test('unknown tag', () => {
      source.expect({ tagNamed: 'task' });
      expect(chainer.stored).toEqual({ type: 'unknown-tag-name', content: 'task' });
    });
    
    test('param', () => {
      source.expect({ name: 'something' });
      expect(chainer.stored).toEqual({ type: 'param', content: { name: 'something' } });
    });
  });
  
  test('params', () => {
    const source =
      '{state:Name1|param1=value1}' +
      '{state}' +
      '{state:Name2|param2=value2}' +
      '{state}';
    
    inside(source).expect({ stateNamed: 'Name1' }).toHaveParam({ param1: 'value1' });
    // the most important! make sure a param from a later tag doesn't give a false positive
    inside(source).expect({ stateNamed: 'Name1' }).not.toHaveParam({ param2: 'value2' });
    inside(source).expect({ stateNamed: 'Name2' }).not.toHaveParam({ param1: 'value1' });
    inside(source).expect({ stateNamed: 'Name2' }).toHaveParam({ param2: 'value2' });
  });
  
  // describe('children', () => {
  //
  // });
});
