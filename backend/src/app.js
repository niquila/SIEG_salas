import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

// O .env fica na raiz do monorepo, não em backend/, então precisa
// do caminho explícito para funcionar independente do cwd local.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import cors from 'cors';
import { ZodError } from 'zod';
import routes from './routes/index.js';
import googleRoutes from './routes/googleRoute.js';
import { swaggerDocument } from './config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/docs/openapi.json', (req, res) => res.json(swaggerDocument));

app.get('/docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/openapi.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`);
});

app.use('/api', routes);
app.use('/', googleRoutes);

app.use((err, req, res, next) => {
  console.error('Erro detectado na aplicação:', err);

  if (err instanceof ZodError || err?.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const mensagemFormata = issues.length > 0 ? issues.map(e => e.message).join(' ') : err.message;
    return res.status(400).json({
      message: mensagemFormata || 'Dados inválidos na requisição.'
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor.'
  });
});

app.use((req, res) => {
  return res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada.`
  });
});

export default app;