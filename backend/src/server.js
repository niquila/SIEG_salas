import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/docs`);
  console.log(`Health check disponível em: http://localhost:${PORT}/api/health`);
});