-- ==============================================================================
-- Script de População do Banco de Dados (PostgreSQL) - Freelance Plataforma
-- Senha padrão para TODOS os usuários criados: senha123
-- Hash BCrypt para 'senha123': $2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m
-- ==============================================================================

-- 1. Inserir Usuários (Clientes, Prestadores e Administrador)
INSERT INTO users (id, name, email, role, password) VALUES
    -- Admin
    (1, 'Administrador do Sistema', 'admin@freelance.com', 'ADMIN', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    -- Clientes (para contratar e avaliar)
    (2, 'Lucas Cliente', 'cliente@freelance.com', 'USER', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (3, 'Maria Oliveira', 'maria@freelance.com', 'USER', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (10, 'João Pedro Santos', 'joao.cliente@freelance.com', 'USER', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (11, 'Beatriz Costa', 'beatriz.cliente@freelance.com', 'USER', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (12, 'Fernando Alves', 'fernando.cliente@freelance.com', 'USER', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),

    -- Prestadores - Segmento: Pintura
    (4, 'Carlos Silva', 'carlos.silva@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (20, 'Bruno Pinturas', 'bruno.pinturas@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (21, 'Leandro Tintas & Cores', 'leandro.tintas@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (22, 'Rafael Pintor', 'rafael.pintor@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),

    -- Prestadores - Segmento: Elétrica
    (5, 'Ana Souza', 'ana.souza@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (23, 'Rodrigo Eletricista', 'rodrigo.eletricista@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (24, 'Paula Instalações Elétricas', 'paula.eletrica@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (25, 'Marcos Eletro Reparos', 'marcos.eletro@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),

    -- Prestadores - Segmento: Limpeza e Diarista
    (7, 'Juliana Rocha', 'juliana.rocha@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (26, 'Sandra Limpeza Geral', 'sandra.limpeza@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (27, 'Camila Clean Residencial', 'camila.clean@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (28, 'Valéria Faxinas', 'valeria.faxinas@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),

    -- Prestadores - Segmento: Hidráulica e Encanador
    (8, 'Roberto Santos', 'roberto.santos@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (29, 'Diego Hidráulica', 'diego.encanador@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (30, 'Marcelo Caça Vazamentos', 'marcelo.vazamentos@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),

    -- Prestadores - Segmento: Marcenaria
    (6, 'Marcos Lima', 'marcos.lima@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (31, 'Eduardo Madeira & Arte', 'eduardo.marcenaria@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m'),
    (32, 'Thiago Móveis Design', 'thiago.moveis@freelance.com', 'PRESTADOR', '$2a$10$abcdefghijklmnopqrstuu4GiwOG/hJykbcxOdaNQqlq2A2t0sW0m')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    password = EXCLUDED.password;

-- 2. Inserir Perfis de Prestador (provider_profiles)
INSERT INTO provider_profiles (id, user_id, document, description) VALUES
    -- Pintores
    (1, 4, '12345678901', 'Pintor com mais de 8 anos de experiência em pintura residencial, comercial e acabamento fino.'),
    (6, 20, '12345678906', 'Pintor ágil focado em entregas rápidas de imóveis alugados e reformas imobiliárias.'),
    (7, 21, '12345678907', 'Especialista em texturas nobres, cimento queimado, marmorato e pintura decorativa de alto padrão.'),
    (8, 22, '12345678908', 'Pintura geral residencial com o melhor custo-benefício de Arcoverde e região.'),

    -- Eletricistas
    (2, 5, '23456789012', 'Eletricista credenciada em instalações residenciais, manutenções preventivas e quadros de energia.'),
    (9, 23, '23456789019', 'Técnico eletricista residencial e predial com vasta experiência em diagnóstico de sobrecargas e fiação.'),
    (10, 24, '23456789020', 'Engenheira e eletricista com foco em segurança, laudos técnicos, aterramento e painéis solares.'),
    (11, 25, '23456789021', 'Atendimento rápido para reparos emergenciais: chuveiros queimados, curto-circuito e tomadas.'),

    -- Limpeza e Diaristas
    (4, 7, '45678901234', 'Diarista experiente com foco em organização e limpeza residencial sem avaliações cadastradas ainda.'),
    (12, 26, '45678901236', 'Equipe especializada em limpeza pós-obra pesada, galpões e higienização profunda de pisos.'),
    (13, 27, '45678901237', 'Higienização profissional a seco e a vapor de sofás, colchões, tapetes e cortinas.'),
    (14, 28, '45678901238', 'Faxinas pontuais de 4 ou 8 horas para apartamentos compactos e kitnets.'),

    -- Hidráulica
    (5, 8, '56789012345', 'Encanador especializado em desentupimentos, canos de água fria/quente e esgoto.'),
    (15, 29, '56789012349', 'Instalação de bombas d água, reservatórios, hidrômetros e redes de abastecimento.'),
    (16, 30, '56789012350', 'Especialista com equipamento eletrônico geofone para detecção de vazamentos invisíveis sem quebrar pisos.'),

    -- Marcenaria
    (3, 6, '34567890123', 'Marceneiro com oficina própria para cozinhas planejadas, armários embutidos e gabinetes.'),
    (17, 31, '34567890131', 'Móveis rústicos, decks de piscina e restauração de móveis antigos em madeira de lei.'),
    (18, 32, '34567890132', 'Marcenaria moderna focada em home offices, painéis ripados e nichos iluminados.')
ON CONFLICT (id) DO UPDATE SET
    document = EXCLUDED.document,
    description = EXCLUDED.description;

-- 3. Telefones dos Prestadores (provider_profile_phones)
DELETE FROM provider_profile_phones WHERE provider_profile_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
INSERT INTO provider_profile_phones (provider_profile_id, phone) VALUES
    (1, '87991110001'),
    (2, '87992220002'),
    (3, '87993330003'),
    (4, '87994440004'),
    (5, '87995550005'),
    (6, '87996660006'),
    (7, '87997770007'),
    (8, '87998880008'),
    (9, '87999990009'),
    (10, '87990000010'),
    (11, '87991110011'),
    (12, '87992220012'),
    (13, '87993330013'),
    (14, '87994440014'),
    (15, '87995550015'),
    (16, '87996660016'),
    (17, '87997770017'),
    (18, '87998880018');

-- 4. Áreas de Atendimento dos Prestadores (provider_profile_service_areas)
DELETE FROM provider_profile_service_areas WHERE provider_profile_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
INSERT INTO provider_profile_service_areas (provider_profile_id, service_area) VALUES
    (1, 'Arcoverde'),
    (2, 'Arcoverde'),
    (3, 'Arcoverde'),
    (4, 'Arcoverde'),
    (5, 'Arcoverde'),
    (6, 'Arcoverde'),
    (7, 'Arcoverde'),
    (8, 'Arcoverde'),
    (9, 'Arcoverde'),
    (10, 'Arcoverde'),
    (11, 'Arcoverde'),
    (12, 'Arcoverde'),
    (13, 'Arcoverde'),
    (14, 'Arcoverde'),
    (15, 'Arcoverde'),
    (16, 'Arcoverde'),
    (17, 'Arcoverde'),
    (18, 'Arcoverde');

-- 5. Categorias dos Perfis (provider_profile_categories)
-- (1: Eletricista, 2: Encanador, 3: Diarista, 4: Pintor, 6: Marceneiro)
DELETE FROM provider_profile_categories WHERE provider_profile_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);
INSERT INTO provider_profile_categories (provider_profile_id, service_category_id) VALUES
    -- Pintores (4)
    (1, 4),
    (6, 4),
    (7, 4),
    (8, 4),
    -- Eletricistas (1)
    (2, 1),
    (9, 1),
    (10, 1),
    (11, 1),
    -- Diaristas/Limpeza (3)
    (4, 3),
    (12, 3),
    (13, 3),
    (14, 3),
    -- Encanadores (2)
    (5, 2),
    (15, 2),
    (16, 2),
    -- Marceneiros (6)
    (3, 6),
    (17, 6),
    (18, 6);

-- 6. Inserir Serviços Concorrentes (servicos)
INSERT INTO servicos (id, titulo, descricao, localizacao, area_atendimento, forma_cobranca, service_category_id, provider_profile_id, status, client_user_id, data_contratacao) VALUES
    -- === PINTORES CONCORRENTES (Categoria 4: Pintor) ===
    (1, 'Pintura Residencial e Apartamentos', 'Preparação de paredes, lixamento, massa corrida e aplicação de tinta acetinada ou fosca com alta durabilidade.', 'Centro', 'Arcoverde', 'POR_HORA', 4, 1, 'DISPONIVEL', NULL, NULL),
    (6, 'Pintura Decorativa e Textura Externa', 'Aplicação de grafiato, cimento queimado e texturas rústicas em fachadas e muros.', 'Boa Vista', 'Arcoverde', 'VALOR_FIXO_TOTAL', 4, 1, 'DISPONIVEL', NULL, NULL),
    (10, 'Pintura Imobiliária Rápida para Locação', 'Pintura ágil de entrega de chaves com cobertura uniforme e limpeza completa após o término.', 'Centro', 'Arcoverde', 'DIARIA', 4, 6, 'DISPONIVEL', NULL, NULL),
    (11, 'Pintura Eletrostática e Grades Metálicas', 'Pintura anticorrosiva em grades, portões basculantes e esquadrias de ferro ou alumínio.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 4, 6, 'DISPONIVEL', NULL, NULL),
    (12, 'Pintura Fina e Acabamento Premium', 'Técnica refinada em boiserie, tintas laváveis de alto padrão e restauração detalhada.', 'São Cristóvão', 'Arcoverde', 'POR_HORA', 4, 7, 'DISPONIVEL', NULL, NULL),
    (13, 'Pintura Simples e Econômica', 'Serviço direto ao ponto para renovação de salas e quartos com tinta acrílica econômica.', 'Boa Vista', 'Arcoverde', 'DIARIA', 4, 8, 'DISPONIVEL', NULL, NULL),

    -- === ELETRICISTAS CONCORRENTES (Categoria 1: Eletricista) ===
    (2, 'Instalação Elétrica Residencial Completa', 'Revisão geral de fiação, quadro de distribuição de energia, tomadas e disjuntores.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 1, 2, 'DISPONIVEL', NULL, NULL),
    (7, 'Instalação de Padrão e Painel Solar', 'Adequação de entrada de energia, aterramento e conexão de inversores solares.', 'Centro', 'Arcoverde', 'POR_HORA', 1, 2, 'DISPONIVEL', NULL, NULL),
    (14, 'Troca e Redimensionamento de Fiação', 'Substituição de fiação antiga ressecada para evitar aquecimento e curto-circuito.', 'Centro', 'Arcoverde', 'POR_HORA', 1, 9, 'DISPONIVEL', NULL, NULL),
    (15, 'Instalação de Iluminação e Fitas LED', 'Instalação de perfis de LED, lustres modernos, arandelas e sensores de presença.', 'Boa Vista', 'Arcoverde', 'VALOR_FIXO_TOTAL', 1, 9, 'DISPONIVEL', NULL, NULL),
    (16, 'Laudo Elétrico e Padrão Concessionária', 'Vistoria técnica com emissão de parecer e adequação para ligação nova de energia.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 1, 10, 'DISPONIVEL', NULL, NULL),
    (17, 'Conserto Elétrico Rápido e Chuveiros', 'Atendimento emergencial para reparo de chuveiros elétricos, tomadas e disjuntores que desarmam.', 'Centro', 'Arcoverde', 'DIARIA', 1, 11, 'DISPONIVEL', NULL, NULL),

    -- === LIMPEZA E DIARISTAS CONCORRENTES (Categoria 3: Diarista) ===
    (4, 'Faxina Residencial Completa e Higienização', 'Limpeza detalhada de salas, quartos, cozinhas e banheiros sem histórico de avaliações.', 'Boa Vista', 'Arcoverde', 'DIARIA', 3, 4, 'DISPONIVEL', NULL, NULL),
    (18, 'Limpeza Pós-Obra Especializada', 'Remoção de respingos de tinta, cimento, poeira de gesso e higienização profunda de porcelanatos.', 'Centro', 'Arcoverde', 'DIARIA', 3, 12, 'DISPONIVEL', NULL, NULL),
    (19, 'Diarista Residencial com Passadoria', 'Limpeza leve, aspiração de tapetes e passadoria de roupas com dia combinado semanal.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 3, 12, 'DISPONIVEL', NULL, NULL),
    (20, 'Higienização e Lavagem a Seco de Estofados', 'Limpeza profunda de sofás retráteis, poltronas e colchões com eliminação de ácaros e manchas.', 'Centro', 'Arcoverde', 'VALOR_FIXO_TOTAL', 3, 13, 'DISPONIVEL', NULL, NULL),
    (21, 'Faxina Express de Meio Período', 'Atendimento de 4 horas para organização e limpeza rápida de quitinetes e apartamentos.', 'Boa Vista', 'Arcoverde', 'POR_HORA', 3, 14, 'DISPONIVEL', NULL, NULL),

    -- === ENCANADORES CONCORRENTES (Categoria 2: Encanador) ===
    (5, 'Desentupimento e Reparo Hidráulico', 'Desentupimento de ralos, pias, vasos sanitários e substituição de registros e torneiras.', 'Centro', 'Arcoverde', 'POR_HORA', 2, 5, 'DISPONIVEL', NULL, NULL),
    (22, 'Instalação de Caixas d Água e Bombas', 'Montagem e ligação de reservatórios elevados, bombas pressurizadoras e boias automáticas.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 2, 15, 'DISPONIVEL', NULL, NULL),
    (23, 'Troca Geral de Tubulação e Esgoto', 'Substituição de colunas prediais, canos de esgoto pluvial e conexões PVC.', 'Boa Vista', 'Arcoverde', 'DIARIA', 2, 15, 'DISPONIVEL', NULL, NULL),
    (24, 'Caça Vazamentos com Geofone Eletrônico', 'Localização milimétrica de vazamentos ocultos subterrâneos sem demolição de pisos ou paredes.', 'Centro', 'Arcoverde', 'VALOR_FIXO_TOTAL', 2, 16, 'DISPONIVEL', NULL, NULL),

    -- === MARCENEIROS CONCORRENTES (Categoria 6: Marceneiro) ===
    (3, 'Fabricação de Móveis Planejados', 'Armários planejados para cozinhas, dormitórios e banheiros com dobradiças amortecidas.', 'Centro', 'Arcoverde', 'DIARIA', 6, 3, 'DISPONIVEL', NULL, NULL),
    (8, 'Restauração de Portas e Decks de Madeira', 'Lixamento, calafetação, aplicação de verniz marítimo e reparos em portas maciças.', 'São Cristóvão', 'Arcoverde', 'VALOR_FIXO_TOTAL', 6, 3, 'DISPONIVEL', NULL, NULL),
    (25, 'Cozinhas e Closets Sob Medida em MDF', 'Móveis funcionais em MDF naval 18mm com trilhos telescópicos e iluminação embutida.', 'Boa Vista', 'Arcoverde', 'VALOR_FIXO_TOTAL', 6, 17, 'DISPONIVEL', NULL, NULL),
    (26, 'Painéis Ripados e Móveis para Sala', 'Instalação de painéis de TV ripados, nichos suspensos e bancadas de escritório home office.', 'Centro', 'Arcoverde', 'POR_HORA', 6, 18, 'DISPONIVEL', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    localizacao = EXCLUDED.localizacao,
    area_atendimento = EXCLUDED.area_atendimento,
    forma_cobranca = EXCLUDED.forma_cobranca,
    service_category_id = EXCLUDED.service_category_id,
    provider_profile_id = EXCLUDED.provider_profile_id,
    status = EXCLUDED.status;

-- 7. Inserir Grande Volume de Avaliações com Diferentes Médias
-- Usuários avaliadores:
-- 2: Lucas, 3: Maria, 10: João Pedro, 11: Beatriz, 12: Fernando
DELETE FROM avaliacoes;
INSERT INTO avaliacoes (id, servico_id, provider_profile_id, user_id, nota, comentario, created_at) VALUES
    -- Avaliações de Carlos Silva (id=1, Pintor) -> 4 avaliações (5, 4, 5, 5) -> Média 4.8
    (1, 1, 1, 2, 5, 'Excelente trabalho! Pintura ficou impecável e a equipe foi super limpa e pontual.', NOW() - INTERVAL '30 days'),
    (2, 1, 1, 3, 4, 'Muito bom serviço, cumpriu os prazos estabelecidos. Recomendo com certeza!', NOW() - INTERVAL '20 days'),
    (3, 6, 1, 10, 5, 'A textura grafiato na fachada da loja ficou sensacional. Profissional nota 10.', NOW() - INTERVAL '12 days'),
    (4, 6, 1, 11, 5, 'Muito caprichoso, cobriu todo o chão e não deixou um pingo de tinta cair.', NOW() - INTERVAL '4 days'),

    -- Avaliações de Bruno Pinturas (id=6, Pintor) -> 3 avaliações (4, 4, 3) -> Média 3.7
    (5, 10, 6, 2, 4, 'Foi muito rápido para pintar o apartamento que ia entregar. Valeu a pena.', NOW() - INTERVAL '15 days'),
    (6, 10, 6, 3, 4, 'Bom serviço pelo valor cobrado, terminou no prazo.', NOW() - INTERVAL '8 days'),
    (7, 11, 6, 12, 3, 'A pintura do portão ficou aceitável, mas demorou um pouco mais que o combinado.', NOW() - INTERVAL '2 days'),

    -- Avaliações de Leandro Tintas (id=7, Pintor) -> 5 avaliações (5, 5, 5, 5, 4) -> Média 4.8
    (8, 12, 7, 2, 5, 'O acabamento em cimento queimado na minha sala de jantar ficou de revista de decoração!', NOW() - INTERVAL '25 days'),
    (9, 12, 7, 3, 5, 'Pintor de altíssimo nível. Utilizou os melhores materiais e ferramentas.', NOW() - INTERVAL '18 days'),
    (10, 12, 7, 10, 5, 'Super detalhista, sem nenhum defeito nas molduras de gesso.', NOW() - INTERVAL '14 days'),
    (11, 12, 7, 11, 5, 'Excelente! Vale cada centavo investido no serviço.', NOW() - INTERVAL '7 days'),
    (12, 12, 7, 12, 4, 'Serviço de altíssima qualidade, recomendo para qualquer um.', NOW() - INTERVAL '1 day'),

    -- Avaliações de Rafael Pintor (id=8, Pintor) -> 1 avaliação (3) -> Média 3.0
    (13, 13, 8, 10, 3, 'Preço bem em conta, mas o acabamento foi bem simples.', NOW() - INTERVAL '6 days'),

    -- Avaliações de Ana Souza (id=2, Eletricista) -> 4 avaliações (5, 5, 5, 5) -> Média 5.0
    (14, 2, 2, 2, 5, 'Ana é extremamente competente e pontual. Resolveu o curto-circuito na hora com muita calma.', NOW() - INTERVAL '28 days'),
    (15, 2, 2, 3, 5, 'Instalação elétrica executada com segurança e muita atenção às normas técnicas.', NOW() - INTERVAL '21 days'),
    (16, 7, 2, 11, 5, 'Conectou o sistema solar com perfeição, super atenciosa nas explicações.', NOW() - INTERVAL '10 days'),
    (17, 7, 2, 12, 5, 'Excelente profissional, rápida e muito organizada.', NOW() - INTERVAL '3 days'),

    -- Avaliações de Rodrigo Eletricista (id=9, Eletricista) -> 3 avaliações (4, 5, 4) -> Média 4.3
    (18, 14, 9, 2, 4, 'Trocou a fiação da casa toda. Ficou muito bom e seguro.', NOW() - INTERVAL '16 days'),
    (19, 14, 9, 10, 5, 'Identificou o fio que estava esquentando imediatamente. Salvou meus eletrodomésticos.', NOW() - INTERVAL '9 days'),
    (20, 15, 9, 11, 4, 'Instalou as fitas de LED no gesso, ficou muito bonito.', NOW() - INTERVAL '4 days'),

    -- Avaliações de Paula Eletricista (id=10, Eletricista) -> 2 avaliações (5, 4) -> Média 4.5
    (21, 16, 10, 3, 5, 'Laudo técnico super detalhado e aceito de primeira pela concessionária.', NOW() - INTERVAL '11 days'),
    (22, 16, 10, 12, 4, 'Profissional com grande conhecimento técnico de engenharia elétrica.', NOW() - INTERVAL '5 days'),

    -- Avaliações de Marcos Eletro (id=11, Eletricista) -> 1 avaliação (4) -> Média 4.0
    (23, 17, 11, 2, 4, 'Veio num sábado à noite trocar o chuveiro e a fiação derretida. Muito prestativo.', NOW() - INTERVAL '7 days'),

    -- Juliana Rocha (id=4, Diarista) -> 0 avaliações (PROPOSITURAMENTE VAZIO para testar 'Sem avaliações ainda')

    -- Avaliações de Sandra Limpeza (id=12, Diarista) -> 5 avaliações (5, 5, 5, 4, 5) -> Média 4.8
    (24, 18, 12, 2, 5, 'A limpeza pós-obra foi um milagre! Tirou todo o pó de gesso e respingos do chão.', NOW() - INTERVAL '22 days'),
    (25, 18, 12, 3, 5, 'Equipe maravilhosa e super dedicada. Entregaram a casa brilhando.', NOW() - INTERVAL '17 days'),
    (26, 18, 12, 10, 5, 'Pontuais, trouxeram todos os produtos adequados para o piso delicado.', NOW() - INTERVAL '13 days'),
    (27, 19, 12, 11, 4, 'Muito boa diarista, casa impecável e roupa bem passada.', NOW() - INTERVAL '8 days'),
    (28, 19, 12, 12, 5, 'Contrato toda semana há dois meses e nunca tive nenhuma reclamação.', NOW() - INTERVAL '2 days'),

    -- Avaliações de Camila Clean (id=13, Diarista) -> 2 avaliações (5, 5) -> Média 5.0
    (29, 20, 13, 2, 5, 'Meu sofá parecia novo depois da higienização a seco! Cheiro maravilhoso.', NOW() - INTERVAL '14 days'),
    (30, 20, 13, 3, 5, 'Retirou manchas antigas de café do colchão. Recomendo de olhos fechados.', NOW() - INTERVAL '6 days'),

    -- Avaliações de Valéria Faxinas (id=14, Diarista) -> 1 avaliação (5) -> Média 5.0
    (31, 21, 14, 10, 5, 'Limpeza express perfeita para quem tem pouco tempo e precisa da casa arrumada.', NOW() - INTERVAL '5 days'),

    -- Avaliações de Roberto Santos (id=5, Encanador) -> 3 avaliações (3, 4, 4) -> Média 3.7
    (32, 5, 5, 3, 4, 'Encanador atencioso e rápido para detectar o vazamento na pia da cozinha.', NOW() - INTERVAL '19 days'),
    (33, 5, 5, 10, 4, 'Desentupiu o ralo do banheiro sem quebrar nada.', NOW() - INTERVAL '12 days'),
    (34, 5, 5, 12, 3, 'Resolveu o problema de vazamento, mas deixou um pouco de sujeira no local.', NOW() - INTERVAL '4 days'),

    -- Avaliações de Diego Hidráulica (id=15, Encanador) -> 4 avaliações (5, 4, 5, 4) -> Média 4.5
    (35, 22, 15, 2, 5, 'Instalou a caixa d água de 1000L com encanamento novo e boia automática perfeita.', NOW() - INTERVAL '20 days'),
    (36, 22, 15, 3, 4, 'Muito prestativo, ajustou a pressão da água dos chuveiros.', NOW() - INTERVAL '15 days'),
    (37, 23, 15, 11, 5, 'Fez a troca dos canos de esgoto com muita competência.', NOW() - INTERVAL '9 days'),
    (38, 23, 15, 12, 4, 'Bom serviço e preço justo para troca de conexões PVC.', NOW() - INTERVAL '3 days'),

    -- Avaliações de Marcelo Caça Vazamentos (id=16, Encanador) -> 3 avaliações (5, 5, 5) -> Média 5.0
    (39, 24, 16, 2, 5, 'O aparelho de geofone achou o cano furado embaixo do piso sem precisar quebrar a casa toda!', NOW() - INTERVAL '16 days'),
    (40, 24, 16, 10, 5, 'Minha conta de água vinha altíssima. Ele encontrou o vazamento subterrâneo em 20 minutos.', NOW() - INTERVAL '10 days'),
    (41, 24, 16, 11, 5, 'Incrível a tecnologia e a precisão do trabalho dele. Fantástico.', NOW() - INTERVAL '1 day'),

    -- Avaliações de Marcos Lima (id=3, Marceneiro) -> 2 avaliações (4, 5) -> Média 4.5
    (42, 3, 3, 2, 4, 'Os armários da cozinha ficaram ótimos e o material é de primeira linha.', NOW() - INTERVAL '26 days'),
    (43, 8, 3, 3, 5, 'A restauração do deck da churrasqueira ficou impecável, madeira tratada com carinho.', NOW() - INTERVAL '13 days'),

    -- Avaliações de Eduardo Madeira (id=17, Marceneiro) -> 3 avaliações (5, 5, 4) -> Média 4.7
    (44, 25, 17, 10, 5, 'Cozinha dos sonhos! Acabamento impecável e entrega exatamente na data combinada.', NOW() - INTERVAL '18 days'),
    (45, 25, 17, 11, 5, 'Closet muito espaçoso com divisórias bem pensadas. Marcenaria de primeira.', NOW() - INTERVAL '9 days'),
    (46, 25, 17, 12, 4, 'Ótimo trabalho em MDF naval, excelente montagem.', NOW() - INTERVAL '3 days'),

    -- Avaliações de Thiago Móveis (id=18, Marceneiro) -> 1 avaliação (4) -> Média 4.0
    (47, 26, 18, 2, 4, 'O painel ripado da sala com fita LED ficou lindo demais.', NOW() - INTERVAL '8 days');

-- 8. Inserir Orçamentos (orcamentos)
DELETE FROM orcamentos;
INSERT INTO orcamentos (id, descricao_necessidade, local_atendimento, data_ou_periodo_desejado, servico_id, provider_profile_id, solicitante_id, valor_resposta, descricao_resposta, status_resposta) VALUES
    (1, 'Preciso pintar 3 quartos e 1 corredor na próxima semana.', 'Centro, Arcoverde', 'Próxima segunda-feira pela manhã', 1, 1, 2, 850.00, 'Orçamento inclui mão de obra e proteção dos móveis.', 'RESPONDIDO'),
    (2, 'Troca de fiação antiga de casa térrea de 80m².', 'São Cristóvão, Arcoverde', 'Final do mês', 2, 2, 3, 1200.00, 'Revisão completa de circuitos e disjuntores.', 'PENDENTE'),
    (3, 'Fabricação de balcão de madeira sob medida para comércio.', 'Centro, Arcoverde', 'Urgente', 3, 3, 2, NULL, NULL, 'PENDENTE'),
    (4, 'Pintura completa de sobrado no bairro Boa Vista.', 'Boa Vista, Arcoverde', 'Próximo mês', 6, 1, 10, 2400.00, 'Mão de obra para paredes externas e impermeabilização.', 'RESPONDIDO'),
    (5, 'Detecção de vazamento que está infiltrando na parede do vizinho.', 'Centro, Arcoverde', 'O quanto antes', 24, 16, 11, 350.00, 'Diagnóstico não destrutivo com laudo técnico.', 'RESPONDIDO');

-- 9. Sincronizar Sequences do PostgreSQL com os maiores IDs inseridos
SELECT setval('user_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('provider_profile_id_seq', (SELECT COALESCE(MAX(id), 1) FROM provider_profiles));
SELECT setval('servico_id_seq', (SELECT COALESCE(MAX(id), 1) FROM servicos));
SELECT setval('avaliacao_id_seq', (SELECT COALESCE(MAX(id), 1) FROM avaliacoes));
SELECT setval('orcamento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM orcamentos));
