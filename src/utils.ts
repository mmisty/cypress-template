export const checkCov = (input: string) => {
  if(input === 'cypress'){
    return 'cypress';
  }
  
  return 'jest';
}