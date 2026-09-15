import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import routes from './routes/index.js';
import googleRoutes from './routes/googleRoute.js';
import { swaggerDocument } from './config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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