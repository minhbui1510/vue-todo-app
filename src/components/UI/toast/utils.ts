export const uid = (): string => Math.random().toString(36).slice(2);

export const toArray = <T>(v?: T | T[]): T[] => (Array.isArray(v) ? v : v ? [v] : []);

