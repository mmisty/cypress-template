import { logTask } from '../../../plugins/tasks/log.task';
import { consoleMock } from '../../mocks/console-mock';

describe('suite', () => {
  it('test', () => {
    logTask('message here');

    expect(consoleMock.log.mock.calls[0]).toEqual(['message here']);
  });
});
