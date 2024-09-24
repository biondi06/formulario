const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const connection = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = '192.168.0.100';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/submit', (req, res) => {
  const { nome, email, setor, assunto, complaint, dataProblema, comportamento, responsabilidade } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('E-mail inválido. Por favor, insira um e-mail válido.');
  }

  if (!responsabilidade) {
    return res.status(400).send('Você deve concordar com os termos do site.');
  }

  const sql = 'INSERT INTO solicitacoes (nome, email, setor, assunto, descricao, dataProblema, comportamento) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [nome, email, setor, assunto, complaint, dataProblema, comportamento], (err, result) => {
    if (err) {
      console.error('Erro ao salvar no banco de dados:', err);
      return res.status(500).send('Erro ao salvar a solicitação.');
    }
    console.log('Solicitação salva no banco de dados com sucesso!');

    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Suporte TI: ${assunto}`,
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #333;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              color: #333;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
              border: 1px solid #ddd;
              position: relative;
              overflow: hidden;
            }
            .header {
              background: #ffffff;
              padding: 10px 0;
            }
            .header img {
              max-width: 100%;
              height: auto;
              border-radius: 12px 12px 0 0;
              border-bottom: 4px solid #041b33;
            }
            h1 {
              font-weight: 700;
              font-size: 2.5rem;
              margin: 1rem 0;
              color: #041b33;
              font-family: 'Poppins', sans-serif;
              letter-spacing: 1px;
              margin-bottom: 1.5rem;
            }
            p {
              font-size: 1.2rem;
              margin: 0.5rem 0;
              line-height: 1.5;
              text-align: center;
            }
            .footer {
              margin-top: 20px;
              font-size: 1rem;
              color: #041b33;
              border-top: 2px solid #041b33;
              padding: 10px 0;
              position: relative;
              background: #ffffff;
              text-align: center;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              border-radius: 30px;
              background: #041b33;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              font-size: 1.2rem;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              transition: background 0.3s ease, transform 0.3s ease;
            }
            .button:hover {
              background: #003366;
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://app.tangerino.com.br/Tangerino/pages/image?banner=14727" alt="Banner">
            </div>
            <h1>Nova Solicitação de TI</h1>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Setor:</strong> ${setor}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Data do Problema:</strong> ${dataProblema}</p>
            <p><strong>Comportamento Observado:</strong> ${comportamento}</p>
            <p><strong>Descrição:</strong></p>
            <p>${complaint}</p>
            <div class="footer">
              <p>&copy; 2024 Thomaz Alves Advogados. Todos os direitos reservados.</p>
              <a href="mailto:${process.env.EMAIL_USER}" class="button">Responder</a>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const mailOptionsUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de Solicitação de Suporte TI',
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #333;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              color: #333;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
              border: 1px solid #ddd;
              position: relative;
              overflow: hidden;
            }
            .header {
              background: #ffffff;
              padding: 10px 0;
            }
            .header img {
              max-width: 100%;
              height: auto;
              border-radius: 12px 12px 0 0;
              border-bottom: 4px solid #041b33;
            }
            h1 {
              font-weight: 700;
              font-size: 2.5rem;
              margin: 1rem 0;
              color: #041b33;
              font-family: 'Poppins', sans-serif;
              letter-spacing: 1px;
              margin-bottom: 1.5rem;
              text-align: center;
            }
            p {
              font-size: 1.2rem;
              margin: 0.5rem 0;
              line-height: 1.5;
              text-align: center;
            }
            .footer {
              margin-top: 20px;
              font-size: 1rem;
              color: #041b33;
              border-top: 2px solid #041b33;
              padding: 10px 0;
              position: relative;
              background: #ffffff;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://app.tangerino.com.br/Tangerino/pages/image?banner=14727" alt="Banner">
            </div>
            <h1>Confirmação de Solicitação de TI</h1>
            <p>Olá, ${nome}!</p>
            <p>Recebemos sua solicitação de suporte com o seguinte assunto:</p>
            <p><strong>${assunto}</strong></p>
            <p>Nossa equipe está trabalhando para resolver sua solicitação. Você receberá uma resposta em breve.</p>
            <div class="footer">
              <p>&copy; 2024 Thomaz Alves Advogados. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    transporter.sendMail(mailOptionsAdmin, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail para o administrador:', error);
        return res.status(500).send('Erro ao enviar o e-mail.');
      }
      console.log('E-mail para o administrador enviado:', info.response);

      transporter.sendMail(mailOptionsUser, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail de confirmação para o usuário:', error);

          if (error.response && error.response.includes('550')) {
            return res.status(400).send('O e-mail fornecido não existe. Por favor, verifique e tente novamente.');
          } else {
            return res.status(500).send('Erro ao enviar o e-mail.');
          }
        }
        console.log('E-mail de confirmação enviado para o usuário:', info.response);
        res.redirect('/thank-you.html?status=success');
      });
    });
  });
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
