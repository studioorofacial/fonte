const nodemailer = require('nodemailer');
const { getActiveUsersEmails } = require('../models/usersModel');

// Transportador configurado pro Gmail. Precisa de:
//   EMAIL_USER = seu-email@gmail.com
//   EMAIL_PASS = senha de app do Gmail (NÃO é a senha normal da conta)
//
// Como gerar a senha de app:
// 1. Ative a verificação em 2 etapas na conta Google
// 2. Acesse https://myaccount.google.com/apppasswords
// 3. Gere uma senha de app pro "Mail" e cole em EMAIL_PASS no .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Envia um e-mail genérico
async function enviarEmail({ to, subject, html }) {
    return transporter.sendMail({
        from: `"Studio Orofacial" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}

// Dispara os e-mails de uma nova mensagem de contato:
// 1. Um aviso pra todos os usuários ativos (admins) do sistema
// 2. Uma confirmação pro próprio visitante que preencheu o formulário
async function enviarNotificacaoContato({ name, email, message }) {
    const mensagemFormatada = String(message).replace(/\n/g, '<br>');

    const adminEmails = await getActiveUsersEmails();

    const tarefas = [];

    if (adminEmails.length > 0) {
        tarefas.push(enviarEmail({
            to: adminEmails.join(','),
            subject: `Nova mensagem de contato — ${name}`,
            html: `
                <h2>Nova mensagem recebida pelo site</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagemFormatada}</p>
            `
        }));
    } else {
        console.warn('Nenhum usuário ativo encontrado para notificar sobre a nova mensagem.');
    }

    tarefas.push(enviarEmail({
        to: email,
        subject: 'Recebemos sua mensagem — Studio Orofacial',
        html: `
            <h2>Olá, ${name}!</h2>
            <p>Recebemos sua mensagem e em breve nossa equipe entrará em contato.</p>
            <p><strong>Sua mensagem:</strong></p>
            <p>${mensagemFormatada}</p>
            <br>
            <p>Studio Orofacial</p>
        `
    }));

    return Promise.all(tarefas);
}

module.exports = { enviarEmail, enviarNotificacaoContato };
