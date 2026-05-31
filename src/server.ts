import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// rota teste inicial
app.get('/api/status', (req, res) => {
  res.json({ message: "API do Bivago Hotel rodando com sucesso!" });
});

// quartos mockados por enquanto
const quartos = [
  { id: 1, nome: "Quarto Standard Casal", tipo: "standard", preco: 180, imagem: "https://via.placeholder.com/300", descricao: "Ar condicionado, Wi-Fi e TV a cabo." },
  { id: 2, nome: "Quarto Deluxe Vista Mar", tipo: "deluxe", preco: 350, imagem: "https://via.placeholder.com/300", descricao: "Frigobar, cama king size e varanda." },
  { id: 3, nome: "Suíte Master Bivago", tipo: "suite", preco: 600, imagem: "https://via.placeholder.com/300", descricao: "Hidromassagem, sala de estar e vista panorâmica." }
];

// rota disponibilidade
app.get('/api/quartos/buscar', (req, res) => {
  const { checkin, checkout, tipo } = req.query;

  // filtra pelo tipo de quarto
  const quartosDisponiveis = quartos.filter(quarto => quarto.tipo === tipo);

  // retorna os quartos encontradps
  res.json({
    periodo: { checkin, checkout },
    quartos: quartosDisponiveis
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});