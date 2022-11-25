// jest tests to test plugins
import { configureEnv } from '../../src/plugins';
import PluginConfigOptions = Cypress.PluginConfigOptions;

describe('suite', () => {
  it('test', () => {
    configureEnv(() => {
      // nothing
    }, {} as PluginConfigOptions);
    expect(1).toEqual(1);
  });
});
