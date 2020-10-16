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
  describe('Inner method: expect/storeRelevantInfo', () => {
    const source = inside('whatever');
    test('type: string', () => {
      source.expect('string');
      expect(chainer.stored).toEqual({ type: 'string', content: 'string' });
    });
  
    test('known tag', () => {
      source.expect({ stateNamed: 'state1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { tagType: 'state', name: 'state1' } });
      source.expect({ approvalNamed: 'approval1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { tagType: 'approval', name: 'approval1' } });
      source.expect({ triggerNamed: 'trigger1' });
      expect(chainer.stored).toEqual({ type: 'known-tag', content: { tagType: 'trigger', name: 'trigger1' } });
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
      ['{state:Name1|param1=value1}',
        '{state}',
        '{state:Name2|param2=value2}',
        '{state}'].join('\n');
  
    inside(source).expect({ stateNamed: 'Name1' }).toHaveParam({ param1: 'value1' });
    // the most important! make sure a param from a later tag doesn't give a false positive
    inside(source).expect({ stateNamed: 'Name1' }).not.toHaveParam({ param2: 'value2' });
    inside(source).expect({ stateNamed: 'Name2' }).not.toHaveParam({ param1: 'value1' });
    inside(source).expect({ stateNamed: 'Name2' }).toHaveParam({ param2: 'value2' });
  });
  
  test('params can not be checked without a tag for context', () => {
    expect.assertions(1); // will fail if assertion isn't made in the catch block
    try {
      inside('whatever').expect({ someParam: 'Name2' }).toHaveParam({ param2: 'value2' });
    } catch (e) {
      expect(true).toEqual(true);
    }
  });
  
  describe('children', () => {
    test('children cannot be checked on self-closing tags', () => {
      expect.assertions(1); // will fail if assertion isn't made in the catch block
      try {
        inside('whatever').expect({ approvalNamed: 'Name2' }).toHaveChild({ tagNamed: 'task' });
      } catch (e) {
        expect(true).toEqual(true);
      }
    });
    
    test('expecting a non-self-closing child fails with some message', () => {
      expect.assertions(1); // will fail if assertion isn't made in the catch block
      try {
        inside('whatever').expect({ stateNamed: 'Name2' }).toHaveChild({ triggerNamed: 'Trigger1' });
      } catch (e) {
        expect(true).toEqual(true);
      }
    });
    
    test('toHaveChild', () => {
      expect.assertions(4)
      const source = [
        '{state:State1}',
        '\t{approval:Approval1}',
        '{state}',
        '{trigger:Trigger1}',
        '\t{task:name=Something}',
        '{trigger}'].join('\n');
      inside(source).expect({ stateNamed: 'State1' }).toHaveChild({ approvalNamed: 'Approval1' });
      inside(source).expect({ stateNamed: 'State1' }).not.toHaveChild({ tagNamed: 'task' });
      inside(source).expect({ triggerNamed: 'Trigger1' }).toHaveChild({ tagNamed: 'task' });
      inside(source).expect({ triggerNamed: 'Trigger1' }).not.toHaveChild({ approvalNamed: 'Approval1' });
    });
    
  });
});
