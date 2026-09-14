import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Gera o link para login no Google injetando o userId no state
export function getAuthUrl(userId) {
  const scopes = ["https://www.googleapis.com/auth/calendar.events"];
  
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: userId ? String(userId) : undefined,
  });
}

// Troca o código de autorização temporário pelos tokens de acesso
export async function getTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Cria o evento na agenda do usuário quando a sala for reservada
export async function criarEventoReserva(usuario, dadosReserva) {
  oauth2Client.setCredentials({
    access_token: usuario.googleAccessToken,
    refresh_token: usuario.googleRefreshToken,
    expiry_date: usuario.googleTokenExpiry ? new Date(usuario.googleTokenExpiry).getTime() : undefined,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const evento = {
    summary: `Reserva: Sala ${dadosReserva.salaNome}`,
    description: `Unidade: ${dadosReserva.unidade} | Andar: ${dadosReserva.andar}`,
    start: {
      dateTime: `${dadosReserva.data}T${dadosReserva.horaInicio}:00`,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: `${dadosReserva.data}T${dadosReserva.horaFim}:00`,
      timeZone: "America/Sao_Paulo",
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 30 },
        { method: "email", minutes: 30 },
      ],
    },
  };

  const resposta = await calendar.events.insert({
    calendarId: "primary",
    resource: evento,
  });

  return resposta.data;
}