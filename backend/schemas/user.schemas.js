import z from "zod";

export const validateSchema = z.object({
  email: z.string().email(),
  username: z.string().min(5).toLowerCase(),
  password: z.string().min(8).toLowerCase(),
});

export const updateProfileSchema = validateSchema.omit({ password: true });

