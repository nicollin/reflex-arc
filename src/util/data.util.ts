export const getProcessProp = <T = string>(key: string) => {
  return process.env[key] ? (process.env[key] as unknown as T) : null;
};
