import { defineConfig } from "cypress";
import {myPlugin} from "./src/plugin";

export default defineConfig({
  e2e: {
    video: false,
    setupNodeEvents(on, config) {
      myPlugin(on, config);
      
      require('@cypress/code-coverage/task')(on, config);
      //on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
      on('file:preprocessor', require('./cypress/plugins/ts-preproc'))
      
      
      return config
    },
  },
});
