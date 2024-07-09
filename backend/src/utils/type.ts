export type WithoutTimestamp<T> = Omit<T, 'createdAt' | 'updatedAt'>;
