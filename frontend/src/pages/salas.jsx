import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalas, getReservas, criarReserva, excluirReserva } from "../services/api";
import { getUsuarioLogado, ehAdmin } from "../utils/auth";
import Calendario from "../components/Calendario";
import logoSieg from "../assets/logo-sieg.png";

function Salas() {
  const navigate = useNavigate();
  const [visao, setVisao] = useState("disponiveis");
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [erro, setErro] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Pega a data de hoje no formato YYYY-MM-DD para bloquear dias passados.
  // Usa o fuso local (e não toISOString, que converte para UTC): à noite o UTC
  // já virou o dia seguinte, e o app tratava amanhã como se fosse hoje.
  const agoraHoje = new Date();
  const dataHoje = `${agoraHoje.getFullYear()}-${String(agoraHoje.getMonth() + 1).padStart(2, "0")}-${String(agoraHoje.getDate()).padStart(2, "0")}`;

  // Filtros de busca
  const [filtroDia, setFiltroDia] = useState(dataHoje);
  const [filtroInicio, setFiltroInicio] = useState("14:00");
  const [filtroFim, setFiltroFim] = useState("15:00");
  const [unidade, setUnidade] = useState("TODAS");

  // Reserva
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const usuario = getUsuarioLogado();

  useEffect(() => {
    if (ehAdmin()) {
      navigate("/admin");
      return;
    }
    inicializarDados();
  }, []);

  // Função para carregar e limpar automaticamente reservas expiradas
  async function inicializarDados() {
    try {
      const salasCarregadas = await getSalas();
      const reservasCarregadas = await getReservas();
      
      setSalas(salasCarregadas);

      const agora = new Date();
      let houveExclusao = false;

      for (const reserva of reservasCarregadas) {
        if (!reserva.dia || !reserva.horaFim) continue;

        const dataFimStr = `${reserva.dia.slice(0, 10)}T${reserva.horaFim}:00`;
        const dataFimReserva = new Date(dataFimStr);

        if (agora > dataFimReserva) {
          try {
            await excluirReserva(reserva.id);
            houveExclusao = true;
          } catch (err) {
            console.error(`Erro ao excluir automaticamente a reserva ${reserva.id}:`, err);
          }
        }
      }

      if (houveExclusao) {
        const reservasAtualizadas = await getReservas();
        setReservas(reservasAtualizadas);
      } else {
        setReservas(reservasCarregadas);
      }

    } catch (err) {
      setErro(err.message);
    }
  }

  async function carregarSalas() {
    try {
      setSalas(await getSalas());
    } catch (err) {
      setErro(err.message);
    }
  }

  async function carregarReservas() {
    try {
      setReservas(await getReservas());
    } catch (err) {
      console.error("Não foi possível carregar as reservas existentes:", err);
    }
  }

  function horariosSeSobrepoe(inicioA, fimA, inicioB, fimB) {
    return inicioA < fimB && fimA > inicioB;
  }

  function salaAtendeFiltros(sala) {
    if (unidade !== "TODAS" && sala.unidade) {
      const normalizar = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
      if (normalizar(sala.unidade) !== normalizar(unidade)) return false;
    } else if (unidade !== "TODAS" && !sala.unidade) {
      return false;
    }

    if (!filtroDia || !filtroInicio || !filtroFim) return true;

    const reservasDaSalaNoDia = reservas.filter(
      (r) => r.idSala === sala.id && r.dia.slice(0, 10) === filtroDia
    );
    return !reservasDaSalaNoDia.some((r) =>
      horariosSeSobrepoe(filtroInicio, filtroFim, r.horaInicio, r.horaFim)
    );
  }

  const salasFiltradas = salas.filter((s) => salaAtendeFiltros(s));
  const minhasReservas = reservas.filter((r) => r.idUsuario === usuario?.id);

  function nomeSala(idSala) {
    return salas.find((s) => s.id === idSala)?.nome || `Sala #${idSala}`;
  }

  async function handleCancelarReserva(id) {
    if (!confirm("Deseja cancelar essa reserva?")) return;
    await excluirReserva(id);
    carregarReservas();
  }

  function handleAbrirFormulario(sala) {
    const statusStr = String(sala.status || "").toLowerCase().trim();
    const estaIndisponivel = 
      statusStr === "indisponivel" || 
      statusStr === "unavailable" ||
      sala.disponivel === false || 
      sala.ativo === false;

    if (estaIndisponivel) {
      alert("Esta sala está indisponível para reservas no momento.");
      return;
    }

    const novoEstadoSala = salaSelecionada === sala.id ? null : sala.id;
    setSalaSelecionada(novoEstadoSala);
    
    if (novoEstadoSala) {
      setDia(filtroDia || dataHoje);
      const hInicioInicial = filtroInicio && filtroInicio >= "08:00" && filtroInicio <= "17:30" ? filtroInicio : "08:00";
      setHoraInicio(hInicioInicial);
      setHoraFim(calcularProximoHorario(hInicioInicial));
    } else {
      setDia("");
      setHoraInicio("");
      setHoraFim("");
    }
  }

  // Função auxiliar para somar 30 minutos a um horário no formato "HH:MM"
  function calcularProximoHorario(horarioStr) {
    if (!horarioStr) return "";
    const [h, m] = horarioStr.split(":").map(Number);
    let totalMinutos = h * 60 + m + 30;
    if (totalMinutos > 18 * 60) totalMinutos = 18 * 60; // Limite máximo 18:00
    const novaH = Math.floor(totalMinutos / 60).toString().padStart(2, "0");
    const novoM = (totalMinutos % 60).toString().padStart(2, "0");
    return `${novaH}:${novoM}`;
  }

  function handleMudarInicio(e) {
    const novoInicio = e.target.value;
    setHoraInicio(novoInicio);
    if (novoInicio) {
      const sugestaoFim = calcularProximoHorario(novoInicio);
      setHoraFim(sugestaoFim);
    } else {
      setHoraFim("");
    }
  }

  // Gera os horários válidos apenas das 08:00 às 18:00 (intervalos de 30 min)
  function gerarHorarios(limiteFim = "18:00") {
    const horarios = [];
    for (let i = 16; i <= 36; i++) { // 16 * 30min = 480min (08:00) até 36 * 30min = 1080min (18:00)
      const hora = Math.floor(i / 2).toString().padStart(2, '0');
      const minuto = i % 2 === 0 ? '00' : '30';
      const horarioStr = `${hora}:${minuto}`;
      if (horarioStr <= limiteFim) {
        horarios.push(horarioStr);
      }
    }
    return horarios;
  }

  async function handleConfirmarReserva(e) {
    e.preventDefault();

    if (dia < dataHoje) {
      alert("Você não pode realizar reservas para dias que já passaram!");
      return;
    }

    // Validação estrita do horário das 08:00 às 18:00
    if (horaInicio < "08:00" || horaFim > "18:00") {
      alert("As reservas só podem ser feitas entre 08:00 e 18:00!");
      return;
    }

    if (dia === dataHoje && horaInicio) {
      const agora = new Date();
      const horaAtual = agora.getHours();
      const minutoAtual = agora.getMinutes();
      const [hInicio, mInicio] = horaInicio.split(":").map(Number);

      if (hInicio < horaAtual || (hInicio === horaAtual && mInicio <= minutoAtual)) {
        alert("Você não pode selecionar um horário que já passou para hoje!");
        return;
      }
    }

    if (horaInicio && horaFim && horaFim <= horaInicio) {
      alert("O horário de término deve ser posterior ao horário de início!");
      return;
    }

    const salaAtual = salas.find((s) => s.id === salaSelecionada);
    if (salaAtual && salaAtual.bloqueioAlmoco) {
      const almocoInicio = "12:00";
      const almocoFim = "13:00";

      if (horaInicio < almocoFim && horaFim > almocoInicio) {
        alert("Esta sala possui bloqueio de reservas entre 12:00 e 13:00 (horário de almoço).");
        return;
      }
    }

    try {
      await criarReserva({
        idSala: salaSelecionada,
        idUsuario: usuario?.id,
        dia,
        horaInicio,
        horaFim,
      });
      alert("Reserva criada com sucesso!");
      setSalaSelecionada(null);
      setDia("");
      setHoraInicio("");
      setHoraFim("");
      carregarReservas();
    } catch (err) {
      alert(err.message.toLowerCase().includes("data") ? "Formato de data inválido." : err.message);
    }
  }

  return (
    <div className="pagina-wrapper">
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

      <main className="container-principal">
        <div className="grid-acoes">
          <div
            className={`card-acao ${visao === "disponiveis" ? "ativo" : ""}`}
            onClick={() => setVisao("disponiveis")}
          >
            <div className="icone-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0046B8" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div>
              <h3>Salas</h3>
              <p>Consulte salas disponíveis por data e horário</p>
            </div>
          </div>

          <div
            className={`card-acao ${visao === "calendario" ? "ativo" : ""}`}
            onClick={() => setVisao("calendario")}
          >
            <div className="icone-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0046B8" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <h3>Calendário</h3>
              <p>Veja a ocupação das salas</p>
            </div>
          </div>
        </div>
        
        <div className="contador-salas-titulo">
          <h3>Minhas reservas</h3>
        </div>

        <div className="lista-salas-horizontal" style={{ marginBottom: "2rem" }}>
          {minhasReservas.map((r) => (
            <div key={r.id} className="card-sala-horizontal-wrapper">
              <div className="card-sala-horizontal">
                <div className="sala-info-esquerda">
                  <h4>{nomeSala(r.idSala)}</h4>
                  <span className="sala-codigo">
                    Data: {r.dia.slice(0, 10).split("-").reverse().join("/")} | {r.horaInicio} às {r.horaFim}
                  </span>
                </div>

                <div className="sala-info-centro"></div>

                <div className="sala-info-direita">
                  <button
                    onClick={() => handleCancelarReserva(r.id)}
                    style={{
                      backgroundColor: "#FFF5F5",
                      color: "#E53E3E",
                      border: "1px solid #FED7D7",
                      padding: "0.4rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {minhasReservas.length === 0 && (
            <div className="card-busca-container" style={{ textAlign: "center", padding: "2.5rem" }}>
              <p className="sem-resultados">Você ainda não tem nenhuma reserva cadastrada.</p>
            </div>
          )}
        </div>

        {erro && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{erro}</p>}

        {visao === "disponiveis" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div className="contador-salas-titulo" style={{ margin: 0 }}>
                <h3>{String(salasFiltradas.length).padStart(2, "0")} sala(s) encontrada(s)</h3>
              </div>
              
              <button
                type="button"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{
                  backgroundColor: "#0046B8",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                {mostrarFiltros ? "Ocultar Filtros" : "Filtrar Salas"}
              </button>
            </div>

            {mostrarFiltros && (
              <div className="card-busca-container">
                <div className="form-busca-grid">
                  <div className="coluna-filtros-tempo">
                    <div className="campo-grupo">
                      <label>DATA</label>
                      <input
                        type="date"
                        min={dataHoje}
                        value={filtroDia}
                        onChange={(e) => setFiltroDia(e.target.value)}
                      />
                    </div>

                    <div className="linha-horarios">
                      <div className="campo-grupo">
                        <label>INÍCIO</label>
                        <select
                          value={filtroInicio}
                          onChange={(e) => setFiltroInicio(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {gerarHorarios("17:30").map((horarioStr) => (
                            <option key={horarioStr} value={horarioStr}>{horarioStr}</option>
                          ))}
                        </select>
                      </div>
                      <div className="campo-grupo">
                        <label>FIM</label>
                        <select
                          value={filtroFim}
                          onChange={(e) => setFiltroFim(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {gerarHorarios("18:00").map((horarioStr) => (
                            <option key={horarioStr} value={horarioStr}>{horarioStr}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="coluna-filtros-unidade">
                    <label className="label-unidade">UNIDADE</label>
                    <div className="pills-unidade">
                      {["TODAS", "RECIFE", "SÃO PAULO"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          className={`pill-btn ${unidade === u ? "ativo" : ""}`}
                          onClick={() => setUnidade(u)}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="btn-buscar-salas" onClick={carregarSalas}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Aplicar Filtros
                </button>
              </div>
            )}

            <div className="lista-salas-horizontal" style={{ marginTop: "1rem" }}>
              {salasFiltradas.map((sala) => {
                const statusStr = String(sala.status || "").toLowerCase().trim();
                const estaIndisponivel = 
                  statusStr === "indisponivel" || 
                  statusStr === "unavailable" ||
                  sala.disponivel === false || 
                  sala.ativo === false;

                return (
                  <div key={sala.id} className="card-sala-horizontal-wrapper">
                    <div 
                      className="card-sala-horizontal" 
                      onClick={() => handleAbrirFormulario(sala)}
                      style={{ cursor: estaIndisponivel ? "not-allowed" : "pointer" }}
                    >
                      <div className="sala-info-esquerda" style={{ opacity: estaIndisponivel ? 0.6 : 1 }}>
                        <h4>{sala.nome}</h4>
                        {estaIndisponivel && (
                          <span style={{
                            display: "inline-block",
                            background: "#FED7D7",
                            color: "#9B2C2C",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            marginTop: "0.3rem"
                          }}>
                            Indisponível
                          </span>
                        )}
                      </div>

                      <div className="sala-info-centro" style={{ opacity: estaIndisponivel ? 0.6 : 1 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{sala.andar ? `${sala.andar}º Andar` : ""} {sala.unidade ? `- ${sala.unidade}` : ""}</span>
                      </div>

                      <div className="sala-info-direita" style={{ opacity: 1 }}>
                        {estaIndisponivel ? (
                          <span style={{ fontSize: "0.8rem", color: "#A0AEC0", fontWeight: "600" }}>Bloqueada</span>
                        ) : (
                          <span className="badge-disponivel">Disponível</span>
                        )}
                      </div>
                    </div>

                    {salaSelecionada === sala.id && !estaIndisponivel && (
                      <form onSubmit={handleConfirmarReserva} className="form-reserva-inline">
                        <div className="campos-inline">
                          <label>
                            Dia:
                            <input 
                              type="date" 
                              min={dataHoje}
                              value={dia} 
                              onChange={(e) => setDia(e.target.value)} 
                              required 
                            />
                          </label>
                          <label>
                            Início:
                            <select 
                              value={horaInicio} 
                              onChange={handleMudarInicio} 
                              required
                              style={{ width: "100%", boxSizing: "border-box" }}
                            >
                              <option value="">Selecione...</option>
                              {gerarHorarios("17:30").map((horarioStr) => (
                                <option key={horarioStr} value={horarioStr}>{horarioStr}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Fim:
                            <select 
                              value={horaFim} 
                              onChange={(e) => setHoraFim(e.target.value)} 
                              required
                              style={{ width: "100%", boxSizing: "border-box" }}
                            >
                              <option value="">Selecione...</option>
                              {gerarHorarios("18:00").map((horarioStr) => {
                                if (horaInicio && horarioStr <= horaInicio) return null;
                                return <option key={horarioStr} value={horarioStr}>{horarioStr}</option>;
                              })}
                            </select>
                          </label>
                        </div>
                        <button type="submit" className="btn-confirmar-inline">Confirmar Reserva</button>
                      </form>
                    )}
                  </div>
                );
              })}

              {salasFiltradas.length === 0 && (
                <p className="sem-resultados">Nenhuma sala encontrada.</p>
              )}
            </div>
          </>
        )}

        {visao === "calendario" && <Calendario reservas={reservas} salas={salas} />}
      </main>
    </div>
  );
}

export default Salas;