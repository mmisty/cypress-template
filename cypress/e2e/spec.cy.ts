import {checkCov} from "cy-local/utils";

describe('empty spec', () => {
  it('passes', () => {
    expect(checkCov('cypress')).eq('cypress');
  })
})