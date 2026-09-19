import logoSieg from "../assets/logo-sieg.png";

function Privacidade() {
  return (
    <div className="pagina-wrapper">
      <header className="header-azul">
        <div className="header-conteudo" style={{ justifyContent: "center" }}>
          <img
            src={logoSieg}
            alt="SIEG Soluções Fiscais Estratégicas"
            style={{ height: "100px", width: "auto", objectFit: "contain" }}
          />
        </div>
      </header>

      <main className="container-principal" style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="card-busca-container"
          style={{ width: "100%", maxWidth: "720px", marginTop: "2rem", lineHeight: 1.6 }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Política de Privacidade</h2>
          <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
            Última atualização: setembro de 2026
          </p>

          <p>
            O SIEG Salas é um sistema interno de reserva de salas de coworking, usado por
            colaboradores da SIEG Soluções Fiscais Estratégicas.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Dados que coletamos</h3>
          <p>
            Ao criar uma conta, coletamos nome, e-mail corporativo, telefone e senha (armazenada
            de forma criptografada). Ao reservar uma sala, registramos a sala escolhida, o dia e
            o horário da reserva.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Integração com o Google Calendar</h3>
          <p>
            Se você optar por conectar sua conta do Google, o SIEG Salas solicita permissão apenas
            para criar eventos no seu Google Calendar (escopo <code>calendar.events</code>),
            exclusivamente para sincronizar as salas que você reservar dentro do próprio sistema.
            Não lemos, alteramos ou excluímos nenhum outro evento da sua agenda, e não acessamos
            nenhuma outra informação da sua conta Google.
          </p>
          <p>
            Você pode revogar esse acesso a qualquer momento diretamente nas configurações da sua
            conta Google, em{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              myaccount.google.com/permissions
            </a>
            .
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Uso dos dados</h3>
          <p>
            Os dados coletados são usados exclusivamente para o funcionamento do sistema de
            reservas (autenticação, gestão de salas e sincronização de agenda) e não são
            compartilhados com terceiros.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Contato</h3>
          <p>
            Dúvidas sobre esta política podem ser enviadas para{" "}
            <a href="mailto:joaov.andrade.dev@gmail.com">joaov.andrade.dev@gmail.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Privacidade;
