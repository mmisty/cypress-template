const doNothing = () => {
  // do nothing
};

export const consoleMock = {
  log: jest.spyOn(console, 'log').mockImplementation(doNothing),
  warn: jest.spyOn(console, 'warn').mockImplementation(doNothing),
  err: jest.spyOn(console, 'error').mockImplementation(doNothing),
};
