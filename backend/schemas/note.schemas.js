import z from "zod";

/**
 * Zod schema for a single Quill delta operation
 */
export const deltaOpSchema = z.object({
  insert: z.union([z.string(), z.record(z.string(), z.any())]),
  attributes: z.record(z.string(), z.any()).optional(),
});

/**
 * Zod schema for note creation
 * - Accepts string or delta format for content
 * - Transforms string into delta format
 */
export const noteSchema = z
  .object({
    title: z.string().trim().min(1),

    content: z
      .union([
        z.string(),
        z.object({
          ops: z.array(deltaOpSchema),
        }),
      ])
      .transform((val) =>
        typeof val === "string" ? { ops: [{ insert: val }] } : val
      ),

    isStarred: z.boolean().optional(),
  })
  .strict();

/**
 * Zod schema for updating a note
 * - Allows partial updates
 * - Ensures at least one field is provided
 */
export const updateNoteSchema = noteSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

