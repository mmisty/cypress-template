export const checkCov = (input: string) => {
  if(input === 'cypress'){
    return 'cypress';
  } else {
    return 'jest';
  }
}