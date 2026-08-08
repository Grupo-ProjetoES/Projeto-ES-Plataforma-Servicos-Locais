# Projeto-ES — Plataforma de Serviços Locais

Trabalho da segunda VA (Verificação de Aprendizagem) da disciplina de Engenharia de Software, ministrada pela professora Thaís.

Aplicativo/plataforma web que conecta moradores de uma região a prestadores de serviços locais de qualquer categoria (reparos residenciais, aulas particulares, beleza e estética, jardinagem, limpeza, pet care, eventos, entre outros), permitindo buscar, comparar e contratar serviços próximos de forma centralizada.

## Sobre o Projeto

Hoje, a busca por prestadores de serviço é fragmentada: depende de indicação boca a boca, grupos de redes sociais ou classificados sem padronização. Isso dificulta comparar preços, avaliações e disponibilidade de forma rápida e confiável.

A Plataforma de Serviços Locais resolve esse problema centralizando a busca, o cadastro e a avaliação de prestadores de serviço em um único ambiente, facilitando a conexão entre moradores de uma região e profissionais qualificados próximos a eles.

## Problema que Resolve

- Falta de padronização na divulgação de serviços locais
- Dificuldade em comparar preços e avaliações entre prestadores
- Ausência de histórico confiável de atendimentos
- Processo manual e informal para solicitar orçamentos e agendar serviços

## Funcionalidades Principais (a validar)

- Cadastro de prestadores com categoria, descrição do serviço e localização
- Busca e filtro por categoria e proximidade
- Sistema de avaliação e histórico de atendimentos
- Agendamento ou solicitação de orçamento

Funcionalidades sujeitas a validação e ajustes durante o desenvolvimento do projeto.

## Tecnologias Utilizadas

| Camada    | Tecnologia                     |
|-----------|---------------------------------|
| Front-end | React + TypeScript (Vite)       |
| Back-end  | Java 17 + Spring Boot (Maven)   |
| Banco de Dados | PostgreSQL (via Docker)   |

## Estrutura do Repositório

```
├── backend/            # API Java Spring Boot (Maven)
│   ├── src/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── ...
├── frontend/            # Aplicação React (Vite)
│   ├── src/
│   └── ...
├── frontend-angular/   # Aplicação Angular antiga (arquivada, em migração)
│   ├── src/
│   └── ...
├── docker-compose.yml  # Banco de dados PostgreSQL local
└── README.md
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js (18+) e npm instalados
- JDK 17 ou superior instalado
- Docker e Docker Compose instalados
- Git instalado

### Clonando o repositório

```bash
git clone https://github.com/Grupo-ProjetoES/Projeto-ES-Plataforma-Servicos-Locais.git
cd Projeto-ES-Plataforma-Servicos-Locais
```

### Banco de Dados (Docker)

O backend depende de uma instância local do PostgreSQL. Antes de rodar o backend, suba o banco com:

```bash
docker compose up -d
```

Isso inicia um container Postgres 16 na porta `5432`, com os dados persistidos em um volume nomeado (`freelance-postgres-data`).

Para parar o banco:

```bash
docker compose down
```

Para parar e apagar os dados do banco:

```bash
docker compose down -v
```

### Back-end (Spring Boot)

O backend usa o Maven Wrapper, portanto não é necessário ter o Maven instalado globalmente.

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows
```

A API ficará disponível em http://localhost:8080 (porta padrão do Spring Boot).

### Front-end (React)

```bash
cd frontend
npm install
cp .env.example .env   # ajuste VITE_API_BASE_URL se necessário
npm run dev
```

A aplicação estará disponível em http://localhost:5173.

> O front-end antigo em Angular foi arquivado em `frontend-angular/` durante a migração para React. Instruções de execução dele estão no README daquela pasta.

## Equipe

| Nome |
|------|
| Felipe dos Santos Ferreira |
| Cauã Carvalho Modesto |
| Rafael Carvalho Rodrigues |
| Joran Vinícius Silveira Lage |
| William Torres Albuquerque |

## Disciplina

Engenharia de Software — Segunda VA
Professora: Thaís
UFAPE - Universidade Federal do Agreste de Pernambuco 2026.1
