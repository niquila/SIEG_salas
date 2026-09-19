import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Salas from "./pages/salas";
import Perfil from "./pages/perfil";
import AdminSalas from "./pages/admin";
import Privacidade from "./pages/privacidade";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/salas" element={<Salas />} />
        <Route path="/reservas" element={<Navigate to="/salas" replace />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<AdminSalas />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;