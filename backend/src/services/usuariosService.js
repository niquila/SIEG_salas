import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
/**
 * @param {Object} data - Dados do usuário a ser cadastrado
 * @param {string} data.nome - Nome completo
 * @param {string} data.email - E-mail único
 * @param {string} data.senha - Senha de acesso (em texto puro, será convertida em hash)
 * @param {string} data.telefone - Telefone de contato
 * @returns {Promise<Object>} Objeto do usuário criado no banco de dados
 * @throws {Error} Erro HTTP 409 Conflict se o e-mail já estiver cadastrado
 */

// Cria um novo usuário no banco de dados, após validar unicidade de e-mail
export async function createUsuario(data) {
  const { nome, email, senha, telefone } = data;

  const emailExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (emailExistente) {
    const error = new Error("E-mail já cadastrado.");
    error.status = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  return await prisma.usuario.create({
    data: { nome, email, senha: senhaHash, telefone },
  });
}

// Retorna a lista de todos os usuários cadastrados no banco de dados.
export async function getAllUsuarios() {
  return await prisma.usuario.findMany();
}

// Retorna os dados de um usuário existente pelo seu ID.
export async function getUsuarioById(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return usuario;
}

/**
 * Atualiza os dados de um usuário.
 *
 * 💡 O campo `email` é IGNORADO de propósito, mesmo que venha em `data`.
 * O e-mail é definido só na criação da conta e nunca pode ser alterado depois —
 * isso é reforçado tanto aqui (backend) quanto no schema de validação (Zod)
 * e no frontend (campo desabilitado na tela de perfil).
 */
export async function updateUsuario(id, data) {
  const { nome, senha, telefone } = data; // "email" não é extraído de propósito

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const dataToUpdate = { nome, telefone };
  if (senha) {
    dataToUpdate.senha = await bcrypt.hash(senha, 10);
  }

  return await prisma.usuario.update({
    where: { id },
    data: dataToUpdate,
  });
}

// Remove um usuário existente do banco de dados.
export async function deleteUsuario(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  await prisma.usuario.delete({
    where: { id },
  });

  return { success: true, message: "Usuário deletado com sucesso." };
}