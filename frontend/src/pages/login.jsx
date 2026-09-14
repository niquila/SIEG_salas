import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, cadastrarUsuario } from "../services/api";
import { salvarUsuarioLogado, salvarToken } from "../utils/auth";
import logoSieg from "../assets/logo-sieg.png";

function Login() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", telefone: "", cpf: "" });
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      if (modoCadastro) {
        // Validação de e-mail corporativo SIEG
        const emailLower = form.email.toLowerCase().trim();
        if (!emailLower.includes("@sieg")) {
          setErro("O cadastro é restrito a colaboradores SIEG.");
          return;
        }

        await cadastrarUsuario({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone,
          cpf: form.cpf,
        });
        alert("Conta criada com sucesso! Faça login.");
        setModoCadastro(false);
        setForm({ nome: "", email: "", senha: "", telefone: "", cpf: "" });
      } else {
        const dados = await login(form.email, form.senha);

        salvarUsuarioLogado(dados.usuario);
        salvarToken(dados.token);

        if (dados.usuario.eAdmin) {
          navigate("/admin");
        } else {
          navigate("/salas");
        }
      }
    } catch (err) {
      setErro(err.message || "Ocorreu um erro. Tente novamente.");
    }
  }

  return (
    <div className="pagina-wrapper">
      {/* Topo Azul com a marca SIEG */}
      <header className="header-azul">
        <div className="header-conteudo" style={{ justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
              <img 
                  src={logoSieg} 
                  lt="SIEG Soluções Fiscais Estratégicas" 
                  style={{ height: "100px", width: "auto", objectFit: "contain" }} 
                />
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="container-principal">
        <div className="contador-salas-titulo">
          <h3 style={{ color: "#FFFFFF", textAlign: "center", fontSize: "1.3rem", fontWeight: "700", marginBottom: "1.5rem" }}>
            {modoCadastro ? "Criar nova conta" : "Acesse sua conta"}
          </h3>
        </div>

        {/* Card do Formulário */}
        <div className="card-busca-container" style={{ maxWidth: "420px" }}>
          {erro && (
            <p style={{ color: "#E53E3E", textAlign: "center", fontWeight: "600", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {modoCadastro && (
              <>
                <div className="campo-grupo">
                  <label>NOME COMPLETO</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label>TELEFONE</label>
                  <input
                    type="text"
                    placeholder="11999999999"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label>CPF</label>
                  <input
                    type="text"
                    placeholder="Somente números"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            <div className="campo-grupo">
              <label>E-MAIL CORPORATIVO</label>
              <input
                type="email"
                placeholder="seu.nome@sieg.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>SENHA</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-buscar-salas" style={{ marginTop: "1rem" }}>
              {modoCadastro ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          {/* Alternador de Modo */}
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #E2E8F0", paddingTop: "1.2rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#718096" }}>
              {modoCadastro ? "Já possui uma conta?" : "Ainda não tem conta?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setModoCadastro(!modoCadastro);
                setErro("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#0046B8",
                fontWeight: "700",
                fontSize: "0.85rem",
                marginLeft: "0.5rem",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              {modoCadastro ? "Fazer Login" : "Criar Conta"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;