-- This is using pgCrypto so using your PM of choice install "postgresql contrib"

-- Truncate tables in reverse order of dependencies to avoid constraint issues
-- Start with tables that are referenced by others
TRUNCATE TABLE reply CASCADE;
TRUNCATE TABLE feedback CASCADE;
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE company CASCADE;
TRUNCATE TABLE category CASCADE;
TRUNCATE TABLE "status" CASCADE;

-- Reset sequences for SERIAL columns after TRUNCATE 
ALTER SEQUENCE category_idcategory_seq RESTART WITH 1;
ALTER SEQUENCE company_idcompany_seq RESTART WITH 1;
ALTER SEQUENCE user_iduser_seq RESTART WITH 1;
ALTER SEQUENCE feedback_idfeedback_seq RESTART WITH 1;
ALTER SEQUENCE status_idStatus_seq RESTART WITH 1;
ALTER SEQUENCE reply_idreply_seq RESTART WITH 1;

-- Populate the category table (no dependencies)
INSERT INTO category (typeCategory, colorCategory) VALUES
('Qualidade do Produto', '#4CAF50'),      
('Atendimento ao Cliente', '#2196F3'),
('Usabilidade do Site', '#FF9800'),
('Velocidade de Entrega', '#9C27B0'),
('Preços', '#F44336'),
('Relatório de Bug', '#795548'),
('Solicitação de Funcionalidade', '#607D8B'),
('Feedback Geral', '#9E9E9E');


-- Populate the status table (no dependencies)
INSERT INTO "status" (typeStatus, colorStatus) VALUES
('Pendente', '#FF9800'),
('Em Andamento', '#2196F3'),
('Resolvido', '#4CAF50'),
('Fechado', '#9E9E9E'),
('Rejeitado', '#F44336');

-- Populate the company table (no dependencies)
INSERT INTO company (nameCompany, emailCompany, CNPJCompany) VALUES
('EchoBox Solutions', 'contato@echobox.com', '12345678000100'),
('Tech Innovations Inc.', 'info@techinnovations.com', '98765432000199'),
('Serviços Globais Ltda.', 'suporte@servicosglobais.com', '11223344000155'),
('Negócios Locais Co.', 'ola@negocioslocais.co', '55667788000122'),
('Soluções Digitais', 'contato@solucoesdigitais.com', '99887766000144'),
('Cliente Primeiro Corp', 'suporte@clienteprimeiro.com', '33445566000177');

-- Populate the "user" table (depends on company)
INSERT INTO "user" (emailUser, passwordUser, pictureUser, fk_user_idCompany) VALUES
('admin@echobox.com', encode(digest('admin123', 'sha256'), 'hex'), 'https://placehold.co/250?text=admin@echobox.com', 1),
('alice@techinnovations.com', encode(digest('password123', 'sha256'), 'hex'), 'https://placehold.co/250?text=alice@techinnovations.com', 2),
('bob@servicosglobais.com', encode(digest('securepass', 'sha256'), 'hex'), 'https://placehold.co/250?text=bob@servicosglobais.com', 3),
('diana@negocioslocais.com', encode(digest('userpass', 'sha256'), 'hex'), 'https://placehold.co/250?text=diana@negocioslocais.com', 4),
('charlie@solucoesdigitais.com', encode(digest('mypassword', 'sha256'), 'hex'), 'https://placehold.co/250?text=charlie@solucoesdigitais.com', 5),
('eva@clienteprimeiro.com', encode(digest('strongpass', 'sha256'), 'hex'), 'https://placehold.co/250?text=eva@clienteprimeiro.com', 6),
('joao@echobox.com', encode(digest('testpass', 'sha256'), 'hex'), 'https://placehold.co/250?text=joao@echobox.com', 1),
('sarah@techinnovations.com', encode(digest('devpass', 'sha256'), 'hex'), 'https://placehold.co/250?text=sarah@techinnovations.com', 2);

-- Populate the feedback table (depends on user, company, category, status)
INSERT INTO feedback (titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus) VALUES
('Excelente Qualidade do Produto!', 'O produto superou minhas expectativas em termos de qualidade e funcionalidades. Muito satisfeito com a compra.', 2, 1, 1, 3),
('Resposta Lenta do Atendimento', 'Levei vários dias para receber uma resposta do atendimento ao cliente. Pode ser melhorado.', 3, 2, 2, 2),
('Problemas de Navegação no Site', 'Tive dificuldade para encontrar as informações que precisava no site. A navegação poderia ser mais intuitiva.', 4, 1, 3, 1),
('Entrega Muito Rápida', 'Recebi meu pedido muito mais rápido do que esperava. Excelente logística!', 5, 3, 4, 3),
('Preços Competitivos', 'Os preços são muito competitivos para as funcionalidades oferecidas. Bom custo-benefício.', 6, 4, 5, 3),
('Bug no Aplicativo Mobile', 'Encontrei um bug crítico ao usar o aplicativo mobile no Android. Não consegui finalizar a compra.', 7, 1, 6, 2),
('Solicitação: Modo Escuro', 'Adoraria ver uma opção de modo escuro no aplicativo. Melhoraria muito a experiência do usuário.', 8, 1, 7, 1),
('Experiência Geral Excelente', 'Tive uma experiência maravilhosa com seu serviço. Continue com o bom trabalho!', 1, 1, 8, 3),
('Processo de Pagamento Muito Complexo', 'O processo de pagamento tem muitas etapas. Poderia ser simplificado para melhor experiência do usuário.', 2, 2, 3, 2),
('Documentação do Produto Precisa Melhorar', 'A documentação do produto está incompleta e poderia ter mais exemplos.', 3, 3, 1, 1),
('Atendimento ao Cliente Fantástico', 'A equipe de atendimento foi extremamente prestativa e resolveu meu problema rapidamente.', 4, 4, 2, 3),
('Embalagem de Entrega Excelente', 'Os itens chegaram em perfeitas condições graças à excelente embalagem.', 5, 5, 4, 3);

-- Populate the reply table (depends on feedback and user)
-- Adding some replies to existing feedback
INSERT INTO reply (titleReply, reviewReply, fk_reply_idFeedback, fk_reply_idUser) VALUES
('Obrigado pelo seu feedback!', 'Realmente apreciamos sua avaliação positiva. Ficamos felizes que você esteja satisfeito com a qualidade do nosso produto.', 1, 1),
('Estamos trabalhando nisso', 'Obrigado por nos alertar sobre isso. Estamos trabalhando para melhorar nossos tempos de resposta.', 2, 1),
('Melhorias na navegação em breve', 'Anotamos seu feedback e estamos planejando um redesign do site para melhorar a navegação.', 3, 1),
('Ótimo saber!', 'Ficamos felizes que nosso serviço de entrega atendeu suas expectativas. Obrigado pelo feedback!', 4, 1),
('Correção de bug em andamento', 'Identificamos o problema e nossa equipe de desenvolvimento está trabalhando em uma correção. Atualização em breve.', 6, 7),
('Modo escuro em consideração', 'Esta é uma solicitação popular! Estamos avaliando a implementação do modo escuro para nossa próxima atualização principal.', 7, 1),
('Revisão do processo de pagamento', 'Estamos revisando nosso fluxo de pagamento baseado no feedback dos usuários. A simplificação é uma prioridade.', 9, 1);