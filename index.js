const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const connection = require('./db'); // Importa a conexão com o banco de dados MySQL
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = '192.168.0.100';  // Atualize para o IP correto da sua máquina

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/submit', (req, res) => {
  const { nome, email, assunto, complaint } = req.body;

  // Inserir os dados no banco de dados MySQL
  const sql = 'INSERT INTO solicitacoes (nome, email, assunto, descricao) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nome, email, assunto, complaint], (err, result) => {
    if (err) {
      console.error('Erro ao salvar no banco de dados:', err);
      return res.status(500).send('Erro ao salvar a solicitação.');
    }
    console.log('Solicitação salva no banco de dados com sucesso!');

    // Agora, enviar o e-mail de confirmação
    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
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
              background: #ffffff; /* Fundo branco */
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
              border-bottom: 4px solid #041b33; /* Linha inferior azul para destaque */
            }
            h1 {
              font-weight: 700;
              font-size: 2.5rem;
              margin: 1rem 0;
              color: #041b33;
              font-family: 'Poppins', sans-serif;
              letter-spacing: 1px;
              text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
              background: linear-gradient(135deg, #041b33, #041b33);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 1.5rem;
            }
            p {
              font-size: 1.2rem;
              margin: 0.5rem 0;
              line-height: 1.5;
            }
            .footer {
              margin-top: 20px;
              font-size: 1rem;
              color: #041b33;
              border-top: 2px solid #041b33;
              padding: 10px 0;
              position: relative;
              background: #ffffff;
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
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong></p>
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

    console.log('Tentando enviar e-mail...');

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar o e-mail:', error);
        return res.status(500).send('Erro ao enviar o e-mail.');
      }
      console.log('E-mail enviado:', info.response);
      res.redirect('/thank-you.html?status=success');
    });
  });
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
