const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '192.168.0.100',       // Endereço IP da máquina que hospeda o MySQL
  user: 'root',                // Seu usuário MySQL
  password: '53534125',        // Sua senha MySQL
  database: 'solicitacao_ti'   // Nome do banco de dados que criamos
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conexão com MySQL estabelecida com sucesso!');
});

module.exports = connection;
