import { configureEnv } from '../../plugins';

// jest tests to test plugins

describe('suite', () => {
  it('test', () => {
    configureEnv(() => {
      // nothing
    }, {});
    expect(1).toEqual(1);
  });
});
