import requireApproval from '../src/approvals';

describe('requireApproval', () => {
  it('can create an approval', () => {
    const expected =
      '{approval:Review' +
      '|assignable=true' +
      '|selectedapprover=tricia' +
      '|user=jtuzman,szawasky}';
    
    const actual = requireApproval('Review', {
      assignable: true,
      selectedApprover: 'tricia',
      user: ['jtuzman', 'szawasky']
    })
    expect(actual).toEqual(expected);
  });
});