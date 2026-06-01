import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'bivago_db'
};

// GET: Listar reservas
app.get('/api/reservas', async (req: Request, res: Response) => {
    const conexao = await mysql.createConnection(dbConfig);
    const [linhas] = await conexao.execute('SELECT * FROM reservas');
    conexao.end();
    res.json(linhas);
});

// POST: Criar reserva
app.post('/api/reservas', async (req: Request, res: Response) => {
    const { quarto, preco, hospede, checkin, checkout } = req.body;
    const conexao = await mysql.createConnection(dbConfig);
    await conexao.execute(
        'INSERT INTO reservas (quarto, preco, hospede, checkin, checkout) VALUES (?, ?, ?, ?, ?)',
        [quarto, preco, hospede, checkin, checkout]
    );
    conexao.end();
    res.status(201).json({ mensagem: 'Reserva criada!' });
});

// PUT: Atualizar reserva
app.put('/api/reservas/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { checkin, checkout } = req.body;
    const conexao = await mysql.createConnection(dbConfig);
    await conexao.execute('UPDATE reservas SET checkin = ?, checkout = ? WHERE id = ?', [checkin, checkout, id]);
    conexao.end();
    res.json({ mensagem: 'Reserva atualizada!' });
});

// DELETE: Deletar reserva
app.delete('/api/reservas/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const conexao = await mysql.createConnection(dbConfig);
    await conexao.execute('DELETE FROM reservas WHERE id = ?', [id]);
    conexao.end();
    res.json({ mensagem: 'Reserva deletada!' });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));