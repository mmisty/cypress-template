// do not change to cy-local
import { myPlugin } from "../../src/plugin";
import PluginEvents = Cypress.PluginEvents;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import {preprocessor} from "./ts-preprocessor";

export const setupPlugins = (on:PluginEvents, config: PluginConfigOptions) => {
  myPlugin(on, config);
  
  require('@cypress/code-coverage/task')(on, config);
  
  on('file:preprocessor', preprocessor())
}