import PluginEvents = Cypress.PluginEvents;
import PluginConfigOptions = Cypress.PluginConfigOptions;

export const myPlugin = (on: PluginEvents, config: PluginConfigOptions) => {
  process.env.NODE_ENV = 'test'; // for coverage
  config.env['NODE_ENV'] = 'test'; // for coverage
  console.log(config.env);

  return config;
};
