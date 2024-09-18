const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '192.168.0.100',       
  user: 'root',                
  password: '53534125',        
  database: 'solicitacao_ti'   
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conexão com MySQL estabelecida com sucesso!');
});

module.exports = connection;
