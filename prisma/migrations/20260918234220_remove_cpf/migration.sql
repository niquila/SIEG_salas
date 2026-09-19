-- Remove o campo cpf, que deixou de ser exigido no cadastro de usuários
ALTER TABLE "usuarios" DROP COLUMN "cpf";
