import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado, atualizarUsuarioLogado, fazerLogout } from "../utils/auth";
import { getUsuario } from "../services/api";
import logoSieg from "../assets/logo-sieg.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_BASE_URL = API_URL.replace(/\/api\/?$/, "");

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const user = getUsuarioLogado();
    if (!user) {
      navigate("/login");
      return;
    }
    setUsuario(user);
    setNome(user.nome || "");
    setTelefone(user.telefone || "");

    // Após voltar do fluxo de autenticação do Google, busca o usuário
    // atualizado (com o token salvo) e substitui o que está em cache.
    const params = new URLSearchParams(window.location.search);
    const googleStatus = params.get("google");
    if (googleStatus) {
      if (googleStatus === "conectado") {
        getUsuario(user.id)
          .then((atualizado) => {
            atualizarUsuarioLogado(atualizado);
            setUsuario(atualizado);
            setMensagem("Conta do Google Calendar conectada com sucesso!");
            setTimeout(() => setMensagem(""), 3000);
          })
          .catch(() => {});
      } else {
        setMensagem("Não foi possível conectar sua conta do Google. Tente novamente.");
        setTimeout(() => setMensagem(""), 3000);
      }
      navigate("/perfil", { replace: true });
    }
  }, [navigate]);

  function handleConectarGoogle() {
    window.location.href = `${API_BASE_URL}/auth/google?userId=${usuario.id}`;
  }

  function handleSalvar(e) {
    e.preventDefault();
    try {
      const atualizado = {
        ...usuario,
        nome,
        telefone,
        ...(senha ? { senha } : {}),
      };
      atualizarUsuarioLogado(atualizado);
      setUsuario(atualizado);
      setEditando(false);
      setSenha("");
      setMensagem("Perfil atualizado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      setMensagem("Erro ao atualizar perfil.");
    }
  }

  function handleSair() {
    fazerLogout();
    navigate("/login");
  }

  if (!usuario) return null;

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

          <button
            onClick={() => navigate(usuario.eAdmin ? "/admin" : "/salas")}
            style={{
              backgroundColor: "transparent",
              color: "#FFF",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="container-principal" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card-busca-container" style={{ width: "100%", maxWidth: "500px", marginTop: "2rem" }}>
          <div className="contador-salas-titulo" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <h3>Meu Perfil</h3>
          </div>

          {mensagem && (
            <p style={{ textAlign: "center", color: mensagem.includes("sucesso") ? "green" : "red", marginBottom: "1rem", fontWeight: "600", fontSize: "0.9rem" }}>
              {mensagem}
            </p>
          )}

          {!editando ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div className="campo-grupo">
                <label>NOME</label>
                <input type="text" value={usuario.nome} disabled style={{ backgroundColor: "#F7FAFC", cursor: "not-allowed" }} />
              </div>

              <div className="campo-grupo">
                <label>E-MAIL</label>
                <input type="email" value={usuario.email} disabled style={{ backgroundColor: "#F7FAFC", cursor: "not-allowed" }} />
              </div>

              <div className="campo-grupo">
                <label>TELEFONE</label>
                <input type="text" value={usuario.telefone || "Não informado"} disabled style={{ backgroundColor: "#F7FAFC", cursor: "not-allowed" }} />
              </div>

              <button
                type="button"
                onClick={() => setEditando(true)}
                className="btn-buscar-salas"
                style={{ marginTop: "1rem" }}
              >
                Editar Perfil
              </button>

              <div style={{ borderTop: "1px solid #E2E8F0", margin: "1rem 0" }}></div>

              <div className="campo-grupo">
                <label>GOOGLE CALENDAR</label>
                {usuario.googleRefreshToken ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#2F855A",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    Conta conectada
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#718096" }}>
                      Conecte sua conta do Google para poder reservar salas e ter os agendamentos sincronizados com seu Google Calendar.
                    </p>
                    <button
                      type="button"
                      onClick={handleConectarGoogle}
                      className="btn-buscar-salas"
                      style={{ margin: 0 }}
                    >
                      Conectar Google Calendar
                    </button>
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", margin: "1rem 0" }}></div>

              <button
                type="button"
                onClick={handleSair}
                style={{
                  backgroundColor: "#FFF5F5",
                  color: "#E53E3E",
                  border: "1px solid #FED7D7",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sair da Conta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSalvar} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div className="campo-grupo">
                <label>NOME</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>TELEFONE</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className="campo-grupo">
                <label>NOVA SENHA (opcional)</label>
                <input
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#EDF2F7",
                    color: "#4A5568",
                    border: "none",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-buscar-salas"
                  style={{ flex: 1, margin: 0 }}
                >
                  Salvar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Perfil;