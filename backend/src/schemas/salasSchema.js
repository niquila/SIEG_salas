import { z } from "zod";
 
/**
 * SCHEMA DE SALAS (Sala Schema)
 *
 * Define as regras de validação para cadastro e atualização de salas de coworking.
 */
export const createSalaSchema = z.object({
  nome: z
    .string({ required_error: "O campo nome é obrigatório." })
    .min(2, "O nome deve ter pelo menos 2 caracteres."),
 
  capacidade: z.coerce
    .number({ required_error: "O campo capacidade é obrigatório." })
    .int("A capacidade deve ser um número inteiro.")
    .positive("A capacidade deve ser maior que zero."),
 
  descricao: z.string().optional().nullable(),

  unidade: z.string({ required_error: "O campo unidade é obrigatório." }),

  andar: z.string({ required_error: "O campo andar é obrigatório." }),

  status: z.string().optional().nullable(),

  bloqueioAlmoco: z.boolean().optional().default(false),
});
 
export const updateSalaSchema = createSalaSchema.partial();