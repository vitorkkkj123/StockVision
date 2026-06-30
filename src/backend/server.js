// --- MAPEAMENTO DAS ROTAS DA API ---
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/supply', supplyRoutes);   
app.use('/api/demand', demandRoutes);   // Injeção do motor IA de Demanda
app.use('/api/reverse', reverseRoutes); // Injeção da Economia Circular/ESG

// =======================================================
//   ROTEAMENTO E SERVIÇO DE ARQUIVOS ESTÁTICOS (RENDER)
// =======================================================
const path = require('path');

// 1. Libera o acesso público à pasta 'frontend' (essencial para carregar assets/css, assets/js e assets/img)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Rota para carregar as páginas da pasta 'views' de forma amigável (Ex: se acessar /login, abre login.html)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/dashboard.html'));
});

// 3. Rota Coringa: Se acessar a raiz (/) ou qualquer outra rota não mapeada, entrega o index.html principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =======================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Servidor] StockVision operacional e sincronizado na porta ${PORT}`);
});