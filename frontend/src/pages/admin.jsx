import { useEffect, useState } from "react";
import logoSieg from "../assets/logo-sieg.png";
import { useNavigate } from "react-router-dom";
import { 
  getSalas, 
  criarSala, 
  atualizarSala, 
  excluirSala, 
  cadastrarUsuario 
} from "../services/api";
import { ehAdmin, logout, getUsuarioLogado } from "../utils/auth";

function AdminSalas() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const [abaAtiva, setAbaAtiva] = useState("salas");
  const [salas, setSalas] = useState([]);
  
  const [formSala, setFormSala] = useState({ 
    nome: "", 
    capacidade: "", 
    descricao: "",
    unidade: "São Paulo",
    andar: "",
    status: "disponivel",
    bloqueioAlmoco: false
  });
  const [editandoId, setEditandoId] = useState(null);

  const [formUsuario, setFormUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
  });

  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!ehAdmin()) {
      alert("Acesso restrito a administradores.");
      navigate("/salas");
      return;
    }
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      setSalas(await getSalas());
    } catch (err) {
      setErro("Erro ao carregar salas.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleSalvarSala(e) {
    e.preventDefault();
    const dados = {
      nome: formSala.nome,
      capacidade: Number(formSala.capacidade),
      descricao: formSala.descricao,
      unidade: formSala.unidade,
      andar: formSala.andar,
      status: formSala.status,
      disponivel: formSala.status === "disponivel",
      bloqueioAlmoco: formSala.bloqueioAlmoco
    };

    if (editandoId) {
      await atualizarSala(editandoId, dados);
    } else {
      dados.status = "disponivel";
      dados.disponivel = true;
      await criarSala(dados);
    }

    setFormSala({ nome: "", capacidade: "", descricao: "", unidade: "São Paulo", andar: "", status: "disponivel", bloqueioAlmoco: false });
    setEditandoId(null);
    carregarSalas();
  }

  function handleEditar(sala) {
    const statusStr = String(sala.status || "").toLowerCase().trim();
    const estaIndisponivel = 
      statusStr === "indisponivel" || 
      statusStr === "unavailable" ||
      sala.disponivel === false || 
      sala.ativo === false;

    setFormSala({
      nome: sala.nome,
      capacidade: sala.capacidade,
      descricao: sala.descricao || "",
      unidade: sala.unidade || "São Paulo",
      andar: sala.andar || "",
      status: estaIndisponivel ? "indisponivel" : (sala.status || "disponivel"),
      bloqueioAlmoco: sala.bloqueioAlmoco || false,
    });
    setEditandoId(sala.id);
    setAbaAtiva("salas");
  }

  async function handleExcluir(id) {
    if (!confirm("Excluir esta sala?")) return;
    await excluirSala(id);
    carregarSalas();
  }

  function handleCancelarEdicao() {
    setFormSala({ nome: "", capacidade: "", descricao: "", unidade: "São Paulo", andar: "", status: "disponivel", bloqueioAlmoco: false });
    setEditandoId(null);
  }

  async function handleCadastrarUsuario(e) {
    e.preventDefault();
    setErro("");

    const emailLower = formUsuario.email.toLowerCase().trim();
    if (!emailLower.includes("@sieg")) {
      alert("O cadastro é restrito a e-mails contendo @sieg.");
      return;
    }

    try {
      await cadastrarUsuario(formUsuario);
      alert("Usuário cadastrado com sucesso!");
      setFormUsuario({ nome: "", email: "", senha: "", telefone: "" });
    } catch (err) {
      alert(err.message || "Erro ao cadastrar usuário.");
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
            <span>Olá, {usuario?.nome || "Admin"}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "6px",
                padding: "0.35rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600"
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container-principal">
        <div className="grid-acoes">
          <div 
            className={`card-acao ${abaAtiva === "salas" ? "ativo" : ""}`}
            onClick={() => setAbaAtiva("salas")}
          >
            <div className="icone-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0046B8" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div>
              <h3>Gerenciar Salas</h3>
              <p>Cadastrar, editar ou remover espaços</p>
            </div>
          </div>

          <div 
            className={`card-acao ${abaAtiva === "usuario" ? "ativo" : ""}`}
            onClick={() => setAbaAtiva("usuario")}
          >
            <div className="icone-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0046B8" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <div>
              <h3>Novo Colaborador</h3>
              <p>Cadastrar usuário </p>
            </div>
          </div>
        </div>

        {erro && <p style={{ color: "#E53E3E", textAlign: "center", marginBottom: "1rem" }}>{erro}</p>}

        {abaAtiva === "salas" && (
          <>
            <div className="card-busca-container" style={{ maxWidth: "550px", margin: "0 auto 2rem auto" }}>
              <h3 style={{ marginBottom: "1.2rem", color: "#1A202C", fontSize: "1.1rem" }}>
                {editandoId ? "Editar Sala" : "Cadastrar Nova Sala"}
              </h3>
              <form onSubmit={handleSalvarSala}>
                <div className="campo-grupo">
                  <label>NOME DA SALA</label>
                  <input
                    placeholder="Ex: Sala de Reunião B"
                    value={formSala.nome}
                    onChange={(e) => setFormSala({ ...formSala, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="linha-horarios">
                  <div className="campo-grupo">
                    <label>UNIDADE</label>
                    <select
                      value={formSala.unidade}
                      onChange={(e) => setFormSala({ ...formSala, unidade: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E0",
                        fontSize: "0.9rem"
                      }}
                      required
                    >
                      <option value="São Paulo">São Paulo</option>
                      <option value="Recife">Recife</option>
                    </select>
                  </div>

                  <div className="campo-grupo">
                    <label>LOCALIZAÇÃO (ANDAR)</label>
                    <input
                      placeholder="Ex: 3º Andar"
                      value={formSala.andar}
                      onChange={(e) => setFormSala({ ...formSala, andar: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="campo-grupo">
                  <label>CAPACIDADE (PESSOAS)</label>
                  <input
                    type="number"
                    placeholder="Ex: 10"
                    value={formSala.capacidade}
                    onChange={(e) => setFormSala({ ...formSala, capacidade: e.target.value })}
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label>DESCRIÇÃO</label>
                  <input
                    placeholder="Ex: Sala com TV 55 pol e ar condicionado"
                    value={formSala.descricao}
                    onChange={(e) => setFormSala({ ...formSala, descricao: e.target.value })}
                  />
                </div>

                {/* Checkbox para Bloqueio de Almoço */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "1rem 0 0.5rem 0" }}>
                  <input
                    type="checkbox"
                    id="chkBloqueioAlmoco"
                    checked={formSala.bloqueioAlmoco}
                    onChange={(e) => setFormSala({ 
                      ...formSala, 
                      bloqueioAlmoco: e.target.checked 
                    })}
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#0046B8" }}
                  />
                  <label htmlFor="chkBloqueioAlmoco" style={{ cursor: "pointer", fontSize: "0.9rem", color: "#4A5568", fontWeight: "500", margin: 0 }}>
                    Bloquear reservas no horário de almoço (12:00 às 13:00)
                  </label>
                </div>

                {editandoId && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.5rem 0 0.5rem 0" }}>
                    <input
                      type="checkbox"
                      id="chkIndisponivel"
                      checked={formSala.status === "indisponivel"}
                      onChange={(e) => setFormSala({ 
                        ...formSala, 
                        status: e.target.checked ? "indisponivel" : "disponivel" 
                      })}
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#0046B8" }}
                    />
                    <label htmlFor="chkIndisponivel" style={{ cursor: "pointer", fontSize: "0.9rem", color: "#4A5568", fontWeight: "500", margin: 0 }}>
                      Deixar sala indisponível para reservas
                    </label>
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" className="btn-buscar-salas" style={{ flex: 1 }}>
                    {editandoId ? "Atualizar Sala" : "Salvar Sala"}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      onClick={handleCancelarEdicao}
                      style={{
                        background: "#E2E8F0",
                        color: "#4A5568",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="contador-salas-titulo">
              <h3>{String(salas.length).padStart(2, "0")} sala(s) cadastrada(s)</h3>
            </div>

            <div className="lista-salas-horizontal">
              {salas.map((sala) => {
                const statusStr = String(sala.status || "").toLowerCase().trim();
                const estaIndisponivel = 
                  statusStr === "indisponivel" || 
                  statusStr === "unavailable" ||
                  sala.disponivel === false || 
                  sala.ativo === false;

                return (
                  <div key={sala.id} className="card-sala-horizontal-wrapper">
                    <div className="card-sala-horizontal" style={{ cursor: "default" }}>
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
                        <span style={{ fontSize: "0.85rem", color: "#4A5568" }}>
                          Unidade: <strong>{sala.unidade || "São Paulo"}</strong> | Andar: <strong>{sala.andar || "N/A"}</strong>
                        </span>
                        <span style={{ fontSize: "0.85rem", color: "#4A5568", display: "block" }}>
                          Capacidade: <strong>{sala.capacidade} pessoas</strong>
                        </span>
                        {sala.descricao && (
                          <span style={{ fontSize: "0.80rem", color: "#718096", display: "block", marginTop: "0.2rem" }}>
                            {sala.descricao}
                          </span>
                        )}
                      </div>

                      <div className="sala-info-direita" style={{ gap: "0.5rem", opacity: 1 }}>
                        <button
                          onClick={() => handleEditar(sala)}
                          style={{
                            background: "#0046B8",
                            color: "#FFF",
                            border: "none",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(sala.id)}
                          style={{
                            background: "#FFF5F5",
                            color: "#E53E3E",
                            border: "1px solid #FEB2B2",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {abaAtiva === "usuario" && (
          <div className="card-busca-container" style={{ maxWidth: "450px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "1.2rem", color: "#1A202C", fontSize: "1.1rem" }}>
              Cadastrar Colaborador SIEG
            </h3>
            <form onSubmit={handleCadastrarUsuario}>
              <div className="campo-grupo">
                <label>NOME COMPLETO</label>
                <input
                  type="text"
                  placeholder="Nome do colaborador"
                  value={formUsuario.nome}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>E-MAIL CORPORATIVO</label>
                <input
                  type="email"
                  placeholder="nome@sieg.com"
                  value={formUsuario.email}
                  onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>TELEFONE</label>
                <input
                  type="text"
                  placeholder="11999999999"
                  value={formUsuario.telefone}
                  onChange={(e) => setFormUsuario({ ...formUsuario, telefone: e.target.value })}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label>SENHA</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formUsuario.senha}
                  onChange={(e) => setFormUsuario({ ...formUsuario, senha: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-buscar-salas" style={{ marginTop: "1rem" }}>
                Cadastrar Colaborador
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminSalas;