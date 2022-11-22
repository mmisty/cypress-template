import PluginEvents = Cypress.PluginEvents;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import { tasks } from './tasks';

// this runs in node
export const configureEnv = (on: PluginEvents, config: PluginConfigOptions): PluginConfigOptions => {
  // do setup with events and env, register tasks
  // register plugin events
  on('task', tasks);

  return config;
};
