export const string2number = (value: string | number) =>
  typeof value === 'string' ? parseInt(value) : value
