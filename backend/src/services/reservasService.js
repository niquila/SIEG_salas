import { prisma } from "../config/prisma.js";
/**
 * @param {Object} params
 * @param {number} params.idSala - ID da sala
 * @param {string|Date} params.dia - Dia da reserva
 * @param {string} params.horaInicio - Horário de início (formato HH:mm)
 * @param {string} params.horaFim - Horário de término (formato HH:mm)
 * @param {number} [params.idIgnorar] - ID da reserva a ignorar na checagem (usado no update)
 * @throws {Error} Erro HTTP 409 Conflict se já existir uma reserva com sobreposição de horário
 */

// Função auxiliar para validar se os horários terminam em :00 ou :30
function validarHorarioFechado(horaInicio, horaFim) {
  const [hInicio, mInicio] = horaInicio.split(':').map(Number);
  const [hFim, mFim] = horaFim.split(':').map(Number);

  const minutosValidos = [0, 30];

  if (!minutosValidos.includes(mInicio) || !minutosValidos.includes(mFim)) {
    const error = new Error("As reservas devem ser feitas em horários fechados (terminados em :00 ou :30).");
    error.status = 400;
    error.code = "INVALID_TIME_SLOT";
    throw error;
  }
}

// Função auxiliar para verificar se já existe uma reserva com horário sobreposto na mesma sala e dia
async function verificarDisponibilidade({ idSala, dia, horaInicio, horaFim, idIgnorar }) {
  const reservasDoDia = await prisma.reserva.findMany({
    where: {
      idSala,
      dia: new Date(dia),
      ...(idIgnorar && { id: { not: idIgnorar } }),
    },
  });

  // Duas reservas conflitam se: início A < fim B  E  fim A > início B
  const conflito = reservasDoDia.find(
    (r) => horaInicio < r.horaFim && horaFim > r.horaInicio
  );

  if (conflito) {
    const error = new Error(
      `Esta sala já está reservada das ${conflito.horaInicio} às ${conflito.horaFim} nesse dia.`
    );
    error.status = 409;
    error.code = "RESERVATION_CONFLICT";
    throw error;
  }
}

// Cria uma nova reserva no banco de dados, após verificar disponibilidade e horários fechados
export async function createReserva(data) {
  const { dia, horaInicio, horaFim, idUsuario, idSala } = data;

  validarHorarioFechado(horaInicio, horaFim);
  await verificarDisponibilidade({ idSala, dia, horaInicio, horaFim });

  return await prisma.reserva.create({
    data: { dia: new Date(dia), horaInicio, horaFim, idUsuario, idSala },
    include: {
      sala: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    },
  });
}

// Retorna a lista de todas as reservas no banco de dados com os dados da sala e do usuário.
export async function getAllReservas() {
  return await prisma.reserva.findMany({
    include: {
      sala: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    },
  });
}

// Retorna uma única reserva pelo ID com os dados da sala e do usuário.
export async function getReservaById(id) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: {
      sala: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    },
  });

  if (!reserva) {
    const error = new Error("reserva não encontrada.");
    error.status = 404;
    error.code = "RESERVATION_NOT_FOUND";
    throw error;
  }

  return reserva;
}

// Remove uma reserva existente no banco de dados, após verificar se ela existe.
export async function deleteReserva(id) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
  });

  if (!reserva) {
    const error = new Error("reserva não encontrada.");
    error.status = 404;
    error.code = "RESERVATION_NOT_FOUND";
    throw error;
  }

  await prisma.reserva.delete({
    where: { id },
  });

  return { success: true, message: "reserva deletada com sucesso." };
}