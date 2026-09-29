import { z } from 'zod';

const requiredValue = z.string().trim().min(1).refine(
  (value) => value !== 'replace-me',
  'replace the placeholder with an environment-specific value',
);

const environmentSchema = z.object({
  ENV_NAME: z.string().trim().min(1).default('local'),
  BASE_URL: z.url(),
  API_BASE_URL: z.url(),
  API_USERNAME: requiredValue,
  API_PASSWORD: requiredValue,
  STANDARD_USER: requiredValue,
  STANDARD_PASS: requiredValue,
  ADMIN_USER: requiredValue,
  ADMIN_PASS: requiredValue,
});

export type Environment = z.infer<typeof environmentSchema>;

export function getEnvironment(): Environment {
  const result = environmentSchema.safeParse(process.env);
  if (result.success) return result.data;

  const details = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid test environment: ${details}`);
}
