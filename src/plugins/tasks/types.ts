// should be no functions
export type TaskTypeWithArgs<Arg extends string | number | Record<string, unknown>, Returns = null> = {
  [key: string]: (arg: Arg) => null | Returns | Promise<Returns>;
};
