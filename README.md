# 🏢 Sistema de Gestão e Reserva de Salas

Sistema web completo para gerenciamento e agendamento de salas de coworking e escritórios corporativos, integrado com sincronização de eventos no Google Calendar.

---

##  Tecnologias Utilizadas

### **Frontend**
* **React.js** (com Vite)
* **React Router Dom** (para roteamento)
* **CSS Modules / Estilização personalizada**

### **Backend**
* **Node.js** com **Express**
* **Prisma ORM** (para gerenciamento do banco de dados)
* **PostgreSQL** (banco de dados relacional)
* **Zod** (validação de schemas e dados)
* **Googleapis** (integração com a API do Google Calendar)

---

##  Funcionalidades Principais

Controle de Acesso: Gerenciamento de permissões que diferencia perfis de usuários comuns e administradores.

Agendamento de Espaços: Ferramenta para consulta de disponibilidade e reserva de salas corporativas com validações de conflitos.

Gestão Administrativa: Módulo dedicado para o cadastro, atualização e gerenciamento completo dos espaços físicos da empresa.

Manutenção Automatizada: Rotinas em segundo plano que identificam e limpam registros expirados na inicialização do sistema.

Sincronização Externa: Conecta a conta google do usuário para realizar a integração automática das reservas efetuadas com o Google Calendar.

Geração de Eventos: Transforma agendamentos confirmados em eventos detalhados diretamente no calendário pessoal, informando os dados e a localização da sala reservada.

Validação de Conta: Assegura que o usuário possua a integração ativa antes de autorizar a finalização de uma nova reserva.
---

## Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* **Node.js** (versão 18 ou superior recomendada)
* **Git**
* Um banco de dados **PostgreSQL** configurado.

### 1. Clonar o repositório

git clone [https://github.com/niquila/SIEG_salas.git](https://github.com/niquila/SIEG_salas.git)
cd SIEG_salas

### 2. BACKEND:
cd backend
npm install
node src/server.js

### 3. FRONTEND:
cd frontend
npm install
npm run dev

### 3. BANCO DE DADOS:
cd backend
npx prisma migrate dev
npx prima studio
