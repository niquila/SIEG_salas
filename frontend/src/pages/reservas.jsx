import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getReservas, getSalas, excluirReserva } from "../services/api";
import { getUsuarioLogado, ehAdmin } from "../utils/auth";
import logoSieg from "../assets/logo-sieg.png";

function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [salas, setSalas] = useState([]);
  const usuario = getUsuarioLogado();

  useEffect(() => {
    if (ehAdmin()) {
      navigate("/admin");
      return;
    }
    carregarReservas();
    carregarSalas();
  }, []);

  async function carregarReservas() {
    const todas = await getReservas();
    const minhas = todas.filter((r) => r.idUsuario === usuario?.id);
    setReservas(minhas);
  }

  async function carregarSalas() {
    setSalas(await getSalas());
  }

  function nomeSala(idSala) {
    return salas.find((s) => s.id === idSala)?.nome || `Sala #${idSala}`;
  }

  async function handleCancelar(id) {
    if (!confirm("Deseja cancelar essa reserva?")) return;
    await excluirReserva(id);
    carregarReservas();
  }

  function gerarLinkGoogleCalendar(reserva) {
    const diaCompacto = reserva.dia.slice(0, 10).replace(/-/g, "");
    const inicioCompacto = reserva.horaInicio.replace(":", "") + "00";
    const fimCompacto = reserva.horaFim.replace(":", "") + "00";

    const dataInicio = `${diaCompacto}T${inicioCompacto}`;
    const dataFim = `${diaCompacto}T${fimCompacto}`;

    const titulo = encodeURIComponent(`Reserva: ${nomeSala(reserva.idSala)}`);
    const detalhes = encodeURIComponent("Reserva feita através do sistema SIEG Coworking.");
    const local = encodeURIComponent(nomeSala(reserva.idSala));

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicio}/${dataFim}&details=${detalhes}&location=${local}`;
  }

  return (
    <div className="pagina-wrapper">
      {/* Topo Azul com Navegação */}
      <header className="header-azul">
        <div className="header-conteudo">
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img 
                src={logoSieg} 
                alt="SIEG Soluções Fiscais Estratégicas" 
                style={{ height: "120px", width: "auto", objectFit: "contain" }} 
              />
            </div>
            <nav className="nav-links">
              <Link to="/salas" className="nav-item">Salas</Link>
              <Link to="/reservas" className="nav-item ativo">Minhas Reservas</Link>
            </nav>
          </div>

          <div className="usuario-info">
            <span>Olá, {usuario?.nome || "Usuário"}</span>
            <div 
              className="avatar-icone" 
              onClick={() => navigate("/perfil")}
              style={{ cursor: "pointer" }}
              title="Ir para o Perfil"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container-principal">
        <div className="contador-salas-titulo">
          <h3 style={{ color: "#FFFFFF", textAlign: "center", fontSize: "1.3rem", fontWeight: "700", marginBottom: "1.5rem" }}>
            Sua lista de agendamentos
          </h3>
        </div>

        <div className="lista-salas-horizontal">
          {reservas.map((r) => (
            <div key={r.id} className="card-sala-horizontal-wrapper">
              <div className="card-sala-horizontal">
                <div className="sala-info-esquerda">
                  <h4>{nomeSala(r.idSala)}</h4>
                  <span className="sala-codigo">
                    Data: {r.dia.slice(0, 10).split("-").reverse().join("/")} | {r.horaInicio} às {r.horaFim}
                  </span>
                </div>

                <div className="sala-info-centro" style={{ gap: "1rem" }}>
                  <a
                    href={gerarLinkGoogleCalendar(r)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#0046B8",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Google Calendar
                  </a>
                </div>

                <div className="sala-info-direita">
                  <button
                    onClick={() => handleCancelar(r.id)}
                    style={{
                      backgroundColor: "#FFF5F5",
                      color: "#E53E3E",
                      border: "1px solid #FED7D7",
                      padding: "0.4rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {reservas.length === 0 && (
            <div className="card-busca-container" style={{ textAlign: "center", padding: "2.5rem" }}>
              <p className="sem-resultados">Você ainda não tem nenhuma reserva cadastrada.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reservas;