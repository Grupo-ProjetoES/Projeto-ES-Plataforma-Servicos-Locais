#!/usr/bin/env bash
set -e

# Diretório raiz do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="${PROJECT_DIR}/populate_db.sql"

echo "=================================================="
echo " Populando o Banco de Dados Freelance (PostgreSQL)"
echo "=================================================="

# 1. Verificar se o Docker Compose está ativo
echo "▶ Verificando container do banco de dados..."
docker compose -f "${PROJECT_DIR}/docker-compose.yml" up -d freelance-postgres

# 2. Aguardar o banco estar pronto para conexões
echo "▶ Aguardando o PostgreSQL ficar pronto..."
until docker compose -f "${PROJECT_DIR}/docker-compose.yml" exec -T freelance-postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

# 3. Verificar se as tabelas já foram criadas pelo Flyway
if ! docker compose -f "${PROJECT_DIR}/docker-compose.yml" exec -T freelance-postgres psql -U postgres -d postgres -c '\dt users' 2>/dev/null | grep -q users; then
  echo ""
  echo "⚠️  Aviso: As tabelas ainda não foram criadas no banco de dados."
  echo "   Inicie o backend uma vez (na pasta backend: ./mvnw spring-boot:run)"
  echo "   para que o Flyway crie todas as tabelas automaticamente, e depois"
  echo "   rode este script novamente!"
  echo ""
  exit 1
fi

# 4. Executar o script SQL
echo "▶ Inserindo dados de teste..."
docker compose -f "${PROJECT_DIR}/docker-compose.yml" exec -T freelance-postgres psql -U postgres -d postgres < "${SQL_FILE}"

echo ""
echo "=================================================="
echo " Banco de dados populado com sucesso!"
echo "=================================================="
echo ""
echo "Contas de teste disponíveis (Senha padrão para todas: senha123):"
echo ""
echo "1. Administrador:"
echo "   - Email: admin@freelance.com"
echo ""
echo "2. Clientes:"
echo "   - Email: cliente@freelance.com (Lucas Cliente)"
echo "   - Email: maria@freelance.com (Maria Oliveira)"
echo ""
echo "3. Prestadores de Serviços Concorrentes:"
echo "   - Pintores: carlos.silva@freelance.com, bruno.pinturas@freelance.com, leandro.tintas@freelance.com, rafael.pintor@freelance.com"
echo "   - Eletricistas: ana.souza@freelance.com, rodrigo.eletricista@freelance.com, paula.eletrica@freelance.com, marcos.eletro@freelance.com"
echo "   - Diaristas: sandra.limpeza@freelance.com, camila.clean@freelance.com, valeria.faxinas@freelance.com, juliana.rocha@freelance.com (Sem avaliações)"
echo "   - Encanadores: roberto.santos@freelance.com, diego.encanador@freelance.com, marcelo.vazamentos@freelance.com"
echo "   - Marceneiros: marcos.lima@freelance.com, eduardo.marcenaria@freelance.com, thiago.moveis@freelance.com"
echo ""
echo "Total: 24 serviços e 47 avaliações reais e variadas prontas para comparação!"
echo "=================================================="
