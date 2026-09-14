import { useState } from "react";

const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function Calendario({ reservas = [], salas = [] }) {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  function nomeSala(idSala) {
    return salas.find((s) => s.id === idSala)?.nome || `Sala #${idSala}`;
  }

  function getReservasDoDia(diaStr) {
    return reservas
      .filter((r) => r.dia && r.dia.slice(0, 10) === diaStr)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  function mudarMes(delta) {
    let novoMes = mesAtual + delta;
    let novoAno = anoAtual;
    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }
    setMesAtual(novoMes);
    setAnoAtual(novoAno);
    setDiaSelecionado(null);
  }

  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
  for (let dia = 1; dia <= totalDiasNoMes; dia++) celulas.push(dia);

  const reservasDoDiaSelecionado = diaSelecionado ? getReservasDoDia(diaSelecionado) : [];

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      {/* Card do Calendário */}
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        padding: "2rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
        marginBottom: "2rem"
      }}>
        {/* Cabeçalho do Mês */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            style={{
              backgroundColor: "#F7FAFC",
              border: "1px solid #EDF2F7",
              color: "#0046B8",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ‹
          </button>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#1A202C", margin: 0 }}>
            {NOMES_MES[mesAtual]} <span style={{ color: "#718096", fontWeight: "400" }}>{anoAtual}</span>
          </h2>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            style={{
              backgroundColor: "#F7FAFC",
              border: "1px solid #EDF2F7",
              color: "#0046B8",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ›
          </button>
        </div>

        {/* Grade de Dias da Semana (Alinhamento em 7 Colunas) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: "0.75rem" }}>
          {DIAS_SEMANA.map((d) => (
            <div key={d} style={{ fontSize: "0.8rem", fontWeight: "700", color: "#A0AEC0", textTransform: "uppercase" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grade dos Dias do Mês */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
          {celulas.map((dia, i) => {
            if (!dia) return <div key={`vazio-${i}`} />;

            const diaStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
            const reservasDoDia = getReservasDoDia(diaStr);
            const selecionado = diaSelecionado === diaStr;

            return (
              <div
                key={diaStr}
                onClick={() => setDiaSelecionado(selecionado ? null : diaStr)}
                style={{
                  backgroundColor: selecionado ? "#0046B8" : reservasDoDia.length > 0 ? "#EBF3FF" : "#F7FAFC",
                  border: selecionado ? "1px solid #0046B8" : reservasDoDia.length > 0 ? "1px solid #BEE3F8" : "1px solid #EDF2F7",
                  borderRadius: "14px",
                  minHeight: "52px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: "600", color: selecionado ? "#FFFFFF" : "#2D3748" }}>
                  {dia}
                </span>
                {reservasDoDia.length > 0 && (
                  <span style={{
                    backgroundColor: selecionado ? "#FFFFFF" : "#0046B8",
                    color: selecionado ? "#0046B8" : "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    borderRadius: "10px",
                    padding: "1px 6px",
                    marginTop: "2px"
                  }}>
                    {reservasDoDia.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhes do Dia Selecionado */}
      {diaSelecionado && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", color: "#2D3748", fontWeight: "700", marginBottom: "1.25rem" }}>
            Reservas em {diaSelecionado.split("-").reverse().join("/")}
          </h3>

          {reservasDoDiaSelecionado.length === 0 ? (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ margin: 0, color: "#718096" }}>Nenhuma reserva agendada para este dia.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reservasDoDiaSelecionado.map((r) => (
                <div key={r.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1.1rem", color: "#2D3748" }}>{nomeSala(r.idSala)}</h4>
                    <span style={{ fontSize: "0.8rem", color: "#A0AEC0" }}>Horário: {r.horaInicio} às {r.horaFim}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#718096", fontSize: "0.85rem" }}>
                    <span>{r.usuarioNome || r.idUsuario || "Reservado"}</span>
                  </div>
                  <div>
                    <span style={{ backgroundColor: "#FFF5F5", color: "#E53E3E", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
                      Ocupado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendario;