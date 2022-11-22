import PluginEvents = Cypress.PluginEvents;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import { tasks } from './tasks';
import { webpackPreprocessor } from './webpack-processing';

export { configureWebpack } from './webpack-processing';

// this runs in node
export const configureEnv = (on: PluginEvents, config: PluginConfigOptions): PluginConfigOptions => {
  // do setup with events and env, register tasks
  // register plugin events
  on('task', tasks);
  on('file:preprocessor', webpackPreprocessor());

  return config;
};
