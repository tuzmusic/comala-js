import createState from '../src/createState';

describe('createState', () => {
  it('creates a state with a name', () => {
    const actual = createState('In Progress');
    const expected = [
      '{state:In Progress}', '{state}'
    ].join('\n');
    expect(actual).toEqual(expected);
  });
  
  describe('event handlers', () => {
    
    it('can assign event handlers', () => {
      const state = createState('In Progress', {
        onSubmit: 'Submitted',
        onUpdated: 'Updated',
        onApproved: 'Approved',
        onExpired: 'Expired',
        onCompleted: 'Completed',
      });
      const openingTag = [
        '{state:In Progress',
        'submit=Submitted',
        'updated=Updated',
        'approved=Approved',
        'expired=Expired',
        'completed=Completed',
      ].join('|') + '}';
      const expected = [openingTag, '{state}'].join('\n');
      expect(state).toEqual(expected);
    });
    
  });
  
});