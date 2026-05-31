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
    {
        id: 1,
        nome: 'Quarto Standard Charmoso',
        tipo: 'standard',
        descricao: 'Ar condicionado, Wi-Fi e TV a cabo. Perfeito para uma estadia prática e confortável.',
        preco: 180,
        imagem: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        nome: 'Quarto Deluxe King Size',
        tipo: 'deluxe',
        descricao: 'Cama King Size, frigobar, varanda e decoração premium para máximo conforto.',
        preco: 350,
        imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        nome: 'Suite Luxo com Varanda',
        tipo: 'suite',
        descricao: 'Hidromassagem, sala de estar, vista panorâmica e serviço de quarto 24h.',
        preco: 600,
        imagem: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
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