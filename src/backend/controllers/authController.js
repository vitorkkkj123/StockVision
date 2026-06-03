const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função auxiliar para gerar o Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

/**
 * LÓGICA DE CADASTRO (REGISTRO INICIAL DA EMPRESA)
 */
exports.register = async (req, res) => {
    try {
        const { fullname, email, company, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este e-mail já está em uso no sistema.' });
        }

        const companyExists = await User.findOne({ 
            company: { $regex: new RegExp(`^${company.trim()}$`, 'i') } 
        });

        let shouldBeAdmin = false;
        if (!companyExists) {
            shouldBeAdmin = true;
        }

        const newUser = await User.create({
            fullname,
            email,
            company: company.trim(),
            password,
            isAdmin: shouldBeAdmin
        });

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            token: generateToken(newUser._id),
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                company: newUser.company,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao processar o cadastro.', error: error.message });
    }
};

/**
 * LÓGICA DE LOGIN GERAL
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas (E-mail ou senha incorretos).' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Esta conta foi desativada pelo Administrador da empresa.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas (E-mail ou senha incorretos).' });
        }

        return res.status(200).json({
            message: 'Autenticação bem-sucedida!',
            token: generateToken(user._id),
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                company: user.company,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao processar o login.', error: error.message });
    }
};

/**
 * LÓGICA EXCLUSIVA DO ADM: REGISTRAR FUNCIONÁRIO
 * Regra de Negócio: Herda automaticamente a empresa do ADM logado (bloqueado para o funcionário)
 * e define forçadamente isAdmin como false.
 */
exports.registerEmployee = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // 1. O middleware 'protect' injetou o ADM em req.user. Vamos capturar a empresa dele.
        const adminCompany = req.user.company;

        // 2. Validar se o e-mail do novo funcionário já existe no sistema global
        const employeeExists = await User.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Este e-mail já está registado no ecossistema StockVision.' });
        }

        // 3. Cria a conta do funcionário vinculada à organização jurídica do ADM
        const newEmployee = await User.create({
            fullname,
            email,
            company: adminCompany, // Herança forçada e bloqueada da empresa
            password,
            isAdmin: false // Garantia de infraestrutura que a conta não terá privilégios de ADM
        });

        return res.status(201).json({
            message: `Funcionário registado com sucesso para a empresa ${adminCompany}!`,
            employee: {
                id: newEmployee._id,
                fullname: newEmployee.fullname,
                email: newEmployee.email,
                company: newEmployee.company,
                isAdmin: newEmployee.isAdmin,
                isActive: newEmployee.isActive
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao registar funcionário.', error: error.message });
    }
};

/**
 * LÓGICA EXCLUSIVA DO ADM: LISTAR FUNCIONÁRIOS DA SUA EMPRESA
 * Isolamento Multitenant: O ADM só vê os funcionários da própria organização.
 */
exports.listEmployees = async (req, res) => {
    try {
        const adminCompany = req.user.company;

        // Procura todos os utilizadores daquela empresa que NÃO sejam o próprio ADM
        const employees = await User.find({ 
            company: adminCompany, 
            _id: { $ne: req.user._id } 
        }).select('-password'); // Oculta o hash das senhas por segurança na listagem

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar funcionários.', error: error.message });
    }
};

/**
 * LÓGICA EXCLUSIVA DO ADM: ALTERAR SENHA OU STATUS DO FUNCIONÁRIO
 * Objetivo: Permitir que apenas o ADM gerencie as credenciais da sua empresa.
 */
exports.updateEmployeeCredentials = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { password, isActive } = req.body;
        const adminCompany = req.user.company;

        // 1. Buscar o funcionário garantindo que ele pertence à MESMA empresa do ADM
        const employee = await User.findOne({ _id: employeeId, company: adminCompany });

        if (!employee) {
            return res.status(404).json({ message: 'Funcionário não encontrado ou não pertence à sua organização.' });
        }

        // 2. Se o ADM enviou uma nova senha, atualiza (o pre-save hook do Mongoose vai criptografar automaticamente)
        if (password) {
            employee.password = password;
        }

        // 3. Se o ADM alterou o status de ativação da conta (Ativo/Inativo)
        if (typeof isActive !== 'undefined') {
            employee.isActive = isActive;
        }

        await employee.save();

        return res.status(200).json({
            message: `Credenciais do funcionário ${employee.fullname} atualizadas com sucesso!`,
            employee: {
                id: employee._id,
                fullname: employee.fullname,
                email: employee.email,
                isActive: employee.isActive
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Erro ao gerenciar credenciais.', error: error.message });
    }
};