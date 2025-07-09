const defaultIgnorePatterns: string[] = [
  'node_modules',
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/.turbo/**',
  '**/.output/**',
  '**/out/**',
  '**/coverage/**',
  '**/.git/**',
  '**/.cache/**',
  '**/__tests__/**',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/*.d.ts',
  '**/storybook/**',
  '**/mock/**',
  '**/mocks/**',
];

export default defaultIgnorePatterns;
