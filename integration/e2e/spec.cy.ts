import { checkCov } from 'cy-local/utils';
import { something } from 'cy-local';

describe('empty spec', () => {
  it('passes', () => {
    expect(checkCov('cypress')).eq('cypress');
  });

  it('passes 2', () => {
    something();

    expect(something).not.to.throw();
  });
});
