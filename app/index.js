const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

async function initDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await connection.end();
}

async function addPerson(name) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('INSERT INTO people (name) VALUES (?)', [name]);
  await connection.end();
}

async function getPeople() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT name FROM people ORDER BY created_at DESC');
  await connection.end();
  return rows;
}

app.get('/', async (req, res) => {
  try {
    // Adiciona um novo nome à lista
    const names = ['Wesley', 'João', 'Maria', 'José', 'Ana', 'Pedro', 'Paulo', 'Lucas', 'Marcos', 'Mateus'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    await addPerson(randomName);
    
    // Busca todos os nomes
    const people = await getPeople();
    
    let html = '<h1>Full Cycle Rocks!</h1>';
    html += '<ul>';
    
    for (const person of people) {
      html += `<li>${person.name}</li>`;
    }
    
    html += '</ul>';
    
    res.send(html);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao processar requisição');
  }
});

// Inicializa o banco e inicia o servidor
initDatabase()
  .then(() => {
    console.log('Banco de dados inicializado com sucesso!');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  });
