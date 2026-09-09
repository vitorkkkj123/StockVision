# StockVision

Sistema inteligente de gestão de estoque, demanda, ESG e logística reversa para empresas que desejam centralizar operações de almoxarifado, controle de materiais, previsões de consumo e monitoramento ambiental em uma única plataforma.

## Visão geral

O StockVision foi desenvolvido como uma solução web para gestão operacional de estoque com foco em:

- controle de produtos e inventário;
- cadastro de usuários e empresas;
- previsões de demanda por produto;
- alertas de vencimento e desperdício;
- auditoria e inventário rotativo;
- importação de notas fiscais em XML;
- suporte à logística reversa e indicadores ESG.

A aplicação combina backend em Node.js/Express com banco MongoDB e uma interface frontend em HTML, CSS e JavaScript.

## Funcionalidades principais

### 1. Autenticação e gestão de usuários
- cadastro de empresa e administrador;
- login com JWT;
- controle de acesso por perfil;
- gestão de funcionários vinculados à empresa;
- status ativo/inativo de usuários.

### 2. Gestão de estoque
- cadastro de produtos;
- listagem de itens do inventário;
- métricas do dashboard de estoque;
- atualização e remoção de materiais;
- importação em lote de produtos via XML de nota fiscal.

### 3. Previsão de demanda
- análise de consumo por produto;
- cálculo de previsões com base em histórico e giro de estoque;
- suporte para testes com histórico mockado.

### 4. ESG e logística reversa
- alertas de vencimento e produtos críticos;
- registro de defeitos ou danos;
- indicadores de desperdício e sustentabilidade;
- painel de métricas ESG;
- acompanhamento de retorno e destino de materiais.

### 5. Operação e auditoria
- relatórios de inventário rotativo;
- acompanhamento de divergências de estoque;
- integração com processos de auditoria operacional.

## Stack tecnológica

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT para autenticação
- bcrypt para hash de senhas
- dotenv para variáveis de ambiente
- CORS
- HTML, CSS e JavaScript no frontend

## Estrutura do projeto

```bash
StockVision/
├── package.json
├── README.md
├── src/
│   ├── backend/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── demandController.js
│   │   │   ├── esgController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── reverseController.js
│   │   │   ├── stockController.js
│   │   │   └── supplyController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Partner.js
│   │   │   ├── Product.js
│   │   │   ├── ReverseLogistics.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── demandRoutes.js
│   │   │   ├── esgRoutes.js
│   │   │   ├── reverseRoutes.js
│   │   │   ├── stockRoutes.js
│   │   │   └── supplyRoutes.js
│   │   └── server.js
│   └── frontend/
│       ├── assets/
│       │   ├── css/
│       │   └── js/
│       ├── index.html
│       └── views/
│           ├── dashboard.html
│           ├── demand.html
│           ├── esg.html
│           ├── login.html
│           ├── partners.html
│           ├── register.html
│           ├── reverse.html
│           └── stock.html
```

## Requisitos

- Node.js 18+
- MongoDB em execução
- npm
- acesso a um terminal para executar a aplicação

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/stockvision
JWT_SECRET=sua-chave-secreta-super-forte
```

> Ajuste a URL do MongoDB conforme o seu ambiente local, cloud ou container.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/vitorkkkj123/StockVision
cd StockVision
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` conforme explicado acima.

4. Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```

Ou em produção:

```bash
npm start
```

## Acesso ao sistema

Após iniciar o servidor, abra no navegador:

```text
http://localhost:3000
```

A aplicação serve a interface frontend e também expõe a API no mesmo host.

## Principais rotas da API

### Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/employees`
- `GET /api/auth/employees`
- `PUT /api/auth/employees/:employeeId`

### Estoque
- `POST /api/stock`
- `GET /api/stock`
- `GET /api/stock/metrics`
- `PUT /api/stock/:id`
- `DELETE /api/stock/:id`
- `POST /api/stock/invoice/xml`

### ESG
- `POST /api/esg/damage`
- `GET /api/esg/expiration-alerts`
- `GET /api/esg/dashboard`

### Demanda
- `GET /api/demand/forecast`
- `POST /api/demand/mock-history/:id`

### Logística reversa
- `GET /api/reverse/analytics`
- `POST /api/reverse/return`

## Fluxo de uso

1. Cadastre uma empresa e um usuário administrador.
2. Faça login na plataforma.
3. Registre produtos no estoque.
4. Acompanhe métricas do dashboard.
5. Consulte alertas de vencimento e ESG.
6. Use a previsão de demanda para planejamento.
7. Registre devoluções e itens em logística reversa.

## Observações importantes

- A autenticação é protegida por JWT.
- Os dados são vinculados pela empresa do usuário logado, reduzindo risco de cruzamento de informações entre clientes ou unidades.
- O projeto foi pensado como solução de estudo/projeto integrador, mas pode servir como base para evolução para uso real.

## Scripts disponíveis

```json
"scripts": {
  "start": "node src/backend/server.js",
  "dev": "nodemon src/backend/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## Licença

Este projeto está em desenvolvimento e pode ser adaptado conforme a necessidade da equipe ou do professor orientador.

## Autor

- **Vitor Guilherme** - [GitHub](https://github.com/vitorkkkj123)
- Turma de Analise e Desenvolvimento de Sistemas

## Dúvidas e melhorias

Se quiser evoluir o projeto, os próximos passos naturais podem ser:

- adicionar testes automatizados;
- implementar painel administrativo mais completo;
- integrar com banco em nuvem;
- criar exportação de relatórios em PDF/Excel;
- evoluir o módulo de previsão com IA mais robusta.
