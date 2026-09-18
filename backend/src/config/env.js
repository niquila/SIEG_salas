import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// O .env fica na raiz do monorepo, não em backend/, então precisa do caminho
// explícito para funcionar independente do cwd local. Este arquivo precisa
// ser o primeiro import de app.js: em ES Modules todo import é resolvido
// (e seu corpo executado) antes do restante do módulo rodar, então um
// dotenv.config() feito depois dos outros imports rodaria tarde demais.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
