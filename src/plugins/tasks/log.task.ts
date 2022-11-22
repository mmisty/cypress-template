import type { TaskTypeWithArgs } from './types';

export const logTask: TaskTypeWithArgs<string> = {
  /**
   * logs to node
   * @param message
   */
  log: (message: string) => {
    console.log(message);

    return null;
  },
};
