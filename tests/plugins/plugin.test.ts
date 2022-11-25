import {myPlugin} from "../../src/plugin";
import {consoleMock} from "../mocks/console-mock";

describe('plugins', () => {
  it('myPlugin', () => {
    consoleMock();
    const conf = myPlugin(() => {}, { env:{} } as Cypress.PluginConfigOptions);
    
    expect(conf.env).toEqual( {"NODE_ENV": "test"})
  });
});
