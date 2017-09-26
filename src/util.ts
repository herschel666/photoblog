export const windowIsDefined = (): boolean => {
  // tslint:disable-next-line no-typeof-undefined
  return typeof window !== 'undefined';
};

export const isDevEnv = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
