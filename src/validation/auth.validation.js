import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(100).trim(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(100).trim(),
});
