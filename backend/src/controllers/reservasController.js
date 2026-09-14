import * as reservasService from "../services/reservasService.js";
import * as googleCalendarService from "../services/googleCalendarService.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function create(req, res, next) {
  try {
    const { idUsuario, idSala, horaInicio, horaFim } = req.body;

    // 1. Verifica se o usuário existe e se já conectou o Google Calendar
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(idUsuario) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Regra: Se exigimos que o calendário esteja conectado para reservar
    if (!usuario.googleRefreshToken) {
      return res.status(400).json({ 
        error: "Você precisa conectar sua conta do Google Calendar antes de realizar uma reserva.",
        authUrl: "/auth/google" // Opcional: já manda o link para ele conectar
      });
    }

    // 2. Busca a sala antecipadamente para validar dados e checar o bloqueio de almoço
    const sala = await prisma.sala.findUnique({
      where: { id: Number(idSala) },
    });

    if (!sala) {
      return res.status(404).json({ error: "Sala não encontrada." });
    }

    // === Validação de Bloqueio de Almoço (12:00 às 13:00) ===
    if (sala.bloqueioAlmoco) {
      const almocoInicio = "12:00";
      const almocoFim = "13:00";

      // Verifica se o horário da reserva cruza o intervalo das 12:00 às 13:00
      if (horaInicio < almocoFim && horaFim > almocoInicio) {
        return res.status(400).json({
          error: "Esta sala possui bloqueio de reservas entre 12:00 e 13:00 (horário de almoço)."
        });
      }
    }
    // ========================================================

    // 3. Cria a reserva no banco de dados se passar em todas as validações
    const novaReserva = await reservasService.createReserva(req.body);

    const dataFormatada = new Date(novaReserva.dia).toISOString().split('T')[0];

    const dadosReservaGoogle = {
      salaNome: sala ? sala.nome : 'Sala',
      unidade: sala?.unidade || 'Principal',
      andar: sala?.andar || 'Térreo',
      data: dataFormatada,
      horaInicio: novaReserva.horaInicio,
      horaFim: novaReserva.horaFim,
    };

    // 4. Dispara a criação do evento no Google Calendar
    await googleCalendarService.criarEventoReserva(usuario, dadosReservaGoogle);

    return res.status(201).json({
      message: "Reserva criada e sincronizada com o Google Calendar com sucesso!",
      reserva: novaReserva
    });

  } catch (err) {
    console.error("Erro ao criar reserva com sincronização:", err);
    next(err);
  }
}

// Retorna todas as reservas cadastradas no sistema.
export async function getAll(req, res, next) {
  try {
    const reservas = await reservasService.getAllReservas();
    return res.json(reservas);
  } catch (err) {
    next(err);
  }
}

// Busca uma reserva pelo seu ID.
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const reserva = await reservasService.getReservaById(id);
    return res.json(reserva);
  } catch (err) {
    next(err);
  }
}

// Exclui uma reserva do sistema pelo seu ID.
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await reservasService.deleteReserva(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}