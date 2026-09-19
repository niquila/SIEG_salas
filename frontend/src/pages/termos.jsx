import logoSieg from "../assets/logo-sieg.png";

function Termos() {
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
          <h2 style={{ marginBottom: "1rem" }}>Termos de Uso</h2>
          <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
            Última atualização: setembro de 2026
          </p>

          <p>
            Estes Termos de Uso regulam o acesso e a utilização do SIEG Salas, sistema interno de
            reserva de salas de coworking da SIEG Soluções Fiscais Estratégicas. Ao criar uma
            conta ou usar o sistema, você concorda com estes termos.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>1. Quem pode usar</h3>
          <p>
            O acesso ao SIEG Salas é restrito a colaboradores da SIEG com e-mail corporativo
            institucional (@sieg...). Não é um serviço público, e contas cadastradas com outros
            domínios de e-mail podem ser recusadas ou removidas.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>2. Cadastro e conta</h3>
          <p>
            Você é responsável por manter a confidencialidade da sua senha e por todas as
            atividades realizadas com a sua conta. Informe imediatamente qualquer uso não
            autorizado. Os dados de cadastro devem ser verdadeiros e mantidos atualizados.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>3. Uso das reservas</h3>
          <p>
            As salas devem ser reservadas apenas para uso profissional legítimo dentro do
            expediente da SIEG. Reservas feitas de má-fé, para bloquear salas sem uso real, ou que
            violem as regras internas da empresa (como o horário de bloqueio de almoço) podem ser
            canceladas por um administrador, e o acesso do usuário pode ser suspenso.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>4. Integração com o Google Calendar</h3>
          <p>
            Ao conectar sua conta do Google, você autoriza o SIEG Salas a criar eventos no seu
            Google Calendar correspondentes às suas reservas de sala, conforme descrito na{" "}
            <a href="/privacidade">Política de Privacidade</a>. Essa conexão é opcional e pode ser
            desfeita a qualquer momento nas configurações da sua conta Google.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>5. Disponibilidade do serviço</h3>
          <p>
            O SIEG Salas é oferecido "como está", sem garantia de disponibilidade ininterrupta.
            Podemos alterar, suspender ou descontinuar funcionalidades a qualquer momento, para
            manutenção, melhorias ou por decisão da SIEG.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>6. Encerramento de conta</h3>
          <p>
            Um administrador pode excluir sua conta caso você deixe de ser colaborador da SIEG ou
            viole estes termos. Você também pode solicitar a exclusão da sua própria conta a
            qualquer momento, conforme descrito na Política de Privacidade.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>7. Alterações nestes termos</h3>
          <p>
            Estes termos podem ser atualizados periodicamente. A data da última atualização é
            sempre indicada no topo desta página. O uso continuado do sistema após uma alteração
            representa a aceitação dos novos termos.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>8. Contato</h3>
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a href="mailto:thais.rm.morais@gmail.com">thais.rm.morais@gmail.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Termos;
