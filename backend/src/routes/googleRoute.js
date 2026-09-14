import { Router } from "express";
import * as googleController from "../controllers/googleController.js";

const router = Router();

// Rota que inicia o fluxo (o frontend chama essa rota ou redireciona o usuário nela)
router.get("/auth/google", googleController.redirectToGoogle);

// Rota de callback configurada no Google Cloud Console
router.get("/auth/google/callback", googleController.handleGoogleCallback);

export default router;