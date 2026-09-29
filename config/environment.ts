import { z } from 'zod';

const environmentSchema = z.object({
    ENV_NAME: z.string().default('local'),
    BASE_URL: z.url().default('https://qaplayground.com/bank/'),
    STANDARD_USER: z.string().min(1).default('standard_user'),
    STANDARD_PASS: z.string().min(1).default('bank_sauce'),
    ADMIN_USER: z.string().min(1).default('admin_user'),
    ADMIN_PASS: z.string().min(1).default('admin_sauce'),
    API_BASE_URL: z.url().default('https://restful-booker.herokuapp.com'),
    API_USERNAME: z.string().min(1).default('admin'),
    API_PASSWORD: z.string().min(1).default('password123'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function getEnvironment(): Environment {
    const result = environmentSchema.safeParse(process.env);

    if (!result.success) {
        const errors = result.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');
        throw new Error(`Invalid test environment configuration: ${errors}`);
    }

    return result.data;
}
