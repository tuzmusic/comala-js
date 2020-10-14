import RegexChainer from './RegexChainer';

test('test works', () => {
  const { inside } = new RegexChainer();

  inside('apples and :fruit=bananas').expect('apples').toComeBefore({ fruit: 'bananas' });
  inside('{apples and bananas').expect('bananas').toComeAfter({ tagNamed: 'apples' });
});
