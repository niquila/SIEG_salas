import prisma from "../config/prisma.js";

// Cria uma nova sala no banco de dados
export async function createSala(data) {
  const { nome, andar, unidade, capacidade, descricao, status, bloqueioAlmoco } = data;

  return await prisma.sala.create({
    data: { 
      nome, 
      andar, 
      unidade, 
      capacidade, 
      descricao,
      status: status || "disponivel",
      bloqueioAlmoco: bloqueioAlmoco ?? false,
    },
  });
}

// Retorna a lista de todas as salas no banco de dados.
export async function getAllSalas() {
  return await prisma.sala.findMany();
}

// Retorna uma única sala pelo ID.
export async function getSalaById(id) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404;
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  return sala;
}

// Atualiza os dados de uma sala existente no banco de dados, após verificar se ela existe.
export async function updateSala(id, data) {
  const { nome, andar, unidade, capacidade, descricao, status, bloqueioAlmoco } = data;

  const sala = await prisma.sala.findUnique({
    where: { id },
  });
  
  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404;
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  return await prisma.sala.update({
    where: { id },
    data: { 
      nome, 
      andar, 
      unidade, 
      capacidade, 
      descricao,
      ...(status !== undefined && { status }),
      ...(bloqueioAlmoco !== undefined && { bloqueioAlmoco })
    },
  });
}

// Deleta uma sala existente no banco de dados, após verificar se ela existe.
export async function deleteSala(id) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new Error("sala não encontrada.");
    error.status = 404;
    error.code = "ROOM_NOT_FOUND";
    throw error;
  }

  await prisma.sala.delete({
    where: { id },
  });

  return { success: true, message: "sala deletada com sucesso." };
}