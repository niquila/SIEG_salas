import { z } from "zod";

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/; // formato HH:mm, 24 horas

const reservaBaseSchema = z.object({
  idUsuario: z.coerce
    .number({ required_error: "O campo ID do usuário é obrigatório." })
    .int("O ID do usuário deve ser um número inteiro.")
    .positive("O ID do usuário deve ser um número positivo."),

  idSala: z.coerce
    .number({ required_error: "O campo ID da sala é obrigatório." })
    .int("O ID da sala deve ser um número inteiro.")
    .positive("O ID da sala deve ser um número positivo."),

  dia: z
    .string({ required_error: "O campo dia é obrigatório." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A data informada no campo 'dia' é inválida.")
    .refine((val) => {
      const [ano, mes, dia] = val.split("-").map(Number);
      const data = new Date(ano, mes - 1, dia);
      return data.getFullYear() === ano && data.getMonth() + 1 === mes && data.getDate() === dia;
    }, { message: "A data informada no campo 'dia' é inválida." }),

  horaInicio: z
    .string({ required_error: "O horário de início é obrigatório." })
    .regex(horaRegex, "O horário de início deve estar no formato HH:mm."),

  horaFim: z
    .string({ required_error: "O horário de término é obrigatório." })
    .regex(horaRegex, "O horário de término deve estar no formato HH:mm."),
});

export const createReservaSchema = reservaBaseSchema.refine(
  (data) => data.horaFim > data.horaInicio,
  {
    message: "O horário de término deve ser depois do horário de início.",
    path: ["horaFim"],
  }
);

export const updateReservaSchema = reservaBaseSchema.partial().refine(
  (data) => !data.horaInicio || !data.horaFim || data.horaFim > data.horaInicio,
  {
    message: "O horário de término deve ser depois do horário de início.",
    path: ["horaFim"],
  }
);