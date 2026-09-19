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

          <h3 style={{ marginTop: "1.5rem" }}>Quem somos</h3>
          <p>
            O SIEG Salas é operado pela SIEG Soluções Fiscais Estratégicas para uso exclusivo de
            seus colaboradores. Esta política explica quais dados o sistema coleta, como eles são
            usados, armazenados e protegidos, e quais direitos você tem sobre eles.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Dados que coletamos</h3>
          <p>Coletamos os seguintes dados, sempre fornecidos diretamente por você:</p>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>
              <strong>Cadastro:</strong> nome completo, e-mail corporativo (@sieg...), telefone e
              senha de acesso.
            </li>
            <li>
              <strong>Reservas:</strong> sala escolhida, dia e horário reservados, e o usuário
              responsável pela reserva.
            </li>
            <li>
              <strong>Conta Google (opcional):</strong> caso você conecte sua conta, armazenamos
              o token de acesso necessário para criar eventos no seu Google Calendar em seu nome.
            </li>
          </ul>
          <p>
            A senha nunca é armazenada em texto puro: usamos hash criptográfico (bcrypt) antes de
            salvá-la no banco de dados. Não coletamos CPF, dados de pagamento, localização
            precisa, nem qualquer dado sensível além dos listados acima.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Onde os dados ficam armazenados</h3>
          <p>
            Os dados são armazenados em um banco de dados PostgreSQL hospedado pela Supabase, e a
            aplicação roda na infraestrutura da Vercel. Nenhum dado é vendido, alugado ou
            compartilhado com terceiros para fins de marketing ou publicidade.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Por quanto tempo guardamos os dados</h3>
          <p>
            Seus dados de cadastro ficam armazenados enquanto sua conta existir no sistema.
            Reservas passadas são mantidas para fins de histórico interno. Você pode solicitar a
            exclusão da sua conta e de todos os dados associados a qualquer momento pelo contato
            abaixo, ou um administrador pode excluí-la diretamente pelo painel de administração.
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
            reservas: autenticar seu acesso, gerenciar a disponibilidade das salas, exibir suas
            reservas e, se você optar por conectar sua conta Google, sincronizar essas reservas
            com sua agenda pessoal. Não usamos seus dados para publicidade, não fazemos
            perfilamento de comportamento e não compartilhamos dados com terceiros, exceto os
            provedores de infraestrutura citados acima, estritamente para operar o serviço.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Seus direitos</h3>
          <p>
            Você pode, a qualquer momento: consultar os dados da sua conta na tela de Perfil,
            corrigir nome e telefone diretamente por lá, revogar o acesso ao Google Calendar nas
            configurações da sua conta Google, e solicitar a exclusão completa da sua conta e dos
            dados associados entrando em contato pelo e-mail abaixo.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Menores de idade</h3>
          <p>
            O SIEG Salas é uma ferramenta corporativa destinada a colaboradores maiores de idade
            da SIEG e não é direcionada a crianças.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Alterações nesta política</h3>
          <p>
            Esta política pode ser atualizada periodicamente para refletir mudanças no sistema. A
            data da última atualização é sempre indicada no topo desta página.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Contato</h3>
          <p>
            Dúvidas sobre esta política, ou solicitações relacionadas aos seus dados, podem ser
            enviadas para{" "}
            <a href="mailto:thais.rm.morais@gmail.com">thais.rm.morais@gmail.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Privacidade;
