import { z } from "zod";

// Validação do corpo da requisição para criação e atualização de usuários

const emailSchema = z
  .string({ required_error: "O campo email é obrigatório." })
  .email("E-mail com formato inválido.")
  .refine((val) => val.toLowerCase().includes("@sieg"), {
    message: "Apenas e-mails institucionais (@sieg...) podem se cadastrar.",
  });

export const createUsuarioSchema = z.object({
  nome: z
    .string({ required_error: "O campo nome é obrigatório." })
    .min(2, "O nome deve ter pelo menos 2 caracteres."),

  email: emailSchema,

  senha: z
    .string({ required_error: "O campo senha é obrigatório." })
    .min(1, "O campo senha é obrigatório."),

  telefone: z
    .string({ required_error: "O campo telefone é obrigatório." })
    .min(1, "O campo telefone é obrigatório."),
});

export const updateUsuarioSchema = z
  .object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    telefone: z.string().min(1, "O campo telefone é obrigatório."),
    senha: z.string().min(1, "A senha não pode ficar em branco."),
  })
  .partial();