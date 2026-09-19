import { NavLink, useNavigate } from "react-router-dom";
import { getUsuarioLogado, logout, ehAdmin } from "../utils/auth";

// Componente Navbar: usado atualmente só na página de Perfil.
// Em vez de mostrar os links de navegação normais, exibe um botão "Voltar"
// que leva de volta para a página de Salas.
function Navbar() {
  const usuario = getUsuarioLogado();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!usuario) return null;

  return (
    <>
      <nav>
        <button type="button" onClick={() => navigate("/salas")}>
          ← Voltar
        </button>

        {ehAdmin() && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "ativo active" : "")}>
            Gerenciar Salas
          </NavLink>
        )}

        <button onClick={handleLogout}>Sair</button>
      </nav>
      <div className="header-global-titulo">
        <span>Coworking — Aluguel de salas</span>
      </div>
    </>
  );
}

export default Navbar;