import * as googleService from "../services/googleCalendarService.js";
import { prisma } from "../config/prisma.js";

// Redireciona o usuário para a tela de login do Google, capturando o userId da query
export function redirectToGoogle(req, res) {
  const { userId } = req.query; // Ex: /auth/google?userId=1
  
  if (!userId) {
    return res.status(400).json({ error: "Parâmetro 'userId' é obrigatório para iniciar a autenticação. Ex: /auth/google?userId=1" });
  }

  const authUrl = googleService.getAuthUrl(userId);
  return res.redirect(authUrl);
}

// Recebe o callback do Google após a autorização
export async function handleGoogleCallback(req, res) {
  try {
    const { code, state } = req.query; // O 'state' contém o userId que passamos na URL inicial
    
    if (!code) {
      return res.status(400).json({ error: "Código de autorização não fornecido pelo Google." });
    }

    if (!state) {
      return res.status(400).json({ error: "ID do usuário não encontrado no estado da autenticação." });
    }

    const tokens = await googleService.getTokens(code);
    const tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Atualiza exatamente o usuário cujo ID veio salvo no 'state'
    await prisma.usuario.update({
      where: { id: Number(state) },
      data: {
        googleAccessToken: tokens.access_token || null,
        googleRefreshToken: tokens.refresh_token || undefined,
        googleTokenExpiry: tokenExpiry,
      },
    });
    
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/perfil?google=conectado`);
  } catch (error) {
    console.error("Erro no callback do Google:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/perfil?google=erro`);
  }
}