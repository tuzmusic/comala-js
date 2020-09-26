import { createTag } from '../src/app';

describe('createTag', () => {
  it('creates a bare tag', () => {
    const actual = createTag('workflow');
    expect(actual).toEqual(['{workflow}', '{workflow}'].join('\n'));
  });
  
  it('has the option for a non-closing tag', () => {
    expect(createTag('approval', {}, null, { closing: false })).toEqual('{approval}');
  });
  
  it('can have parameters', () => {
    const actual = createTag('workflow', { name: 'Some Workflow', label: 'some-label' });
    const expected = [
      '{workflow:name=Some Workflow|label=some-label}',
      '{workflow}'
    ].join('\n');
    expect(actual).toEqual(expected);
  });
  
  it('can have an unnamed parameter', () => {
    const actual = createTag('state', { unnamed: 'In Progress', label: 'some-label' });
    const expected = [
      '{state:In Progress|label=some-label}',
      '{state}'
    ].join('\n');
    expect(actual).toEqual(expected);
  });
  
  it('can have a boolean parameter', () => {
    const actual = createTag('approval', { unnamed: 'Review', assignable: true }, null, { closing: false });
    const expected = '{approval:Review|assignable=true}';
    expect(actual).toEqual(expected);
  });
  
  it('can do parameters, and options', () => {
    const actual = createTag('state', { unnamed: 'In Progress', label: 'some-label' }, null, { closing: false });
    const expected = '{state:In Progress|label=some-label}';
    expect(actual).toEqual(expected);
  });
  
  it('can have a text body', () => {
    const str = 'Label added. Editing should be restricted to the creator only.';
    const actual = createTag('set-message', { user: '@user@' }, str);
    const expected = [
      '{set-message:user=@user@}',
      '\tLabel added. Editing should be restricted to the creator only.',
      '{set-message}',
    ].join('\n');
    expect(actual).toEqual(expected);
  });
  
  it('can have a tag body (which is actually just a text body!)', () => {
    const innerTag = createTag('approval', { unnamed: 'Review', assignable: true }, null, { closing: false });
    const outerTag = createTag(
      'state',
      { unnamed: 'In Progress', approved: 'Approved', taskable: true },
      innerTag
    );
    const expected = [
      '{state:In Progress|approved=Approved|taskable=true}',
      '\t{approval:Review|assignable=true}',
      '{state}',
    ].join('\n');
    expect(outerTag).toEqual(expected);
  });
});