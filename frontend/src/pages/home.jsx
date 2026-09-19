import { Link } from "react-router-dom";
import logoSieg from "../assets/logo-sieg.png";

function Home() {
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
          <h1 style={{ marginBottom: "0.5rem" }}>SIEG Salas</h1>
          <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
            Sistema interno de reserva de salas de coworking da SIEG Soluções Fiscais
            Estratégicas.
          </p>

          <p>
            O SIEG Salas permite que colaboradores da SIEG consultem a disponibilidade das salas
            de reunião, cabines e espaços de trabalho compartilhado, façam reservas por dia e
            horário, e acompanhem seus agendamentos em um só lugar.
          </p>

          <p>
            Quem conectar sua conta do Google também recebe automaticamente um evento no Google
            Calendar para cada sala reservada, com o horário e o local já preenchidos.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Quem pode usar</h3>
          <p>
            O acesso é restrito a colaboradores com e-mail corporativo SIEG. Não é um serviço
            aberto ao público.
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <Link to="/login" className="btn-buscar-salas" style={{ textDecoration: "none", textAlign: "center" }}>
              Entrar / Criar conta
            </Link>
            <Link
              to="/privacidade"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#0046B8",
                fontWeight: "600",
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
